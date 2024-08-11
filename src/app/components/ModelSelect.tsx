import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

interface ModelSelectProps {
  modelsConfig: { [key: string]: { name: string; prompt: string } };
  selectedModel: string;
  onSelectChange: (model: string) => void;
}

const ModelSelect: React.FC<ModelSelectProps> = ({
  modelsConfig,
  selectedModel,
  onSelectChange,
}) => {
  return (
    <Select onValueChange={onSelectChange} value={selectedModel}>
      <SelectTrigger>
        <SelectValue placeholder="Select Model" />
      </SelectTrigger>
      <SelectContent>
        {Object.keys(modelsConfig).map((modelKey) => (
          <SelectItem key={modelKey} value={modelsConfig[modelKey].name}>
            {modelsConfig[modelKey].name.trim().replace(/_/g, " ")}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ModelSelect;
