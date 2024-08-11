"use client";

import React, { useState, useRef } from "react";
import { useInitializeEngine } from "@/app/hooks/useInitializeEngine";
import { ChatInterface } from "./ChatInterface";
import { MessageDisplay } from "./MessageDisplay";
import ModelSelect from "./ModelSelect";
import VoiceSelect from "./VoiceSelect";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/app/components/ui/card";
import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import { modelsConfig, voicesConfig } from "../../config";
import { Avatar } from "@readyplayerme/visage";
import SpeakingIndicator from "./SpeakingIndicator";

export function SuperSafeGirlfriend() {
  const [selectedModel, setSelectedModel] = useState(
    modelsConfig[Object.keys(modelsConfig)[0]].name
  );
  const { engine, isLoading, progress } = useInitializeEngine(selectedModel);
  const [messages, setMessages] = useState<{ role: string; content: any }[]>(
    []
  );
  const [isResponding, setIsResponding] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState("claire");
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleSubmit = async (input: string) => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setIsResponding(true);
    const chatMessages = [
      { role: "system", content: modelsConfig[selectedModel].prompt },
      ...messages,
      { role: "user", content: input },
    ];
    try {
      const reply = await engine.chat.completions.create({
        messages: chatMessages,
      });
      const assistantMessage = {
        role: "assistant",
        content: reply.choices[0].message.content,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      if (!isMuted) {
        playAudio(assistantMessage.content);
      }
    } catch (error) {
      console.error("Error generating response:", error);
    } finally {
      setIsResponding(false);
    }
  };

  const playAudio = async (text: string) => {
    try {
      const response = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voice: voicesConfig[selectedVoice].id }),
      });
      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          audioRef.current.play();
        }
      } else {
        const errorData = await response.json();
        console.error("Failed to fetch audio:", errorData.error);
        // You might want to show an error message to the user here
      }
    } catch (error) {
      console.error("Error playing audio:", error);
      // You might want to show an error message to the user here
    }
  };

  const handleMuteToggle = () => {
    setIsMuted((prev) => !prev);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader content="AI Girlfriend" className="flex items-center">
        <CardTitle>AI Girlfriend</CardTitle>
        <div className="flex items-center space-x-4">
          <Avatar
            modelSrc="https://models.readyplayer.me/66b12871626ea06a6a2cd028.glb?quality=high&lod=0&textureSizeLimit=1024&useDracoMeshCompression=true&useHands=false"
            style={{
              width: "100px",
              height: "100px",
              pointerEvents: "none",
            }}
            fov={30}
            onLoaded={() => {}}
            onLoading={() => {}}
            emotion={{
              eyeSquintLeft: 0.4,
              eyeSquintRight: 0.2,
              mouthSmileLeft: 0.37,
              mouthSmileRight: 0.36,
              mouthShrugUpper: 0.27,
              browInnerUp: 0.3,
              browOuterUpLeft: 0.37,
              browOuterUpRight: 0.49,
            }}
            idleRotation={false}
          />
          {isResponding && <SpeakingIndicator />} {/* Add this line */}
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-4">
          <ModelSelect
            modelsConfig={modelsConfig}
            selectedModel={selectedModel}
            onSelectChange={setSelectedModel}
          />
          <VoiceSelect
            voicesConfig={voicesConfig}
            selectedVoice={selectedVoice}
            onSelectChange={setSelectedVoice}
          />
          {isLoading ? (
            <div>
              {"Loading model..."} ({Math.round(progress.progress * 100)}%)
            </div>
          ) : (
            <>
              <MessageDisplay messages={messages} />
              <ChatInterface
                onSubmit={handleSubmit}
                isResponding={isResponding}
              />
              <button onClick={handleMuteToggle}>
                {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
              </button>
              <audio ref={audioRef} />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
