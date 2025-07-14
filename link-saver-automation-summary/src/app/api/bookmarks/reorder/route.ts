import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import dbConnect from "@/lib/dbConnect";
import Bookmark from "@/models/Bookmark";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();
    
    const { bookmarkIds } = await request.json();
    
    if (!Array.isArray(bookmarkIds)) {
      return NextResponse.json(
        { error: "bookmarkIds must be an array" },
        { status: 400 }
      );
    }
    
    // Update order for each bookmark
    const updatePromises = bookmarkIds.map((id, index) => {
      return Bookmark.updateOne(
        { _id: id, userId: session.user.id },
        { order: index }
      );
    });
    
    await Promise.all(updatePromises);
    
    return NextResponse.json({ message: "Bookmarks reordered successfully" });
  } catch (error) {
    console.error("Error reordering bookmarks:", error);
    return NextResponse.json(
      { error: "Failed to reorder bookmarks" },
      { status: 500 }
    );
  }
}
