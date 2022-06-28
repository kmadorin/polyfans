import {Spin, Typography} from 'antd';

const {Text} = Typography;
import {CheckCircleFilled} from '@ant-design/icons';
import {gql, useQuery} from '@apollo/client';
import {useState} from "react";
import {POLYGONSCAN_URL} from '../../../constants';
import styles from './pubindexstatus.module.scss';

export const TX_STATUS_QUERY = gql`
  query HasPublicationIndexed($request: PublicationQueryRequest!) {
    publication(request: $request) {
      ... on Post {
        id
      }
      ... on Comment {
        id
      }
    }
  }
`

export default function PubIndexStatus({setIsModalVisible, type, txHash}) {
	const [pollInterval, setPollInterval] = useState(500);

	const {data, loading} = useQuery(TX_STATUS_QUERY, {
		variables: {
			request: {txHash}
		},
		pollInterval,
		onCompleted(data) {
			if (data?.publication) {
				setPollInterval(0)
				if (setIsModalVisible) {
					setTimeout(() => setIsModalVisible(false), 200)
				}
			}
		}
	})
	return (
		<a
			className={styles.status}
			href={`${POLYGONSCAN_URL}/tx/${txHash}`}
			target="_blank"
			rel="noreferrer noopener"
		>
			{loading || !data?.publication ? (
				<>
					<Spin className={styles.icon}/>
					<Text className={styles.text}>{type} Indexing</Text>
				</>
			) : (
				<>
					<CheckCircleFilled className={styles.icon}/>
					<Text className={styles.icon}>Index Successful</Text>
				</>
			)
			}

		</a>
	)
}
