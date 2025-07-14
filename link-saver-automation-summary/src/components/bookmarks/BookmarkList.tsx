"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import AddBookmarkForm from "./AddBookmarkForm";
import SortableBookmarkItem from "./SortableBookmarkItem";

interface Bookmark {
  _id: string;
  url: string;
  title: string;
  favicon: string;
  summary: string;
  tags: string[];
  order: number;
}

export default function BookmarkList() {
  const { data: session } = useSession();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [allTags, setAllTags] = useState<string[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const fetchBookmarks = async () => {
    try {
      setIsLoading(true);
      let url = "/api/bookmarks";
      
      if (selectedTag) {
        url += `?tag=${selectedTag}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error("Failed to fetch bookmarks");
      }
      
      const data = await response.json();
      setBookmarks(data);
      
      // Extract all unique tags
      const tags = new Set<string>();
      data.forEach((bookmark: Bookmark) => {
        bookmark.tags.forEach((tag: string) => tags.add(tag));
      });
      
      setAllTags(Array.from(tags));
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchBookmarks();
    }
  }, [session, selectedTag]);

  const handleBookmarkAdded = () => {
    fetchBookmarks();
  };

  const handleBookmarkDeleted = (id: string) => {
    setBookmarks(prev => prev.filter(bookmark => bookmark._id !== id));
    
    // Refresh all tags
    const remainingTags = new Set<string>();
    bookmarks
      .filter(bookmark => bookmark._id !== id)
      .forEach(bookmark => {
        bookmark.tags.forEach(tag => remainingTags.add(tag));
      });
    
    setAllTags(Array.from(remainingTags));
    
    // If the deleted bookmark contained the last instance of the selected tag, clear the filter
    if (selectedTag && !Array.from(remainingTags).includes(selectedTag)) {
      setSelectedTag(null);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      // Find the indices of the items
      const oldIndex = bookmarks.findIndex(item => item._id === active.id);
      const newIndex = bookmarks.findIndex(item => item._id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        // Update local state first for immediate UI feedback
        const newBookmarks = arrayMove(bookmarks, oldIndex, newIndex);
        setBookmarks(newBookmarks);
        
        // Then update on the server
        try {
          const bookmarkIds = newBookmarks.map((bookmark: Bookmark) => bookmark._id);
          await fetch("/api/bookmarks/reorder", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ bookmarkIds }),
          });
        } catch (error) {
          console.error("Failed to update bookmark order:", error);
          // Revert to original order if the server update fails
          fetchBookmarks();
        }
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <AddBookmarkForm onBookmarkAdded={handleBookmarkAdded} />
      
      {allTags.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Filter by Tag</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-3 py-1 rounded-full text-sm ${
                !selectedTag 
                ? "bg-blue-600 text-white" 
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              All
            </button>
            
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedTag === tag 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {isLoading ? (
        <div className="text-center py-10">Loading bookmarks...</div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700 dark:text-red-400">{error}</p>
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="text-center py-10 text-gray-600 dark:text-gray-400">
          {selectedTag 
            ? `No bookmarks found with tag "${selectedTag}".` 
            : "No bookmarks yet. Add your first bookmark above!"}
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis]}
        >
          <SortableContext items={bookmarks.map(b => b._id)} strategy={verticalListSortingStrategy}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarks.map((bookmark) => (
                <SortableBookmarkItem
                  key={bookmark._id}
                  id={bookmark._id}
                  bookmark={bookmark}
                  onDelete={handleBookmarkDeleted}
                  onTagClick={(tag: string) => setSelectedTag(tag)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
