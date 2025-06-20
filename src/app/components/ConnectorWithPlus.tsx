import { Plus } from "lucide-react";
import React from "react";

interface ConnectorWithPlusProps {
  onClick: () => void;
}

const ConnectorWithPlus: React.FC<ConnectorWithPlusProps> = ({ onClick }) => (
  <div className="relative flex items-center justify-center w-10 group min-w-[24px]">
    <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px border-t border-dashed border-gray-300 z-0" />
    <button
      onClick={onClick}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 flex items-center justify-center rounded-full border border-gray-300 bg-white text-gray-400 hover:text-blue-500 hover:border-blue-400 transition-all shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10"
      aria-label="Add page"
      tabIndex={-1}
    >
      <Plus className="w-4 h-4" />
    </button>
  </div>
);

export default ConnectorWithPlus; 