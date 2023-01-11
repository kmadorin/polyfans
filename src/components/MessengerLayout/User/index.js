import {Avatar, Space, Typography} from "antd";
const {Text, Link} = Typography;
import getAvatar from "../../../lib/getAvatar";
import {SettingOutlined} from "@ant-design/icons";
import userStyles from './user.module.scss';

export default function User({user}) {
	return (
		<Space size={10}>
			<Avatar src={getAvatar(user)} size={32} />
			<Text className={userStyles.name}>{user.handle}</Text>
		</Space>
	)
}
