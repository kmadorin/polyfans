import {useNetwork} from "wagmi";
import toast from 'react-hot-toast';
import { CHAIN_ID } from '../../constants';
import { SwapOutlined } from '@ant-design/icons';
import {Button} from "antd";

export default function SwitchNetwork() {
	const { switchNetwork } = useNetwork()

	return (
		<Button icon={<SwapOutlined />} danger type="primary" onClick={() => {
			if (switchNetwork) {
				switchNetwork(CHAIN_ID)
			} else {
				toast.error('Please change your network wallet!')
			}
		}}>
			Switch Network
		</Button>
	)
}
