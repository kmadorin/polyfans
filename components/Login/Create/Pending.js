import { useQuery } from '@apollo/client'
import {Button, Spin, Typography} from 'antd';
const {Text} = Typography;
import { TX_STATUS_QUERY } from '../../../graphql/HasTxHashBeenIndexed';
import { ArrowRightOutlined } from '@ant-design/icons';
import { IS_MAINNET } from '../../../constants';
import React, { FC } from 'react';
import pendingStyles from './pending.module.css';


export default function Pending ({ handle, txHash }) {
	const { data, loading } = useQuery(TX_STATUS_QUERY, {
		variables: {
			request: { txHash }
		},
		pollInterval: 1000
	})

	return (
		<div className={pendingStyles.wrapper}>
			{loading || !data?.hasTxHashBeenIndexed?.indexed ? (
				<div className={pendingStyles.block}>
					<Spin size="large" className={pendingStyles.spin}/>
					<Text className={pendingStyles.text}>Account creation in progress, please wait!</Text>
				</div>
			) : (
				<div className={pendingStyles.block}>
					<Text className={pendingStyles.text}>Account created successfully</Text>
					<div>
						<a href={`/u/${handle}${IS_MAINNET ? '.lens' : '.test'}`}>
							<Button
								type="primary"
								size="large"
								className={pendingStyles.btn}
								icon={<ArrowRightOutlined className={pendingStyles.arrow}/>}
							>
								Go to profile
							</Button>
						</a>
					</div>
				</div>
			)}
		</div>
	)
}
