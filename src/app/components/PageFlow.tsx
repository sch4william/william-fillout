"use client";

import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import {
  Plus,
  FileText,
  Info,
  CheckCircle,
} from "lucide-react";
import React, { useCallback, useState } from "react";

import PageButton from "./PageButton";
import ConnectorWithPlus from "./ConnectorWithPlus";

interface Page {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const initialPages: Page[] = [
  { id: "Info", label: "Info", icon: <Info className="w-4 h-4" /> },
  { id: "Details", label: "Details", icon: <FileText className="w-4 h-4" /> },
  { id: "Other", label: "Other", icon: <FileText className="w-4 h-4" /> },
  { id: "Ending", label: "Ending", icon: <CheckCircle className="w-4 h-4" /> },
];

export default function PageFlow() {
  const [pages, setPages] = useState<Page[]>(initialPages);
  const [activeId, setActiveId] = useState("Info");

  const sensors = useSensors(useSensor(PointerSensor));

  // Open/Closed: handleDragEnd is open for extension (can be enhanced for more drag logic)
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = pages.findIndex((p) => p.id === active.id);
      const newIndex = pages.findIndex((p) => p.id === over?.id);
      setPages(arrayMove(pages, oldIndex, newIndex));
    }
  }, [pages]);

  // Single Responsibility: insertPageAt only inserts a new page
  const insertPageAt = useCallback((index: number) => {
    const otherCount = pages.filter(p => p.label.startsWith('Other')).length + 1;
    const newPage: Page = {
      id: `Other-${otherCount}`,
      label: `Other ${otherCount}`,
      icon: <FileText className="w-4 h-4" />,
    };
    setPages([...pages.slice(0, index), newPage, ...pages.slice(index)]);
  }, [pages]);

  // Liskov Substitution: PageButton can be replaced by any button with the same interface
  return (
    <div className="flex items-center px-4 py-4 rounded-md">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={pages.map((p) => p.id)} strategy={verticalListSortingStrategy}>
          {pages.map((page, index) => (
            <div key={page.id} className="flex items-center group relative">
              {index !== 0 && (
                <ConnectorWithPlus onClick={() => insertPageAt(index)} />
              )}
              <PageButton
                id={page.id}
                label={page.label}
                icon={page.icon}
                isActive={activeId}
                setActive={setActiveId}
              />
            </div>
          ))}
          <div className="relative flex items-center justify-center w-10 group min-w-[24px]">
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px border-t border-dashed border-gray-300 z-0" />
          </div>
          <button
            onClick={() => insertPageAt(pages.length)}
            className="flex items-center gap-2 px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-100 text-sm"
          >
            <Plus className="w-4 h-4" />
            Add page
          </button>
        </SortableContext>
      </DndContext>
    </div>
  );
}
