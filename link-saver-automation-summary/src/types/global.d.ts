// Fix for the mongoose global cache
import mongoose from 'mongoose';

declare global {
  var mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
  
  // Add NextAuth types
  namespace NodeJS {
    interface ProcessEnv {
      MONGODB_URI: string;
      NEXTAUTH_URL: string;
      NEXTAUTH_SECRET: string;
      NODE_ENV: 'development' | 'production';
    }
  }
}

// NextAuth interface enhancement
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
  
  interface User {
    id: string;
  }
}
