import { useState, useEffect } from 'react';

const useTrashMessages = (accessToken) => {
  const [trashMessages, setTrashMessages] = useState([]);
  
  useEffect(() => {
    const fetchTrashMessages = async () => {
      try {
        const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages?labelIds=TRASH&maxResults=5', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch trash messages');
        }
        const data = await response.json();
        setTrashMessages(data.messages || []);
      } catch (error) {
        console.error('Error fetching trash messages:', error);
      }
    };

    if (accessToken) {
      fetchTrashMessages();
    }
  }, [accessToken]);

  return trashMessages;
};

export default useTrashMessages;