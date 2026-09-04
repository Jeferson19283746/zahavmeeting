"use client";

import { useRef, useState } from "react";

export type RecordedClip = {
  id: string;
  url: string;
  blob: Blob;
  createdAt: string;
  linkedQuestionId?: string;
};

export function useMeetingRecorder() {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastClip, setLastClip] = useState<RecordedClip | null>(null);

  async function start() {
    setError(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Este navegador não disponibiliza captura de áudio.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];
      recorder.ondataavailable = event => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        const clip: RecordedClip = {
          id: crypto.randomUUID(),
          url: URL.createObjectURL(blob),
          blob,
          createdAt: new Date().toISOString(),
        };
        setLastClip(clip);
        stream.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      };
      recorder.start();
      setIsRecording(true);
    } catch {
      setError("Não foi possível acessar o microfone. Verifique a permissão do navegador.");
    }
  }

  function stop() {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") recorder.stop();
    setIsRecording(false);
  }

  function toggle() {
    return isRecording ? stop() : start();
  }

  return { isRecording, error, lastClip, start, stop, toggle };
}
