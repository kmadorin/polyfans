import {Row, Col, Typography, Avatar, Button} from 'antd';
import {useState, useEffect} from "react";

const {Text, Title} = Typography;
import styles from './details.module.scss';
import {FollowIcon} from '../Shared/Icons';
import AppContext from "../utils/AppContext";
import {useContext} from "react";
import getAvatar from "../../lib/getAvatar";
import Follow from "../Shared/Follow";

export default function Details({profile}) {
	const {currentUser} = useContext(AppContext);
	const [following, setFollowing] = useState(false);
	const [followersCount, setFollowersCount] = useState(0);
	const isOwner = currentUser && currentUser.id ? currentUser.id === profile?.id : false;

	useEffect(() => {
		if (profile?.stats?.totalFollowers) {
			setFollowersCount(profile?.stats?.totalFollowers)
		}
	}, [profile?.stats?.totalFollowers]);

	return (
		<Row justify="center">
			<Col span={18}>
				<div className={styles.content}>
					<Avatar size={180} src={getAvatar(profile)} alt={profile?.handle}/>
					<div className={styles.details}>
						<div>
							{isOwner ? <Button type="default">Edit</Button> : (!following ? (<Follow
								profile={profile}
								setFollowing={setFollowing}
								followersCount={followersCount}
								setFollowersCount={setFollowersCount}
								showText
							/>) : <Button type="default">Unfollow</Button>)}
						</div>
						<div>
							<Title level={2} className={styles.handle}>{profile?.name ?? profile?.handle}</Title>
							<Text className={styles.about}>Life is like riding a bicycle. To keep your balance, you must
								keep moving</Text>
							<div className={styles.followers}>
								<FollowIcon/><span className={styles.count}>{followersCount}</span>
							</div>
						</div>
					</div>
				</div>
			</Col>
		</Row>
	)
}
