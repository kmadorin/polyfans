import useXmtpClient from './useXmtpClient';
import buildConversationId from '../lib/buildConversationId';
import chunkArray from '../lib/chunkArray';
import { buildConversationKey, parseConversationKey } from '../lib/conversationKey';
import conversationMatchesProfile from '../lib/conversationMatchesProfile';
import type { Conversation, Stream } from '@xmtp/xmtp-js';
import { SortDirection } from '@xmtp/xmtp-js';
import type { DecodedMessage } from '@xmtp/xmtp-js/dist/types/src/Message';
import {gql, useLazyQuery} from '@apollo/client';
// import type { Profile } from 'lens';
import { MinimalProfileFields } from '../graphql/MinimalProfileFields';
// import { useProfilesLazyQuery } from 'lens';
import { useEffect, useState, useContext } from 'react';
import { useMessengerStore } from '../store/messenger';
import AppContext from '../components/utils/AppContext';

const MAX_PROFILES_PER_REQUEST = 50;

const PROFILES_QUERY = gql`
  query Profiles($request: ProfileQueryRequest!) {
    profiles(request: $request) {
      items {
        ...MinimalProfileFields
        isDefault
        isFollowedByMe
      }
      pageInfo {
        next
        totalCount
      }
    }
  }
  ${MinimalProfileFields}
`

