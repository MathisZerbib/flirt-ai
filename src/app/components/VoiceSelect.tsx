import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

interface VoiceSelectProps {
  voicesConfig: { [key: string]: { id: string } };
  selectedVoice: string;
  onSelectChange: (voice: string) => void;
}

const VoiceSelect: React.FC<VoiceSelectProps> = ({
  voicesConfig,
  selectedVoice,
  onSelectChange,
}) => {
  return (
    <Select onValueChange={onSelectChange} value={selectedVoice}>
      <SelectTrigger>
        <SelectValue placeholder="Select Voice" />
      </SelectTrigger>
      <SelectContent>
        {Object.keys(voicesConfig).map((voiceKey) => (
          <SelectItem key={voiceKey} value={voiceKey}>
            {voiceKey.charAt(0).toUpperCase() + voiceKey.slice(1)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default VoiceSelect;
