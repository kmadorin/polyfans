import getIPFSLink from './getIPFSLink'

const getAvatar = (profile) => {
	return getIPFSLink(
			profile?.picture?.original?.url ??
			profile?.picture?.uri ??
			`https://avatar.tobi.sh/${profile?.ownedBy}_${profile?.handle}.png`
		)
}

export default getAvatar
