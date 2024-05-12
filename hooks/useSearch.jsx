import { useState } from 'react';

const useSearch = (accessToken) => {
    const [searchResults, setSearchResults] = useState([]);

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
            return messageData;
        } catch(error) {
            console.error("Error fetching message content:", error);
            return null;
        }
    };

    const fetchSearchResults = async (keyword) => {
        try {
            const queryParams = new URLSearchParams({
                q: `is:primary ${keyword}`, // Include the keyword in the search
                maxResults: 5, // Limit the results to 5 messages
            });
            const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages?${queryParams}`;
            const response = await fetch(url, {
                headers: {
                    Authorization: Bearer `${accessToken}`,
                },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch search results");
            }
            const data = await response.json();
            return data.messages;
        } catch (error) {
            console.error("Error fetching search results:", error);
            return null;
        }
    };

    const getSearchResults = async (keyword) => {
        try {
            const searchResults = await fetchSearchResults(keyword);
            const messageContents = [];
            for (const message of searchResults) {
                const messageData = await fetchMessageContent(message.id);
                if (messageData) {
                    const from = messageData.payload.headers.find(header => header.name === "From")?.value;
                    const subject = messageData.payload.headers.find(header => header.name === "Subject")?.value;
                    const body = messageData.snippet;
                    const messageContent = {
                        from: from || "Unknown",
                        subject: subject || "No Subject",
                        body: body || "No Content"
                    };
                    messageContents.push(messageContent);
                }
            }
            return messageContents;
        } catch (error) {
            console.error("Error fetching message contents:", error);
            return [];
        }
    };

    return {
        getSearchResults,
    };
};

export default useSearch