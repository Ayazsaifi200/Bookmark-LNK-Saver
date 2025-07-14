"use client";

import { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { FaSun, FaMoon } from "react-icons/fa";
import { useTheme } from "next-themes";
import { AuthGuard } from "@/components/AuthGuard";
import BookmarkList from "@/components/bookmarks/BookmarkList";
import Image from "next/image";

export default function Home() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // When mounted on client, we can show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Link Saver</h1>
            
            <div className="flex items-center space-x-4">
              {/* Theme Toggle Button */}
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-yellow-400 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                aria-label="Toggle Dark Mode"
              >
                {mounted && (theme === "dark" ? (
                  <FaSun size={18} className="text-yellow-400" />
                ) : (
                  <FaMoon size={18} className="text-gray-700" />
                ))}
              </button>
              
              {/* User Menu */}
              {session ? (
                <div className="relative group">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-700 dark:text-gray-300">{session.user?.email}</span>
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Link
                    href="/signin"
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {session ? (
            <BookmarkList />
          ) : (
            <div className="max-w-6xl mx-auto py-12">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                  Welcome to Link Saver + Auto-Summary
                </h2>
                <p className="text-xl mb-8 max-w-3xl mx-auto text-gray-600 dark:text-gray-300">
                  Your all-in-one solution for organizing web content with intelligent summaries
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link
                    href="/signin"
                    className="px-8 py-3 text-lg bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="px-8 py-3 text-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>

              {/* Feature Section */}
              <div className="grid md:grid-cols-3 gap-8 mb-16">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                    <Image src="/globe.svg" alt="Save" width={24} height={24} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Save Any Link</h3>
                  <p className="text-gray-600 dark:text-gray-300">Easily save and organize links from any website with just one click.</p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
                    <Image src="/file.svg" alt="Summarize" width={24} height={24} className="text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Auto Summaries</h3>
                  <p className="text-gray-600 dark:text-gray-300">Get AI-powered summaries of your saved links to quickly understand content.</p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                    <Image src="/window.svg" alt="Organize" width={24} height={24} className="text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Easy Organization</h3>
                  <p className="text-gray-600 dark:text-gray-300">Drag and drop to reorder your bookmarks and keep them organized.</p>
                </div>
              </div>

              {/* Call to Action */}
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">Ready to get started?</h3>
                <p className="text-lg mb-6 text-gray-600 dark:text-gray-300">
                  Create your free account today and start saving your favorite links.
                </p>
                <Link
                  href="/signup"
                  className="px-8 py-3 text-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Get Started For Free
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>
    </AuthGuard>
  );
}
