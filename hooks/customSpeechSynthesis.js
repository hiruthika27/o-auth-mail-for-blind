// customSpeechSynthesis.js
import React, { useState, useEffect } from 'react';

const useSpeechSynthesis = () => {
  const [speaking, setSpeaking] = useState(false);
  
  useEffect(() => {
    const handleEnd = () => {
      setSpeaking(false);
    };

    window.speechSynthesis.addEventListener('start', () => {
      setSpeaking(true);
    });

    window.speechSynthesis.addEventListener('end', handleEnd);

    return () => {
      window.speechSynthesis.removeEventListener('start', () => {
        setSpeaking(true);
      });
      window.speechSynthesis.removeEventListener('end', handleEnd);
    };
  }, []);

  const speak = (text) => {
    if (!speaking) {
      window.speechSynthesis.cancel(); // Cancel any ongoing speech synthesis
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const cancel = () => {
    window.speechSynthesis.cancel();
  };

  return { speak, cancel, speaking };
};

export default useSpeechSynthesis;