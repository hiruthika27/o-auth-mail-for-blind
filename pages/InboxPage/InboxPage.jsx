import React from 'react';
import './inbox.css';
import { useEffect, useState } from 'react';
import { Navigate, json, useNavigate } from 'react-router-dom';
//import { useSpeechSynthesis } from 'react-speech-kit';
import useLogout from '../../hooks/useLogout.jsx';
import useSpeechSynthesis from '../../hooks/customSpeechSynthesis.js';
import useSpeechRecognition from '../../hooks/useSpeechRecognition.js';
import useUnread from '../../hooks/useUnread.jsx';
//import useSearch from '../../hooks/useSearch.jsx';


const InboxPage = () => {

    const { speak } = useSpeechSynthesis();
    const [trans,settrans] = useState('');
    const tkn = localStorage.getItem("accesstkn");
    const accessToken = JSON.parse(tkn);
    //const { getSearchResults } = useSearch(accessToken.accessToken);
    const [listening, setListening] = useState(false);
    const [spokenMessages, setSpokenMessages] = useState([]);
    const { fetchUnreadMessages, handleUnread } = useUnread(accessToken.accessToken);
    
    
    
    const speakMessages = (messages) => {
        messages.forEach((message, index) => {
            console.log("first",messages)
            const { fromHeader, subject, body } = message;
            const text =`Message ${index + 1}: From ${fromHeader.value}. Subject: ${subject}. Body: ${body}`;
            console.log(text);
            speak(text);
        });
    };

        const fetchAndSpeakUnreadMessages = async () => {
            const unreadMessages = await fetchUnreadMessages();
            const messageIds = unreadMessages.map(message => message.id);
            const messages = await handleUnread(messageIds);
            setSpokenMessages(messages);
            speakMessages(messages);
        };
      
 

    const handleUnreadAndSpeak = async () => {
        const messages = await handleUnread();
        const mse = JSON.stringify(messages);
        console.log("executed",mse);
        setSpokenMessages(messages);
        speakMessages(messages); // Call speakMessages function after fetching messages
    };
    
    useEffect(() => {

        const handleKeyUp = (event) => {
            switch (event.key) {
                case ' ': // Space key
                    fetchAndSpeakUnreadMessages();
                    break;
                case 'f': // f key
                    handleBack();
                    break;
                case 'j': // j key
                    handleLogout();
                    break;
                default:
                    break;
            }
        };
        window.addEventListener('keydown', handleKeyUp);

        // Cleanup function
        return () => {
            window.removeEventListener('keydown', handleKeyUp);
        };
    }, []);



    // For handle logout button
    const logout = useLogout();
    const handleLogout = () => {
        // Call the logout function from the custom hook
        logout();

    };

    //To navigate back options page
    const navigate = useNavigate();
    const handleBack = () => {
        navigate("/options")
    }

    return (
        <div className="containerIn" >
            <div className='wrapperIn'>
                <h1>Inbox Page</h1>
                <p>What would you like to do?</p>
                <br />
                <button onClick={handleUnreadAndSpeak} >Unread</button>
                <br /><br />
                {/* <button  onClick={listenForKeyword}>Search</button> */}
                <br /><br />
                <button onClick={handleBack} >Back</button>
                <br /><br />
                <button onClick={handleLogout}>LogOut</button>
                <br /><br />
            </div>
        </div>
    );
}

export default InboxPage;