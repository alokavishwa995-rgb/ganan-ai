"use client";

import { useState, useEffect } from "react";

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  imageUrl?: string; // Photo Scan කළ පින්තූරය තිබේ නම්
  timestamp: number;
}

export function useLocalChat(storageKey: string = "gmath_chat_history") {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // 🎯 1. App එක Open වෙද්දීම Phone එකේ Storage එකෙන් Messages ලෝඩ් කිරීම
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setMessages(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Local storage error:", error);
    } finally {
      setIsLoaded(true);
    }
  }, [storageKey]);

  // 🎯 2. අලුත් Message එකක් Phone එකේ Save කිරීම
  const addMessage = (msg: Omit<ChatMessage, "id" | "timestamp">) => {
    const newMsg: ChatMessage = {
      ...msg,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };

    setMessages((prev) => {
      const updated = [...prev, newMsg];
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch (err) {
        console.error("Storage limit hit or error:", err);
      }
      return updated;
    });
  };

  // 🎯 3. History එක Clear කිරීමට අවශ්‍ය නම් (Clear Button එකකට)
  const clearHistory = () => {
    localStorage.removeItem(storageKey);
    setMessages([]);
  };

  return { messages, addMessage, clearHistory, isLoaded };
}