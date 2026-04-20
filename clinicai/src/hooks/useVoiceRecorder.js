import { useState, useRef } from 'react';

export default function useVoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  
  // TODO: Implement MediaRecorder and Web Speech API
  
  const startRecording = () => {
    setIsRecording(true);
  };
  
  const stopRecording = () => {
    setIsRecording(false);
  };

  return {
    isRecording,
    transcript,
    startRecording,
    stopRecording
  };
}
