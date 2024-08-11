import { useState, useEffect } from 'react';
import { CreateMLCEngine, InitProgressCallback } from '@mlc-ai/web-llm';

interface EngineState {
  engine: any | null; // Adjust this type according to the actual type returned by CreateMLCEngine
  isLoading: boolean;
  progress: {
    text: string;
    progress: number;
  };
}

export const useInitializeEngine = (selectedModel: string): EngineState => {
  const [engine, setEngine] = useState<any | null>(null); // Adjust this type according to the actual type returned by CreateMLCEngine
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState<{ text: string; progress: number }>({ text: '', progress: 0 });

  useEffect(() => {
    const initializeEngine = async () => {
      setIsLoading(true);
      const initProgressCallback: InitProgressCallback = (report) => {
        setProgress(report);
      };
      try {
        // Await the promise and store the resolved value
        const mlcEngine = await CreateMLCEngine(selectedModel, { initProgressCallback });
        setEngine(mlcEngine); // This should work if types are correctly defined
      } catch (error) {
        console.error('Failed to initialize AI engine:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeEngine();
  }, [selectedModel]);

  return { engine, isLoading, progress };
}