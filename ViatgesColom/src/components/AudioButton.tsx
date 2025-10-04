import { Volume2, VolumeX } from "lucide-react";
import type { FC } from "react";
import { useEffect, useRef, useState } from "react";

interface AudioButtonProps {
  text: string;
  label?: string;
  compact?: boolean;
}

const isSpeechSupported = () => typeof window !== "undefined" && "speechSynthesis" in window;

export const AudioButton: FC<AudioButtonProps> = ({ text, label = "Escolta el text", compact }) => {
  const [speaking, setSpeaking] = useState(false);
  const [available, setAvailable] = useState(isSpeechSupported());
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    setAvailable(isSpeechSupported());
  }, []);

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  const handleClick = () => {
    if (!available) {
      return;
    }
    const synthesis = window.speechSynthesis;
    if (speaking) {
      synthesis.cancel();
      setSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ca-ES";
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    utteranceRef.current = utterance;
    setSpeaking(true);
    synthesis.cancel();
    synthesis.speak(utterance);
  };

  const Icon = speaking ? VolumeX : Volume2;

  return (
    <button
      type="button"
      className={`audio-button ${compact ? "audio-button--compact" : ""}`.trim()}
      onClick={handleClick}
      aria-label={label}
      disabled={!available}
    >
      <Icon size={16} />
      {!compact && <span>{speaking ? "Atura" : "Escolta"}</span>}
    </button>
  );
};
