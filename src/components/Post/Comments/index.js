import {gql, useQuery} from '@apollo/client';
import styles from './comments.module.scss';
import {useContext, useState} from "react";
import AppContext from "../../utils/AppContext";
import NewComment from "./NewComment";
import { CommentFields } from '../../../graphql/CommentFields';
import consoleLog from "../../../lib/consoleLog";
import Comment from "./Comment";
import EmptyComments from "./EmptyComments";

const COMMENT_FEED_QUERY = gql`
  query CommentFeed(
    $request: PublicationsQueryRequest!
    $reactionRequest: ReactionFieldResolverRequest
  ) {
    publications(request: $request) {
      items {
        ... on Comment {
          ...CommentFields
        }
      }
      pageInfo {
        totalCount
        next
      }
    }
  }
  ${CommentFields}
`

export default function Comments({post}) {
	const {currentUser} = useContext(AppContext);
	const pubId = post?.id;
	const [comments, setComments] = useState([]);


	const { data, loading, error } = useQuery(COMMENT_FEED_QUERY, {
		variables: {
			request: { commentsOf: pubId },
			reactionRequest: currentUser ? { profileId: currentUser?.id } : null
		},
		skip: !pubId,
		fetchPolicy: 'no-cache',
		onCompleted(data) {
			setComments(data?.publications?.items)
			consoleLog(
				'Query',
				'#8b5cf6',
				`Fetched first 10 comments of Publication:${pubId}`
			)
		}
	})

	return <div>
		<NewComment currentUser={currentUser} post={post} />
		{comments.length === 0 && (
			<EmptyComments/>
		)}
		{!error && !loading && comments.length !== 0 && (<div className={styles.comments}>
			{comments.map(comment => (<Comment key={comment.id} comment={comment}/>))}
		</div>)}
	</div>;
}
