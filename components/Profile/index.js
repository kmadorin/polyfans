import {useRouter} from "next/router";
import { gql, useQuery } from '@apollo/client';
import Cover from './Cover';
import Details from './Details';
import Feed from './Feed/';
import Page404 from '../../pages/404';
import Page500 from '../../pages/500';
import consoleLog from "../../lib/consoleLog";
import styles from './profile.module.scss';

export const PROFILE_QUERY = gql`
  query Profile($request: ProfileQueryRequest!) {
    profiles(request: $request) {
      items {
        id
        handle
        ownedBy
        name
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
  }
`

export default function Profile() {
	const {
		query: { username }
	} = useRouter()

	const { data, loading, error } = useQuery(PROFILE_QUERY, {
		variables: { request: { handles: username } },
		skip: !username,
		onCompleted(data) {
			consoleLog(
				'Query',
				'#8b5cf6',
				`Fetched profile details Profile:${data?.profiles?.items[0]?.id}`
			)
		}
	})

	if (error) return <Page500 />
	if (data?.profiles?.items?.length === 0) return <Page404 />

	const profile = data?.profiles?.items[0]

	return (
		<div>
			<Cover cover={profile?.coverPicture?.original?.url}/>
			<Details profile={profile}/>
			<Feed profile={profile} className={styles.feed}/>
		</div>
	)
}
