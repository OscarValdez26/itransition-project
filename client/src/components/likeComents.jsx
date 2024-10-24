import { useContext, useState, useEffect } from 'react';
import { Button, HStack, Input, List, Text } from 'rsuite';
import { AppContext } from '../context/Provider';
import Markdown from 'react-markdown';
import { useTranslation } from 'react-i18next';

const LikeComments = () => {
  const { user, template } = useContext(AppContext);
  const { t } = useTranslation();
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState('');
  const [disabledLikes, setDisabledLikes] = useState(false);
  const [socket, setSocket] = useState(null);

  const handleLike = () => {
    const newLikes = likes + 1;
    setLikes(newLikes);
    setDisabledLikes(true);
    const payload = {
      "template": template.id,
      "likes": newLikes,
      "dislikes": dislikes
    }
    saveLikes(payload);
  };

  const handleDislike = () => {
    const newDislikes = dislikes + 1;
    setDislikes(newDislikes);
    setDisabledLikes(true);
    const payload = {
      "template": template.id,
      "likes": likes,
      "dislikes": newDislikes
    }
    saveLikes(payload);
  };

  const handleCommentChange = (text) => {
    setCommentInput(text);
  };

  const handleAddComment = () => {
    const payload = {
      "template": template.id,
      "user": user.id,
      "comment": commentInput,
    }
    setCommentInput('');
    saveComment(payload);
  };



  useEffect(() => {
    const socket = new WebSocket(import.meta.env.VITE_WS_URL);
    socket.onopen = () => {
      const payload = { "template": template.id };
      socket.send(JSON.stringify({ type: 'GET_COMMENTS', payload: payload }));
    };
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.template === template.id) {
        setLikes(message.likes);
        setDislikes(message.dislikes);
        setComments(message.comments);
      }
    };
    socket.onerror = (error) => {
      console.error(`WebSocket error: ${error}`);
    };
    setSocket(socket);

    return () => {
      socket.close();
    };
  }, []);

  const saveComment = (payload) => {
    socket.send(JSON.stringify({ type: 'ADD_COMMENT', payload: payload }));
  };

  const saveLikes = (payload) => {
    socket.send(JSON.stringify({ type: 'ADD_LIKES', payload: payload }));
  };

  return (
    <div className='m-2 p-2 h-80 overflow-scroll' style={{ 'maxHeight': '600px' }}>
      <div className='flex justify-center mt-3'><Text size={'lg'} className='text-bold'>{t('Comments')}</Text></div>
      <HStack className='mt-3'>
        <Button onClick={handleLike} disabled={disabledLikes}>👍 {t('Likes')} {likes}</Button>
        <Button onClick={handleDislike} disabled={disabledLikes}>👎 {t('Dislikes')} {dislikes}</Button>
      </HStack>
      <HStack className='mt-3'>
        <Input
          value={commentInput}
          onChange={handleCommentChange}
          placeholder={t("Write_comment")}
          className='max-w-96'
        />
        <Button onClick={handleAddComment}>{t('Add_comment')}</Button>
      </HStack>
      <List className='mt-3'>
        {comments.map((comment, index) => (
          <List.Item key={index}><Markdown>{`*${comment.date}* **${comment.name}** ${comment.comment}`}</Markdown></List.Item>
        ))}
      </List>
    </div>
  );
};

export default LikeComments;