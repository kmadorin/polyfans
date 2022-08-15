import dynamic from 'next/dynamic';
import Page500 from "./500";
import {Spin} from "antd";
import Page404 from "./404";
import {gql, useQuery} from "@apollo/client";
import consoleLog from "../lib/consoleLog";
import {useContext} from "react";
import AppContext from "../components/utils/AppContext";

const Settings = dynamic(() => import('../components/Settings'), { ssr: false })

const PROFILE_SETTINGS_QUERY = gql`
  query ProfileSettings($request: SingleProfileQueryRequest!) {
    profile(request: $request) {
      id
      name
      bio
      handle
      metadata
      attributes {
        key
        value
      }
      coverPicture {
        ... on MediaSet {
          original {
            url
          }
        }
      }
      picture {
        ... on MediaSet {
          original {
            url
          }
        }
        ... on NftImage {
          uri
          tokenId
          contractAddress
        }
      }
    }
  }
`

export default function PageSettings() {
	const {currentUser} = useContext(AppContext);

	const { data, loading, error } = useQuery(PROFILE_SETTINGS_QUERY, {
		variables: { request: { profileId: currentUser?.id } },
		skip: !currentUser?.id,
		onCompleted(data) {
			consoleLog('Query', `Fetched profile settings`)
		}
	})

	if (error) return <Page500 />
	if (loading || !data) return <Spin />
	if (!loading && !data?.profile) return <Page404 />

	const user = data?.profile;


	return <Settings user={user} />
}
