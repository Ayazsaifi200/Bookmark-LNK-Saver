import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import dbConnect from "@/lib/dbConnect";
import Bookmark from "@/models/Bookmark";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { fetchSummaryFromURL, fetchFaviconAndTitle } from "@/lib/urlUtils";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const tag = searchParams.get("tag");
    
    // Build query
    const query: any = { userId: session.user.id };
    if (tag) {
      query.tags = tag;
    }
    
    // Get bookmarks sorted by order
    const bookmarks = await Bookmark.find(query).sort({ order: 1 });
    
    return NextResponse.json(bookmarks);
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookmarks" },
      { status: 500 }
    );
  }
}

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
    const { url, tags = [] } = await request.json();
    
    if (!url) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }
    
    // Check if bookmark already exists for this user
    const existingBookmark = await Bookmark.findOne({ 
      url, 
      userId: session.user.id 
    });
    
    if (existingBookmark) {
      return NextResponse.json(
        { error: "Bookmark already exists" },
        { status: 409 }
      );
    }
    
    // Get the highest order value
    const highestOrderBookmark = await Bookmark.findOne({ userId: session.user.id })
      .sort({ order: -1 });
    const newOrder = highestOrderBookmark ? highestOrderBookmark.order + 1 : 0;
    
    // Fetch title and favicon
    const { title, favicon } = await fetchFaviconAndTitle(url);
    
    // Fetch summary
    const summary = await fetchSummaryFromURL(url);
    
    // Create bookmark
    const bookmark = new Bookmark({
      url,
      title,
      favicon,
      summary,
      tags,
      order: newOrder,
      userId: session.user.id,
    });
    
    await bookmark.save();
    
    return NextResponse.json(bookmark, { status: 201 });
  } catch (error) {
    console.error("Error creating bookmark:", error);
    return NextResponse.json(
      { error: "Failed to create bookmark" },
      { status: 500 }
    );
  }
}
