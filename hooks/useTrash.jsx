import { useState } from 'react';

const useTrash = (accessToken) => {
    const [trashMessages, setTrashMessages] = useState([]);

    const fetchTrashMessages = async () => {
        try {
            const queryParams = new URLSearchParams({
                q: "in:trash", // Filter for messages in trash
                maxResults: 5, // Limit the results to 5 messages
            });
            const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages?${queryParams}`;
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch trash messages");
            }
            const data = await response.json();
            console.log(data)
            return data.messages;
        } catch (error) {
            console.error("Error fetching trash messages:", error);
            return [];
        }
    };

    const fetchMessageContent = async (messageId) => {
        try {
            const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}`;
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch message content");
            }
            const messageData = await response.json();
            // Process message data as needed
            return messageData;
        } catch (error) {
            console.error("Error fetching message content:", error);
            return null;
        }
    };

    const handleTrash = async () => {
        const trashMessages = await fetchTrashMessages(); // Fetch trash messages
        const maxMessages = Math.min(trashMessages.length, 5);
        const processedMessages = [];

        for (let i = 0; i < maxMessages; i++) {
            const message = trashMessages[i];
            const messageData = await fetchMessageContent(message.id);
            if (!messageData) continue;

            // Extract necessary information from messageData
            const fromHeader = messageData.payload.headers.find(header => header.name === "From");
            const From = fromHeader.value;
            console.log(From)
            const sub = messageData.payload.headers.find(header => header.name === "Subject");
            const subject = sub.value;
            const body = messageData.snippet;

            processedMessages.push({ From, subject, body });
        }

        return processedMessages;
    };

    return {
        
        handleTrash
    };
};

export default useTrash;