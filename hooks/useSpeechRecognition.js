import { useRef, useState, useEffect } from 'react';

const useSpeechRecognition = (props = {}) => {
  const recognition = useRef(null);
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const [stopListening, setStopListening] = useState(false);

  const processResult = (event) => {
    const transcript = Array.from(event.results)
      .map((result) => result[0])
      .map((result) => result.transcript)
      .join('');
    props.onResult(transcript);
    console.log('Transcript:', transcript);
  };

  const handleError = (event) => {
    props.onError(event.error);
    console.error('Speech recognition error:', event.error);
  };

  const listen = () => {
    const recognitionOptions = {
      lang: props.lang || 'en-US',
      interimResults: props.interimResults || true,
      continuous: props.continuous || false,
      maxAlternatives: props.maxAlternatives || 1,
    };

    if (listening || !supported) return;
    setListening(true);
    setStopListening(false);
    
    recognition.current = new window.SpeechRecognition();
    recognition.current.lang = recognitionOptions.lang;
    recognition.current.interimResults = recognitionOptions.interimResults;
    recognition.current.continuous = recognitionOptions.continuous;
    recognition.current.maxAlternatives = recognitionOptions.maxAlternatives;

    recognition.current.onresult = processResult;
    recognition.current.onerror = handleError;

    recognition.current.onend = () => {
      if (!stopListening) {
        recognition.current.start();
      } else {
        setListening(false);
      }
    };

    recognition.current.start();
  };

  const stop = () => {
    if (!listening || !supported) return;
    recognition.current.onresult = null;
    recognition.current.onend = null;
    recognition.current.onerror = null;
    setListening(false);
    setStopListening(true);
    recognition.current.stop();
  };

  useEffect(() => {
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (window.SpeechRecognition) {
      setSupported(true);
    }
    return () => {
      if (recognition.current) {
          recognition.current.onresult = null;
          recognition.current.onend = null;
          recognition.current.onerror = null;
      }
  };
  }, []);

  return { listen, listening, stop, supported };
};

export default useSpeechRecognition;