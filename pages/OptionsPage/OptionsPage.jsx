import React from 'react'
import "./options.css"
import { Link, useNavigate } from 'react-router-dom'
import { useSpeechSynthesis, useSpeechRecognition } from 'react-speech-kit';
import { useState, useEffect } from 'react';
import useLogout from '../../hooks/useLogout.jsx';



const OptionsPage = () => {
    const logout = useLogout();
    const handleLogout = () => {
        // Call the logout function from the custom hook
        logout();   
    };
    const navigate = useNavigate();
    
    const { speak } = useSpeechSynthesis();
    
    const [transcript, setTranscript] = useState('');
    
    
    const handleTranscript = (result) => {
        setTranscript(result);
        switch (result.toLowerCase()) {
            case 'compo':
                navigate('/compose');
                break;
            case 'in':
                navigate('/inbox');
                break;
            case 'sent':
                navigate('/sent');
                break;
            case 'trash':
                navigate('/trash');
                break;
            case 'logo':
                handleLogout();
                break;
            default:
                console.log('Invalid command:', result);
                break;
        }
        stop();
    };


    const speaker = () => {
        speak({ text: 'This is a menu page. What would you like to do? Compose, inbox, sent, trash, or logout?' });
    };

    const handleError = (error) => {
        console.error('Speech recognition error:', error);
    };
    const { listen, stop } = useSpeechRecognition({
        onResult: handleTranscript,
        onError: handleError
    });
    const listenHandler = () => {
        listen();
    };

    


    
  return (
    <div className="containero"
    id="container"
    onClick={speaker}
    onKeyDown={(event) => {
        if (event.key === ' ') {
            listenHandler();
        }
    }}
    tabIndex={0}>
        <div className='form_containeropt'>
            <h1 >Menu Page</h1>
            <p >what would you like to do ? </p>
            <br />
            <Link to="/compose">
                <button className="options_btn" >COMPOSE</button>
            </Link>
            <br/><br/>
            <Link to="/inbox" >
                <button  className="options_btn" >INBOX</button>
            </Link>
            <br/><br/>
            <Link to="/sent" >
                <button  className="options_btn" >SENT</button>
            </Link>
            <br/><br/>
            <Link to="/trash">
                <button  className="options_btn" >TRASH</button>
            </Link>
            <br/><br/>
            <Link to="/">
                <button className="options_btn" onClick={handleLogout} >LOGOUT</button>
            </Link>
        </div>
    </div>
  )
}

export default OptionsPage