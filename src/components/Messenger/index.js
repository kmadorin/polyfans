import {Empty, Typography} from 'antd';
import styles from './Messenger.module.scss';
import { PUBLIC_URL } from '../../constants';
import MessengerLayout from '../MessengerLayout';
const {Text, Title} = Typography;


function Messenger() {
	return (
    <div className={styles.empty}>
		  <Empty 
        image={`${PUBLIC_URL}/images/chat_not_selected.png`} 
        description = {
            <>
              <Title level={4}>Select channel or chat</Title>
              <Text>Choose an existing chat or create a new one to start messaging</Text>
            </>
          }
        />
    </div>
  )
}

Messenger.getLayout = function getLayout(page) {
  return (
    <MessengerLayout>
      {page}
    </MessengerLayout>
  )
}

export default Messenger;
