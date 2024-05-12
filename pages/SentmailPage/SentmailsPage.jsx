import React from "react";
import "./sentmail.css";
//import { useSpeechRecognition,useSpeechSynthesis } from "react-speech-kit";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useSpeechSynthesis from '../../hooks/customSpeechSynthesis.js';
import useLogout from '../../hooks/useLogout.jsx';
import useSendMessages from "../../hooks/useSendMessages.jsx";
 

const SentMailsPage = () => {

    const { speak } = useSpeechSynthesis();
    
    const accessTokenString = localStorage.getItem("accesstkn");
    const accessTkn = JSON.parse(accessTokenString);
    const accessToken = accessTkn.accessToken;
    const { handleSendMessages } = useSendMessages(accessToken);

    
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

    const handleSentMessagesAndSpeak = async () => {
        const messages = await handleSendMessages();
        speakMessages(messages);
    };

    const speakMessages = (messages) => {
        messages.forEach((message, index) => {
            const mse = JSON.stringify(message);
            //console.log(mse)
            //const { From, To, snippet } = message;
            const fromHeader = message.payload.headers.find(header => header.name === "From");
            const From = fromHeader.value;
            console.log(From)
            const toHeader = message.payload.headers.find(header => header.name === "To");
            const To = toHeader.value;
            console.log(To)
            const body = message.snippet;
            console.log(body)
            const text = `Message ${index + 1}: From ${From}. Subject: ${To}. Body: ${body}`;
            speak(text);
        });
    };

    const handleKeyPress = (event) => {
        switch (event.key) {
            case " ": // Space key
                handleSentMessagesAndSpeak();
                break;
            case "f": // f key
                handleLogout();
                break;
            case "j": // j key
                handleBack();
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        window.addEventListener("keydown", handleKeyPress);

        return () => {
            window.removeEventListener("keydown", handleKeyPress);
        };
    }, [handleKeyPress]);

    return (
        <div className="containersent" id="container">
           <div className="sentform">
                <h1>Sent Mails Page</h1>
                <p>what would you like to do ? </p>
                <br/>
                <br/>
                <button onClick={handleSentMessagesAndSpeak}>SENT</button>
                <br/><br/>
                <button onClick={handleBack}>BACK</button>
                <br/><br/>
                <button onClick={handleLogout}>LOGOUT</button>
                <br/><br/>
            </div>
        </div>
    );
};
export default SentMailsPage;