"use client";

import React, { useState, useRef } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import {
  Flag,
  Pencil,
  Copy,
  CopyPlus,
  Trash2,
  MoreVertical,
} from "lucide-react";

interface PageButtonProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  isActive: string;
  setActive: (id: string) => void;
}

const PageButton: React.FC<PageButtonProps> = ({ id, label, icon, isActive, setActive }) => {
  // Drag-and-drop logic
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : undefined,
    cursor: 'grab',
  };

  // Dropdown and focus logic
  const [focused, setFocused] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Single Responsibility: handle button click
  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActive(id);
  };

  return (
    <div
      ref={(node) => {
        setNodeRef(node);
        wrapperRef.current = node;
      }}
      style={style}
      {...attributes}
      {...listeners}
      className={`relative inline-block ${isDragging ? "shadow-lg" : ""}`}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!wrapperRef.current?.contains(e.relatedTarget)) {
          setFocused(false);
        }
      }}
    >
      {/* Dropdown above the button */}
      {focused && (
        <div
          tabIndex={-1}
          className="absolute bottom-full mb-2 w-56 rounded-lg border border-gray-200 bg-white shadow-lg z-10"
        >
          <div className="px-4 py-2 font-medium text-sm text-gray-800 border-b">
            Settings
          </div>
          <ul className="text-sm text-gray-700">
            <li className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer">
              <Flag className="w-4 h-4 text-blue-500" />
              Set as first page
            </li>
            <li className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer">
              <Pencil className="w-4 h-4" />
              Rename
            </li>
            <li className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer">
              <Copy className="w-4 h-4" />
              Copy
            </li>
            <li className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer">
              <CopyPlus className="w-4 h-4" />
              Duplicate
            </li>
            <li className="border-t mt-1" />
            <li className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 cursor-pointer">
              <Trash2 className="w-4 h-4" />
              Delete
            </li>
          </ul>
        </div>
      )}

      {/* The Button */}
      <button
        className={`
          cursor-pointer flex items-center justify-between gap-2 px-3 py-2 rounded-md border-none bg-gray-100 text-gray-500 transition-all
          hover:bg-gray-200
          focus:outline-none focus:ring-1 focus:ring-blue-200 focus:bg-white focus:shadow-blue-50 focus:text-black-500
          ${(focused || isActive === id) && "bg-white ring-1 ring-blue-200 shadow-blue-50"}
        `}
        onClick={handleButtonClick}
        aria-controls={`dropdown-${id}`}
      >
        <div className={`${(focused || isActive === id) && "text-yellow-500"}`}>{icon}</div>
        <span className={`text-sm font-medium ${(focused || isActive === id) && "text-black"}`}>{label}</span>
        {focused && <MoreVertical className="w-4 h-4 text-gray-400" />}
      </button>
    </div>
  );
};

export default PageButton;
