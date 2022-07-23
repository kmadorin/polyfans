import { useRouter } from 'next/router';
import Profile from '../../../components/Profile';

export default function ViewProfile() {
	const {
		query: { username }
	} = useRouter()

	return (
		<Profile username={username} />
	)
}
