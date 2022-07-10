import getIPFSLink from "../../lib/getIPFSLink";

export function parsePostContent(post) {
	let title = '';
	let followers_only = false;
	let content = null;
	let coverImg = null;
	let coverImgURL = null;


	if (post?.metadata?.content) {
		try {
			content = JSON.parse(post?.metadata?.content);
			title = content.title;
			followers_only = content.followers_only;
			coverImg = post?.metadata?.media.length > 0 && post?.metadata?.media[0].original.url;
			coverImgURL = coverImg ? getIPFSLink(coverImg) : null;
		} catch (e) {
			console.log(`###: Post parsing error`, e);
		}
	}

	return {
		coverImgURL,
		title,
		content: content?.content,
		followers_only,
	}
}
