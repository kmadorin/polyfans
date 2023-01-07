import {Form, Input, Button } from 'antd';
import { useEffect, useState } from 'react';
import toast from "react-hot-toast";
import styles from './NewMessage.module.scss';

function NewMessage({ sendMessage, conversationKey, disabledInput }) {
	const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const canSendMessage = !disabledInput && !sending && message.length > 0;

  async function handleSend() {
    if (!canSendMessage) {
      return;
    }
    setSending(true);
    const sent = await sendMessage(message);
    if (sent) {
      setMessage('');
    } else {
      toast.error('Error sending message');
    }
    setSending(false);
  };

  function handleInput(e) {
  	setMessage(e.target.value);
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter') {
      handleSend();
    }
  };

  useEffect(() => {
    setMessage('');
  }, [conversationKey]);

	return (
		<div className = {styles.form__wrapper}>
			<Form onFinish={handleSend} className = {styles.form}>
				<Form.Item className={styles.form__input}>
					<Input placeholder='New message' value={message} onKeyDown={handleKeyDown} onChange={handleInput}/>
				</Form.Item>
				<Button type="primary"  htmlType="submit">Send</Button>
			</Form>
		</div>
	)
}

export default NewMessage