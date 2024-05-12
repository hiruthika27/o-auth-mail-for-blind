import { useState } from 'react';

const useUnread = (accessToken) => {
    
    const [unreadMessages, setUnreadMessages] = useState([]);

    const fetchUnreadMessages = async () => {
        try {
            const queryParams = new URLSearchParams({
                q: "is:unread category:primary", // Filter for unread messages
                maxResults: 5, // Limit the results to 5 messages
            });
            const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages?${queryParams}`;
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch inbox contents");
            }
            const data = await response.json();
            return data.messages;
        } catch (error) {
            console.error("Error fetching unread messages:", error);
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
            console.error("Error fetching message content: ${accessToken}", error);
            return null;
        }
    };

    const handleUnread = async (messageIds) => {
        const processedMessages = [];
        for (let messageId of messageIds) {
            const messageData = await fetchMessageContent(messageId);
            if (!messageData) continue;
            const fromHeader = messageData.payload.headers.find(header => header.name === "From");
            const subject = messageData.payload.headers.find(header => header.name === "Subject")?.value;
            const body = messageData.snippet;
            processedMessages.push({ fromHeader, subject, body });
        }
        return processedMessages;
    };

    return {
        fetchUnreadMessages,
        handleUnread,
    };
};

export default useUnread;