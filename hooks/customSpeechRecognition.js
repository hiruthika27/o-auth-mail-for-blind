// customSpeechRecognition.js

import React, { useState, useEffect, useRef } from 'react';

const useSpeechRecognition = () => {
  
  const recognition = useRef(null);
  const [transcript, setTranscript] = useState('');
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);


  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if the standard SpeechRecognition API is available
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      setSupported(true);
      recognition.current = new SpeechRecognition();
      recognition.current.lang = 'en-US';
      recognition.current.interimResults = false;
      recognition.current.maxAlternatives = 1;
    }

    const handleResult = (event) => {
      const result = event.results[0][0].transcript;
      setTranscript(result);
    };

    recognition.current.addEventListener('result', handleResult);

    return () => {
      recognition.current.removeEventListener('result', handleResult);
      recognition.current.stop();
    };
  }, [recognition]);

  const startListening = () => {
    setTranscript('');
    setListening(true);
    recognition.current.start();
  };

  const stopListening = () => {
    setListening(false);
    recognition.current.stop();
  };

  return { transcript, listening, startListening, stopListening };
};

export default useSpeechRecognition;