"use client";

import { useState } from "react";
import { FaTimes, FaGlobe } from "react-icons/fa";
import Image from "next/image";

interface BookmarkItemProps {
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

export default function BookmarkItem({ bookmark, onDelete, onTagClick }: BookmarkItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };
  
  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };
  
  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/bookmarks/${bookmark._id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete bookmark");
      }
      
      onDelete(bookmark._id);
    } catch (error) {
      console.error("Error deleting bookmark:", error);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-lg">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        {showDeleteConfirm ? (
          <div className="flex flex-col space-y-3">
            <p className="text-sm text-gray-700 dark:text-gray-300">Are you sure you want to delete this bookmark?</p>
            <div className="flex space-x-2">
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
              <button
                onClick={handleCancelDelete}
                className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {bookmark.favicon ? (
                <div className="w-6 h-6 flex items-center justify-center">
                  <Image 
                    src={bookmark.favicon} 
                    alt="" 
                    width={24} 
                    height={24} 
                    className="rounded-sm max-w-full max-h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = "/globe.svg";
                    }}
                  />
                </div>
              ) : (
                <FaGlobe className="text-gray-400" size={24} />
              )}
              <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                {bookmark.title}
              </h3>
            </div>
            <button
              onClick={handleDeleteClick}
              disabled={isDeleting}
              className="p-1 rounded-full text-gray-500 hover:text-red-500 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
              aria-label="Delete bookmark"
            >
              <FaTimes size={16} />
            </button>
          </div>
        )}
        
        <a 
          href={bookmark.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm text-gray-500 dark:text-gray-400 hover:underline hover:text-blue-600 dark:hover:text-blue-400 mt-1 block truncate transition-colors"
        >
          {bookmark.url}
        </a>
        
        {bookmark.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {bookmark.tags.map((tag) => (
              <button
                key={tag}
                onClick={() => onTagClick(tag)}
                className="inline-flex items-center bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full px-3 py-1 text-xs hover:bg-blue-200 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>
      
      <div className="p-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 transition-colors"
          aria-expanded={isExpanded}
        >
          <span className="mr-1">{isExpanded ? "▼" : "►"}</span>
          <span>{isExpanded ? "Hide Summary" : "Show Summary"}</span>
        </button>
        
        {isExpanded && (
          <div 
            className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap bg-gray-50 dark:bg-gray-900/50 p-3 rounded-md border border-gray-100 dark:border-gray-800 animate-fadeIn"
          >
            {bookmark.summary || "No summary available."}
          </div>
        )}
      </div>
    </div>
  );
}
