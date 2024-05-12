import { useState } from 'react';

const useSentMessages = (accessToken) => {
    const [sentMessages, setSentMessages] = useState([]);

    const fetchSentMessages = async () => {
        try {
            const queryParams = new URLSearchParams({
                q: "in:sent", // Filter for messages in the sent box
                maxResults: 5, // Limit the results to 5 messages
            });
            const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages?${queryParams}`;
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch sent messages");
            }
            const data = await response.json();
            return data.messages;
        } catch (error) {
            console.error("Error fetching sent messages:", error);
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

    const handleSentMessages = async () => {
        const messages = await fetchSentMessages();
        const processedMessages = [];

        for (const message of messages) {
            const messageData = await fetchMessageContent(message.id);
            if (!messageData) continue;

            // Filter out dynamic and HTML messages
            const isDynamic = messageData.payload.mimeType === "multipart/alternative";
            const isHTML = messageData.payload.mimeType === "text/html";
            if (!isDynamic && !isHTML) {
                processedMessages.push(messageData);
            }
        }

        return processedMessages;
    };

    return {
        handleSentMessages,
    };
};

export default useSentMessages;