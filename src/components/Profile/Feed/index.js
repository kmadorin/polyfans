import {gql, useQuery} from '@apollo/client';
import {Row, Col, Modal} from 'antd';
import {CommentFields} from '../../../graphql/CommentFields';
import {MirrorFields} from '../../../graphql/MirrorFields';
import {PostFields} from '../../../graphql/PostFields';
import consoleLog from "../../../lib/consoleLog";
import {useState, useContext, useEffect} from 'react';
import AppContext from "../../utils/AppContext";
import PostCard from "../../Post/PostCard";
import styles from './feed.module.scss';
import EmptyFeed from "./EmptyFeed";
import PostModal from "../../Post/PostModal";
import {APP_NAME} from "../../../constants";

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

export default function Feed({profile, following, setFollowing, ...props}) {
	const [publications, setPublications] = useState([]);
	const {currentUser} = useContext(AppContext);
	const [isPostModalVisible, setIsPostModalVisible] = useState(false);
	const [openedPost, setOpenedPost] = useState(null);

	const type = 'POST';

	const {data, loading, error, fetchMore} = useQuery(PROFILE_FEED_QUERY, {
		variables: {
			request: {publicationTypes: type, profileId: profile?.id, limit: 10},
			reactionRequest: currentUser ? {profileId: currentUser?.id} : null
		},
		skip: !profile?.id,
		fetchPolicy: 'no-cache',
		onCompleted(data) {
			console.log(`###: publications`, data?.publications?.items);
			setPublications(data?.publications?.items.filter(post => post.appId === APP_NAME))
			consoleLog(
				'Query',
				'#8b5cf6',
				`Fetched first 10 profile publications Profile:${profile?.id}`
			)
		}
	})

	function setPostOpened(post) {
		setIsPostModalVisible(true);
		setOpenedPost(post);
	}

	return (
		<div {...props}>
			{data?.publications?.items?.length === 0 && (
				<EmptyFeed currentUser={currentUser}/>
			)}
			{!error && !loading && data?.publications?.items?.length !== 0 && (
				<Row justify="center">
					<Col span={16}>
						<Row gutter={[28, 28]} align="stretch">

							{publications.map((post, idx) => (
								<Col span={8} key={`${post?.id}_${idx}`} className={styles.postCol}>
									<PostCard post={post} following={following} setPostOpened={setPostOpened}/>
								</Col>
							))}
							<PostModal post={openedPost} isPostModalVisible={isPostModalVisible} setIsPostModalVisible={setIsPostModalVisible} />
						</Row>
					</Col>
				</Row>
			)}
		</div>
	)
}
