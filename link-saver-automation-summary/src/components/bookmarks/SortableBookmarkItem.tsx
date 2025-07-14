"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import BookmarkItem from "./BookmarkItem";

interface SortableBookmarkItemProps {
  id: string;
  bookmark: {
    _id: string;
    url: string;
    title: string;
    favicon: string;
    summary: string;
    tags: string[];
  };
  onDelete: (id: string) => void;
  onTagClick: (tag: string) => void;
}

export default function SortableBookmarkItem({ id, bookmark, onDelete, onTagClick }: SortableBookmarkItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: 'none',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-move"
    >
      <BookmarkItem
        bookmark={bookmark}
        onDelete={onDelete}
        onTagClick={onTagClick}
      />
    </div>
  );
}
