import { useRouter } from 'next/router';
import Profile from '../../../components/Profile';
import SiteLayout from '../../../components/SiteLayout';

export default function ViewProfile() {
	const {
		query: { username }
	} = useRouter()

	return (
		<Profile username={username} />
	)
}

ViewProfile.getLayout = function getLayout(page) {
  return (
    <SiteLayout>
      {page}
    </SiteLayout>
  )
}
