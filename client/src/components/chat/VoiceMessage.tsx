import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, 
  Square, 
  Play, 
  Pause,
  Trash2,
  Send,
  Loader2,
} from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { chatService } from '../../services/chatService';


interface VoiceMessageProps {
  roomId?: number;
  receiverId?: number;
  onSend: () => void;
}

export function VoiceMessageHandler({ roomId, receiverId, onSend }: VoiceMessageProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationFrameRef = useRef<number>();
  const queryClient = useQueryClient();

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (audioBlob: Blob) => {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'voice-message.mp3');
      
      if (roomId) {
        formData.append('roomId', roomId.toString());
      } else if (receiverId) {
        formData.append('receiverId', receiverId.toString());
      }

      return chatService.uploadVoiceMessage(formData);
    },
    onSuccess: () => {
      setAudioUrl(null);
      onSend();
      if (roomId) {
        queryClient.invalidateQueries({ queryKey: ['messages', roomId] });
      } else if (receiverId) {
        queryClient.invalidateQueries({ queryKey: ['directMessages', receiverId] });
      }
    }
  });

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        // Initialize audio element
        const audio = new Audio(url);
        audio.onloadedmetadata = () => {
          setDuration(audio.duration);
        };
        audioRef.current = audio;
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  // Cancel recording
  const cancelRecording = () => {
    stopRecording();
    setAudioUrl(null);
    setRecordingTime(0);
  };

  // Toggle playback
  const togglePlayback = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Send voice message
  const sendVoiceMessage = async () => {
    if (!audioUrl) return;

    const response = await fetch(audioUrl);
    const audioBlob = await response.blob();
    uploadMutation.mutate(audioBlob);
  };

  // Update recording time
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Update playback progress
  useEffect(() => {
    if (!audioRef.current) return;

    const updateProgress = () => {
      setCurrentTime(audioRef.current?.currentTime || 0);
      animationFrameRef.current = requestAnimationFrame(updateProgress);
    };

    audioRef.current.onplay = () => {
      updateProgress();
    };

    audioRef.current.onpause = () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };

    audioRef.current.onended = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [audioUrl]);

  return (
    <div className="relative">
      <AnimatePresence>
        {isRecording || audioUrl ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="absolute bottom-full mb-2 w-full"
          >
            <div className="bg-stone-800 rounded-lg p-4">
              {isRecording ? (
                <div className="flex items-center gap-4">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-3 h-3 bg-red-500 rounded-full"
                  />
                  <span className="text-white">
                    {formatTime(recordingTime)}
                  </span>
                  <div className="flex-1">
                    <WaveformVisualizer />
                  </div>
                  <button
                    onClick={cancelRecording}
                    className="p-2 text-red-400 hover:text-red-300 rounded-lg"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={stopRecording}
                    className="p-2 text-white bg-indigo-500 rounded-lg hover:bg-indigo-600"
                  >
                    <Square className="w-5 h-5" />
                  </button>
                </div>
              ) : audioUrl ? (
                <div className="flex items-center gap-4">
                  <button
                    onClick={togglePlayback}
                    className="p-2 text-white bg-indigo-500 rounded-lg hover:bg-indigo-600"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5" />
                    )}
                  </button>
                  <div className="flex-1">
                    <AudioProgress
                      currentTime={currentTime}
                      duration={duration}
                    />
                  </div>
                  <button
                    onClick={cancelRecording}
                    className="p-2 text-red-400 hover:text-red-300 rounded-lg"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={sendVoiceMessage}
                    disabled={uploadMutation.isPending}
                    className="p-2 text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 disabled:opacity-50"
                  >
                    {uploadMutation.isPending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
              ) : null}
            </div>
          </motion.div>
        ) : (
          <button
            onClick={startRecording}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
          >
            <Mic className="w-5 h-5" />
          </button>
        )}
      </AnimatePresence>
    </div>
  );
}

function WaveformVisualizer() {
  return (
    <div className="flex items-center justify-center gap-1 h-8">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          animate={{
            height: [8, Math.random() * 24 + 8, 8],
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            delay: i * 0.1,
          }}
          className="w-1 bg-indigo-500 rounded-full"
        />
      ))}
    </div>
  );
}

function AudioProgress({ 
  currentTime, 
  duration 
}: { 
  currentTime: number; 
  duration: number; 
}) {
  const progress = (currentTime / duration) * 100;

  return (
    <div className="relative w-full h-8 flex items-center">
      <div className="absolute w-full h-1 bg-stone-700 rounded-full">
        <motion.div
          className="h-full bg-indigo-500 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="absolute w-full flex justify-between text-xs text-gray-400 mt-4">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}