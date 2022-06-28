import {Card} from 'antd';

export default function SinglePost({post}) {
	console.log(`###: post`, post);
	return (
		<Card title="Post">
			<p>{new Date(post?.createdAt).toLocaleDateString(undefined, {day: 'numeric', month: 'numeric', year: 'numeric'})}</p>
			<p>{post?.metadata?.content}</p>
		</Card>
	)
}
