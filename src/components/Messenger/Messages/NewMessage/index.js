import {Form, Input, Button, Space } from 'antd';
import { useEffect, useState } from 'react';
import { ContentTypeComposite, ContentTypeText } from '@xmtp/xmtp-js';
import toast from "react-hot-toast";
import Attachment from '../../../Shared/Attachment';
import Attachments from "../../../Shared/Attachments";
import styles from './NewMessage.module.scss';

function NewMessage({ sendMessage, conversationKey, disabledInput }) {
	const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [attachments, setAttachments] = useState([]);

  const canSendMessage = !disabledInput && !sending && message.length > 0;

  async function handleSend() {
    if (!canSendMessage) {
      return;
    }
    setSending(true);

    let sent = false;

    if (attachments && attachments.length > 0) {
       const compositeMessage = {
          parts: [
            { type: ContentTypeText, content: message },
            { type: ContentTypeText, content: attachments[0].item}
          ]
        }
        sent = await sendMessage(compositeMessage, {
          contentType: ContentTypeComposite,
          contentFallback: 'This a composite message. Try client that supports composite messages'
        });
    } else {
      sent = await sendMessage(message);
    }

    if (sent) {
      setMessage('');
      setAttachments([]);
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
      {attachments && attachments.length > 0 && <div className={styles.attachmentsWrapper}>
        <Attachments attachments={attachments} setAttachments={setAttachments}/>
      </div>}
			<Form onFinish={handleSend} className = {styles.form}>
        <div className = {styles.form__center}>
  				<Form.Item className={styles.form__input}>
  					<Input placeholder='New message' value={message} onKeyDown={handleKeyDown} onChange={handleInput}/>
  				</Form.Item>
          <Attachment type='video' attachments={attachments} setAttachments={setAttachments}/>
        </div>
				<Button type="primary"  htmlType="submit">Send</Button>
			</Form>
		</div>
	)
}

export default NewMessage