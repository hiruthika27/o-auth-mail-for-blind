import React from 'react';
import "./compose.css";
import { useState, useEffect, useRef } from 'react';
import useSendMail from '../../hooks/useSendMail.jsx';
import useSpeechSynthesis from '../../hooks/customSpeechSynthesis.js';
import useSpeechRecognition from '../../hooks/useSpeechRecognition.js';
//import { useSpeechRecognition } from 'react-speech-kit';
import { useNavigate } from 'react-router-dom';


const ComposePage = () => {
  const [transcripts,setTranscripts]=useState('');
  const accessTokenString = localStorage.getItem("accesstkn");
  const accessTkn = JSON.parse(accessTokenString);
  const accessToken = accessTkn.accessToken;
  const { recipient, setRecipient, subject, setSubject, body, setBody, sendMail } = useSendMail(accessToken);
  const navigate = useNavigate();
  const { speak } = useSpeechSynthesis();
  const { listen, listening, stop, transcript } = useSpeechRecognition({
    onResult: setTranscripts,
    onError: (error) => console.error(error), // Provide the onError function
  });
  const [step, setStep] = useState(1); // Initial step
  const [startListeningDelay, setStartListeningDelay] = useState(false);
  useEffect(() => {
    // Event listener for key presses
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [step]); // Dependency on step

  useEffect(() => {
    if (startListeningDelay) {
      setTimeout(() => {
        listen();
      }, 5000); // Adjust the delay time as needed
    }
  }, [startListeningDelay, listen]);

  const handleKeyDown = (event) => {
    switch (event.key) {
      case 'j':
        if (step === 1) {
          speak('You are on the compose page. Please provide the email ID, subject, and body in that order.');
        }
        break;
      case 'f':
        if (step === 5) {
          speak(`Reading mail content. Press Enter to send or F to edit. Recipient mail id ${recipient}, subject ${subject},  body ${body}`);
        } else if (step === 6) {
          speak('Which part would you like to edit? Email ID, subject, or body?');
        }
        break;
      case ' ':
        if (step === 1) {
          speak('Please provide the email ID.');
          setStartListeningDelay(true);
          setStep(2);
          console.log(recipient);
        } else if (step === 2) {
          speak('Please provide the subject.');
          setStartListeningDelay(true);
          setStep(3);
          
        } else if (step === 3) {
          speak('Please provide the body.');
          setStartListeningDelay(true);
          
          setStep(4); // Assuming step 5 is sending mail    
        } else if (step === 4) {
          // At step 5, when the space key is pressed, initiate confirmation
          speak('Confirm to send the mail or press F to edit.');
          setStep(5)
        }
        break;
      case 'Enter':
        if (step === 5) {
          sendMail(); // Implement sendMail function to send the email
          setStep(1);
        }
        break;
      default:
        break;
    }
  };
  const isValidEmail = (email) => {
    // Basic email validation
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  useEffect(() => {
    if (step === 2 && transcripts) {
      console.log('Transcript:', transcripts); // Log the transcript
      const transcribedRecipient = transcripts.toLowerCase().replace(/\s/g, '').replace(/at/g, '@');
      console.log('Formatted Recipient:', transcribedRecipient); // Log the formatted recipient
      if (isValidEmail(transcribedRecipient)) {
        setRecipient(transcribedRecipient);
        speak("Email is Taken");
      } else {
        speak('Please provide a valid email address.');
      } 
    } else if (step === 3 && transcripts) {
      setSubject(transcripts);
    } else if (step === 4 && transcripts) {
      setBody(transcripts);
    }
  }, [step, transcripts]);

  console.log(transcripts);

  const handleSubmit = () => {
    if (step === 5) {
      stopListening();
      setStep(6);
    }
  };


return (
    <div className="containerCo" >
      <div className="ContentWrapperCo">
        <h1>Compose Mail</h1>
        <br />
        <label htmlFor='recipient'>Recipient Email:</label>
        <input type="email" id="recipient" value={recipient} onChange={(e) => setRecipient(e.target.value)} required />
        <br />
        <label htmlFor="subject">Subject:</label>
        <input type="text" id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} required />
        <br />
        <label htmlFor="body">Body:</label>
        <textarea id="body" type="body" value={body} rows="6" cols="70" onChange={(e) => setBody(e.target.value)} required>        
        </textarea>
        <br /><br />
        <div className="buttonwrapper">
          <button type="button" onClick={() => { navigate("/options") }}>BACK</button>
          <br />
          <button onClick={handleSubmit}>SEND MAIL</button>
        </div>
      </div>
      <div>
      </div>
    </div>
  )
}

export default ComposePage