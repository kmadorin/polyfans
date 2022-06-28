import {gql, useQuery} from '@apollo/client';
import {CommentFields} from '../../graphql/CommentFields';
import {MirrorFields} from '../../graphql/MirrorFields';
import {PostFields} from '../../graphql/PostFields';
import consoleLog from "../../lib/consoleLog";
import {useState, useContext} from 'react';
import AppContext from "../utils/AppContext";
import SinglePost from "../Post/SinglePost";

const PROFILE_FEED_QUERY = gql`
  query ProfileFeed(
    $request: PublicationsQueryRequest!
    $reactionRequest: ReactionFieldResolverRequest
  ) {
    publications(request: $request) {
      items {
        ... on Post {
          ...PostFields
        }
        ... on Comment {
          ...CommentFields
        }
        ... on Mirror {
          ...MirrorFields
        }
      }
      pageInfo {
        totalCount
        next
      }
    }
  }
  ${PostFields}
  ${CommentFields}
  ${MirrorFields}
`

export default function Feed({profile}) {
	const [publications, setPublications] = useState([]);
	const {currentUser} = useContext(AppContext);

	const type = 'POST';

	const {data, loading, error, fetchMore} = useQuery(PROFILE_FEED_QUERY, {
		variables: {
			request: {publicationTypes: type, profileId: profile?.id, limit: 10},
			reactionRequest: currentUser ? {profileId: currentUser?.id} : null
		},
		skip: !profile?.id,
		fetchPolicy: 'no-cache',
		onCompleted(data) {
			setPublications(data?.publications?.items)
			consoleLog(
				'Query',
				'#8b5cf6',
				`Fetched first 10 profile publications Profile:${profile?.id}`
			)
		}
	})

	return (
		<>
			{!error && !loading && data?.publications?.items?.length !== 0 && (
				<>
					{publications.map((post, idx) => (
							<SinglePost key={`${post?.id}_${idx}`} post={post}/>
						))
					}
				</>
			)}
		</>
	)
}
