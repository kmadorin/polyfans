import {Layout, Row, Col, Button, Space,} from 'antd';
import clsx from 'clsx';
import {useRouter} from "next/router";
import {gql, useQuery} from '@apollo/client';
import Router from 'next/router';
import Cookies from 'js-cookie'
import {useEffect, useState} from "react";
import {Toaster} from 'react-hot-toast';
import {useAccount, useConnect, useDisconnect} from 'wagmi';
import {MinimalProfileFields} from '../../graphql/MinimalProfileFields';

const {Header, Content} = Layout;
import AppContext from '../utils/AppContext';
import Address from '../Address';
import Logo from '../Logo';
import layoutStyles from './layout.module.scss';
import consoleLog from '../../lib/consoleLog';
import User from "./User";
import Link from 'next/link';

export const CURRENT_USER_QUERY = gql`
  query CurrentUser($ownedBy: [EthereumAddress!]) {
    profiles(request: { ownedBy: $ownedBy }) {
      items {
        ...MinimalProfileFields
        isDefault
      }
    }
  }
  ${MinimalProfileFields}
`

function SiteLayout({children}) {
	const [mounted, setMounted] = useState(false);
	const [refreshToken, setRefreshToken] = useState();
	const [selectedProfile, setSelectedProfile] = useState(0)
	const {data: accountData} = useAccount();
	const {disconnect} = useDisconnect();
	const {activeConnector} = useConnect();
	const accountAddress = accountData && accountData.address;
	const router = useRouter();
	const isHome = router.pathname === '/';
	const {data, loading, error} = useQuery(CURRENT_USER_QUERY, {
		variables: {ownedBy: accountData?.address},
		skip: !selectedProfile || !refreshToken,
		onCompleted(data) {
			consoleLog(
				'Query',
				'#8b5cf6',
				`Fetched ${data?.profiles?.items?.length} owned profiles`
			)
		}
	});

	const profiles = data?.profiles?.items
		?.slice()
		?.sort((a, b) => Number(a.id) - Number(b.id))
		?.sort((a, b) =>
			!(a.isDefault !== b.isDefault) ? 0 : a.isDefault ? -1 : 1
		)

	useEffect(() => {
		setMounted(true);
		setRefreshToken(Cookies.get('refreshToken'))
		setSelectedProfile(localStorage.selectedProfile)

		if (!activeConnector) {
			disconnect()
		}

		activeConnector?.on('change', () => {
			localStorage.removeItem('selectedProfile')
			Cookies.remove('accessToken')
			Cookies.remove('refreshToken')
			disconnect()
		})
	}, [selectedProfile, activeConnector, disconnect])

	const currentUser = profiles && profiles[selectedProfile];

	const injectedGlobalContext = {
		selectedProfile,
		setSelectedProfile,
		profiles,
		currentUser,
		currentUserLoading: loading,
		currentUserError: error
	}

	const toastOptions = {
		style: {
			background: '',
			color: ''
		},
		success: {
			className: 'border border-green-500',
			iconTheme: {
				primary: '#10B981',
				secondary: 'white'
			}
		},
		error: {
			className: 'border border-red-500',
			iconTheme: {
				primary: '#EF4444',
				secondary: 'white'
			}
		},
		loading: {className: 'border border-gray-300'}
	}

	const onLogout = () => {
		localStorage.removeItem('selectedProfile')
		Cookies.remove('accessToken')
		Cookies.remove('refreshToken')
		disconnect()
		Router.push('/');
	}

	function onNewPost(e) {

	}

	return (
		<AppContext.Provider value={injectedGlobalContext}>
			<Toaster position="bottom-right" toastOptions={toastOptions}/>
			<Layout style={{minHeight: '100vh'}} className={layoutStyles.layout}>
				<Header className={clsx(layoutStyles.header, isHome && layoutStyles.headerHome)}>
					<Row justify="stretch" align="middle" className={layoutStyles.row}>
						<Col className={layoutStyles.logocol}>
							<Logo/>
						</Col>
						<Col className={layoutStyles.rightcol}>
							<Row justify="space-between" align="middle">
								{
									currentUser && (
										<Space>
											<User user={currentUser}/>
											<Button type="primary" onClick={onNewPost}>New Post</Button>
										</Space>
									)
								}
								<Col>
								</Col>
								<Col>{mounted && accountAddress ? (
									<div>
										<Address size="short" value={accountAddress}/>
										<Button type="primary" onClick={onLogout} className={layoutStyles.logout}>Log
											out</Button>
									</div>
								) : <Link href='/'><Button type="primary">Log in</Button></Link>}</Col>
							</Row>
						</Col>
					</Row>
				</Header>
				<Content>
					{children}
				</Content>
				{/*<Footer>Footer</Footer>*/}
			</Layout>
		</AppContext.Provider>
	)
}

export default SiteLayout
