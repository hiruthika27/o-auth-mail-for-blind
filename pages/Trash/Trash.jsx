import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Trash.css';
import useTrash from '../../hooks/useTrash.jsx';
//import useSpeechRecognition from '../../hooks/useSpeechRecognition.js';
//import { useSpeechRecognition } from 'react-speech-kit';
import useLogout from '../../hooks/useLogout';
import useSpeechSynthesis from "../../hooks/customSpeechSynthesis.js";

const Trash = () => {
    const { speak } = useSpeechSynthesis();
    const tkn = localStorage.getItem("accesstkn");
    const accessToken = JSON.parse(tkn);
    const { handleTrash } = useTrash(accessToken.accessToken);
    
    const handleTrashAndSpeak = async () => {
        const messages = await handleTrash();
        speakMessages(messages);
    };

    const speakMessages = (messages) => {
        messages.forEach((message, index) => {
            const { From, subject, body } = message;
            const text =  `From ${From}. Subject: ${subject}. Body: ${body}`;
            speak( text );
        });
    };
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


    useEffect(() => {
        const handleKeyUp = (event) => {
            switch (event.key) {
                case ' ': // Space key
                    handleTrashAndSpeak();
                    break;
                case 'f': // f key
                    handleLogout();
                    break;
                case 'j': // j key
                    handleBack();
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

    
  return (
    <div className="containert" id="container">
        <div className="form-containert">
            <h1>Trash</h1>
            <p>What would you like to do?</p>  
            <br /><br />
            <button className="option_btnt" type="button" onClick={handleTrashAndSpeak} >Trash</button>
            <br /><br />
            <button className="option_btnt" type="button"  onClick={handleBack}>BACK</button>
            <br /><br />
            <button className="option_btnt" type="button"  onClick={handleLogout}>LOGOUT</button>
            <br /><br />
        </div>
    </div>
  )
}

export default Trash;