const useChats = () => {
  // const router = useRouter();
  const { currentUser } = useContext(AppContext);
  const conversations = useMessengerStore((state) => state.conversations);
  const setConversations = useMessengerStore((state) => state.setConversations);
  const chatsProfiles = useMessengerStore((state) => state.chatsProfiles);
  const setChatsProfiles = useMessengerStore((state) => state.setChatsProfiles);
  const chats = useMessengerStore((state) => state.chats);
  const setChats = useMessengerStore((state) => state.setChats);
  const selectedProfileId = useMessengerStore((state) => state.selectedProfileId);
  const setSelectedProfileId = useMessengerStore((state) => state.setSelectedProfileId);
  const setChat = useMessengerStore((state) => state.setChat);
  const reset = useMessengerStore((state) => state.reset);
  const { client, loading: creatingXmtpClient } = useXmtpClient();
  const [profileIds, setProfileIds] = useState<Set<string>>(new Set<string>());
  const [messagesLoading, setMessagesLoading] = useState<boolean>(true);
  const [profilesLoading, setProfilesLoading] = useState<boolean>(false);
  const [profilesError, setProfilesError] = useState<Error | undefined>();
  // const selectedTab = useMessengerStore((state) => state.selectedTab);
  // const [profilesToShow, setProfilesToShow] = useState<Map<string, Profile>>(new Map());
  // const [requestedCount, setRequestedCount] = useState(0);
  const [loadProfiles] = useLazyQuery(PROFILES_QUERY);

  const getProfileFromKey = (key: string): string | null => {
    const parsed = parseConversationKey(key);
    const userProfileId = currentUser?.id;
    if (!parsed || !userProfileId) {
      return null;
    }

    return parsed.members.find((member) => member !== userProfileId) ?? null;
  };

  useEffect(() => {
    if (profilesLoading) {
      return;
    }
    const toQuery = new Set(profileIds);

    // Don't both querying for already seen profiles
    for (const profile of Array.from(chatsProfiles.values())) {
      toQuery.delete(profile.id);
    }

    if (!toQuery.size) {
      return;
    }

    const loadLatest = async () => {
      setProfilesLoading(true);
      const newChatsProfiles = new Map(chatsProfiles);
      const chunks = chunkArray(Array.from(toQuery), MAX_PROFILES_PER_REQUEST);
      try {
        for (const chunk of chunks) {
          const result = await loadProfiles({ variables: { request: { profileIds: chunk } } });
          if (!result.data?.profiles.items.length) {
            continue;
          }

          const profiles = result.data.profiles.items;
          for (const profile of profiles) {
            const peerAddress = profile.ownedBy as string;
            const key = buildConversationKey(
              peerAddress,
              buildConversationId(currentUser?.id, profile.id)
            );
            newChatsProfiles.set(key, profile);
          }
        }
      } catch (error: unknown) {
        setProfilesError(error as Error);
      }

      setChatsProfiles(newChatsProfiles);
      setProfilesLoading(false);
    };
    loadLatest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileIds]);

  useEffect(() => {
    if (!client || !currentUser) {
      return;
    }
    const matcherRegex = conversationMatchesProfile(currentUser.id);
    let messageStream: AsyncGenerator<DecodedMessage>;
    let conversationStream: Stream<Conversation>;

    const streamAllMessages = async () => {
      messageStream = await client.conversations.streamAllMessages();

      for await (const message of messageStream) {
        const conversationId = message.conversation.context?.conversationId;
        if (conversationId && matcherRegex.test(conversationId)) {
          const key = buildConversationKey(message.conversation.peerAddress, conversationId);
          setChat(key, message);
        }
      }
    };

    const fetchMostRecentMessage = async (
      convo: Conversation
    ): Promise<{ key: string; message?: DecodedMessage }> => {
      const key = buildConversationKey(convo.peerAddress, convo.context?.conversationId as string);

      const newMessages = await convo.messages({
        limit: 1,
        direction: SortDirection.SORT_DIRECTION_DESCENDING
      });

      if (newMessages.length <= 0) {
        return { key };
      }
      return { key, message: newMessages[0] };
    };

    const listConversations = async () => {
      setMessagesLoading(true);
      const newChats = new Map(chats);
      const newConversations = new Map(conversations);
      const newProfileIds = new Set(profileIds);
      const convos = await client.conversations.list();

      // select conversations for current profile
      const matchingConvos = convos.filter(
        (convo) => convo.context?.conversationId && matcherRegex.test(convo.context.conversationId)
      );

      for (const convo of matchingConvos) {
        const key = buildConversationKey(convo.peerAddress, convo.context?.conversationId as string);
        newConversations.set(key, convo);
      }

      const chatsPreviews = await Promise.all(matchingConvos.map(fetchMostRecentMessage));

      for (const chatPreview of chatsPreviews) {
        const profileId = getProfileFromKey(chatPreview.key);
        if (profileId) {
          newProfileIds.add(profileId);
        }
        if (chatPreview.message) {
          newChats.set(chatPreview.key, chatPreview.message);
        }
      }

      setChats(newChats);
      setConversations(newConversations);
      setMessagesLoading(false);
      if (newProfileIds.size > profileIds.size) {
        setProfileIds(newProfileIds);
      }
    };

    const closeConversationStream = async () => {
      if (!conversationStream) {
        return;
      }
      await conversationStream.return();
    };

    const closeMessageStream = async () => {
      if (messageStream) {
        await messageStream.return(undefined); // eslint-disable-line unicorn/no-useless-undefined
      }
    };

    const streamConversations = async () => {
      closeConversationStream();
      conversationStream = (await client?.conversations?.stream()) || [];
      const matcherRegex = conversationMatchesProfile(currentUser?.id);
      for await (const convo of conversationStream) {
        // Ignore any new conversations not matching the current profile
        if (!convo.context?.conversationId || !matcherRegex.test(convo.context.conversationId)) {
          continue;
        }
        const newConversations = new Map(conversations);
        const newProfileIds = new Set(profileIds);
        const key = buildConversationKey(convo.peerAddress, convo.context.conversationId);
        newConversations.set(key, convo);
        const profileId = getProfileFromKey(key);
        if (profileId && !profileIds.has(profileId)) {
          newProfileIds.add(profileId);
          setProfileIds(newProfileIds);
        }
        setConversations(newConversations);
      }
    };

    listConversations();
    streamConversations();
    streamAllMessages();

    return () => {
      closeConversationStream();
      closeMessageStream();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, currentUser?.id, selectedProfileId]);

  useEffect(() => {
    if (selectedProfileId && currentUser?.id !== selectedProfileId) {
      reset();
      setSelectedProfileId(currentUser?.id);
      router.push('/messenger');
    } else {
      setSelectedProfileId(currentUser?.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  // useEffect(() => {
  //   const partitionedProfiles = Array.from(messageProfiles).reduce(
  //     (result, [key, profile]) => {
  //       const message = previewMessages.get(key);
  //       if (message) {
  //         if (profile.isFollowedByMe) {
  //           result[0].set(key, profile);
  //         } else {
  //           result[1].set(key, profile);
  //         }
  //       }
  //       return result;
  //     },
  //     [new Map<string, Profile>(), new Map<string, Profile>()]
  //   );
  //   setProfilesToShow(selectedTab === 'Following' ? partitionedProfiles[0] : partitionedProfiles[1]);
  //   setRequestedCount(partitionedProfiles[1].size);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [previewMessages, messageProfiles, selectedTab]);

  return {
    authenticating: creatingXmtpClient,
    profileIds: profileIds,
    loading: messagesLoading || profilesLoading,
    chats,
    chatsProfiles,
    // profilesToShow,
    // requestedCount,
    profilesError: profilesError
  };
};

export default useChats;
