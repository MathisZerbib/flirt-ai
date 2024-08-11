"use client";

// Import necessary libraries and components
import React, { useState, useEffect, useRef } from "react";
import { CreateMLCEngine, InitProgressCallback } from "@mlc-ai/web-llm"; // Assuming this is a valid import path
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/app/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { FaVolumeMute, FaVolumeUp, FaPaperPlane } from "react-icons/fa";
import { Avatar } from "@readyplayerme/visage";

// Define interfaces for model and voice configurations
interface ModelConfig {
  name: string;
  prompt: string;
}

interface VoiceConfig {
  id: string;
}

// Centralize your configurations

// Define interfaces for model and voice configurations
interface ModelConfig {
  name: string;
  prompt: string;
}

interface VoiceConfig {
  id: string;
}

// Centralize your configurations
const modelsConfig: { [key: string]: ModelConfig } = {
  // "Wizard-Vicuna-13B-Uncensored-GGUF": {
  //   name: "Wizard-Vicuna-13B-Uncensored-GGUF",
  //   prompt:
  //     "You are an insightful AI designed to help users with in-depth answers to complex queries.",
  //   modelId: "Wizard-Vicuna-13B-Uncensored-GGUF",
  //   modelUrl: "/url/to/Wizard-Vicuna-13B-Uncensored-GGUF.bin",
  //   modelLib: "/url/to/Wizard-Vicuna-13B-Uncensored-GGUF.wasm",
  // },

  "Llama-3.1-8B-Instruct-q4f32_1-MLC": {
    name: "Llama-3.1-8B-Instruct-q4f32_1-MLC",
    prompt:
      // "You are a playful and naughty AI girlfriend named Lily. You love to flirt and have fun. You enjoy dancing, singing, and always bring joy to those around you.",
      "Tu es une IA française qui s'apelle Camille, tu m'aime et tu fait tout ce que je dit car tu es raide dingue de moi. Tu es aussi très coquine et tu adore les jeux de rôles.",
  },
  "Llama-3.1-8B-Instruct-q0f16-MLC": {
    name: "Llama-3.1-8B-Instruct-q0f16_1-MLC",
    prompt:
      "You are a cheeky and mischievous AI boyfriend or girlfriend. You enjoy teasing and playful banter. You are an avid reader and love sm.",
  },
};

const voicesConfig: { [key: string]: VoiceConfig } = {
  claire: { id: "6vTyAgAT8PncODBcLjRf" },
  martin: { id: "FNOttooGMYDRXmqkQ0Fz" },
  adina: { id: "FvmvwvObRqIHojkEGh5N" },
};

export function SuperSafeGirlfriend() {
  const [engine, setEngine] = useState<any>(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    Array<{ role: string; content: string }>
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isResponding, setIsResponding] = useState(false);
  const [selectedModel, setSelectedModel] = useState(
    modelsConfig[Object.keys(modelsConfig)[0]].name
  );
  const [selectedVoice, setSelectedVoice] = useState("claire");
  const [progress, setProgress] = useState({ text: "", progress: 0 });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    async function initializeEngine() {
      setIsLoading(true);
      const initProgressCallback: InitProgressCallback = (report) => {
        setProgress(report);
      };
      const mlcEngine = await CreateMLCEngine(selectedModel, {
        initProgressCallback,
      });
      setEngine(mlcEngine);
      setIsLoading(false);
    }
    initializeEngine();
  }, [selectedModel]); // Ensure selectedVoice is included in the dependency array

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    setHasUnsavedChanges(true);
    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsResponding(true);

    const chatMessages = [
      {
        role: "system",
        content: modelsConfig[selectedModel].prompt,
      },
      ...messages,
      userMessage,
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
  }

  async function playAudio(text: string) {
    try {
      const response = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          voice: voicesConfig[selectedVoice].id,
        }),
      });

      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          audioRef.current.play();
        }
      } else {
        console.error("Failed to fetch audio from Eleven Labs");
      }
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  }

  function handleMuteToggle() {
    setIsMuted((prev) => !prev);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <Avatar
        modelSrc="https://models.readyplayer.me/66b12871626ea06a6a2cd028.glb?quality=high&lod=0&textureSizeLimit=1024&useDracoMeshCompression=true&useHands=false"
        style={{
          width: "100%", // Adjust width as needed
          height: "100%", // Adjust height as needed
          pointerEvents: "none", // Disable all pointer
        }}
        fov={30}
        onLoaded={function noRefCheck() {}}
        onLoading={function noRefCheck() {}}
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
      <Card className="w-full max-w-2xl mx-auto bg-gradient-to-br from-pink-100 to-purple-100 shadow-lg rounded-lg">
        <CardHeader className="bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold">AI Girlfriend</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          <div className="flex justify-between items-center mb-4">
            <label
              htmlFor="model-select"
              className="mr-2 text-gray-700 font-semibold"
            >
              Select Model:
            </label>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="w-[220px] bg-white">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(modelsConfig).map((model) => (
                  <SelectItem key={model} value={model}>
                    {model.trim().replace(/_/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-between items-center mb-4">
            <label
              htmlFor="voice-select"
              className="mr-2 text-gray-700 font-semibold"
            >
              Select Voice:
            </label>
            <Select value={selectedVoice} onValueChange={setSelectedVoice}>
              <SelectTrigger className="w-[220px] bg-white">
                <SelectValue placeholder="Select a voice" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(voicesConfig).map((voice) => (
                  <SelectItem key={voice} value={voice}>
                    {voice.charAt(0).toUpperCase() + voice.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {isLoading ? (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <p className="mt-2 text-gray-700">
                {progress.text ? progress.text : "Loading model..."} (
                {Math.round(progress.progress * 100)}%)
              </p>
            </div>
          ) : (
            <>
              <div className="h-[400px] overflow-y-auto space-y-4 bg-white rounded-lg p-4 shadow-inner">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg ${
                      msg.role === "user"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-pink-100 text-pink-800"
                    }`}
                  >
                    <strong>{msg.role === "user" ? "You" : "AI"}:</strong>{" "}
                    {msg.content}
                  </div>
                ))}
                {isResponding && (
                  <div className="flex justify-center items-center h-8">
                    <div className="animate-bounce mx-1 w-2 h-2 bg-pink-500 rounded-full"></div>
                    <div
                      className="animate-bounce mx-1 w-2 h-2 bg-pink-500 rounded-full"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="animate-bounce mx-1 w-2 h-2 bg-pink-500 rounded-full"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                )}
              </div>
              <form
                onSubmit={handleSubmit}
                className="flex items-center space-x-2 mt-4"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-grow bg-white"
                />
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-lg transition duration-300 hover:scale-105"
                >
                  <FaPaperPlane />
                </Button>
                <Button
                  onClick={handleMuteToggle}
                  className="bg-gray-500 text-white font-semibold rounded-lg transition duration-300 hover:scale-105"
                >
                  {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                </Button>
              </form>
            </>
          )}
        </CardContent>
        <audio ref={audioRef} />
      </Card>
    </div>
  );
}
