import {useRouter} from "next/router";
import { gql, useQuery } from '@apollo/client';
import {Spin} from 'antd';
import Cover from './Cover';
import Details from './Details';
import Feed from './Feed';
import Page404 from '../../pages/404';
import Page500 from '../../pages/500';
import consoleLog from "../../lib/consoleLog";
import styles from './profile.module.scss';
import AppContext from "../utils/AppContext";
import {useContext, useState} from "react";

export const PROFILE_QUERY = gql`
  query Profile($request: SingleProfileQueryRequest!, $who: ProfileId) {
    profile(request: $request) {
      id
      handle
      ownedBy
      name
      metadata
      followNftAddress
      isFollowedByMe
      isFollowing(who: $who)
      attributes {
        key
        value
      }
      bio
      stats {
        totalFollowers
        totalFollowing
        totalPosts
        totalComments
        totalMirrors
      }
      picture {
        ... on MediaSet {
          original {
            url
          }
        }
        ... on NftImage {
          uri
        }
      }
      coverPicture {
        ... on MediaSet {
          original {
            url
          }
        }
      }
      followModule {
        __typename
      }
    }
  }
`

export default function Profile() {
	const {
		query: { username }
	} = useRouter()

	const [profile, setProfile] = useState(null);
	const [following, setFollowing] = useState(false);

	const {currentUser} = useContext(AppContext);

	const { data, loading, error } = useQuery(PROFILE_QUERY, {
		variables: { request: { handle: username }, who: currentUser?.id ?? null },
		skip: !username,
		onCompleted(data) {
			setProfile(data?.profile);
			setFollowing(data?.profile?.isFollowedByMe);
			consoleLog(
				'Query',
				'#8b5cf6',
				`Fetched profile details Profile:${data?.profile?.id}`
			)
		}
	})

	if (error) return <Page500 />
	if (loading || !data) return <Spin />
	if (!loading && !data?.profile) return <Page404 />

	return (
		<div>
			<Cover cover={profile?.coverPicture?.original?.url}/>
			<Details profile={profile} following={following} setFollowing={setFollowing}/>
			<Feed profile={profile} following={following} className={styles.feed}/>
		</div>
	)
}
