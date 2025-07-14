// Use native fetch API instead of isomorphic-unfetch
// No need to import fetch as it's available globally in modern environments

/**
 * Fetch title and favicon from a URL
 */
export async function fetchFaviconAndTitle(url: string): Promise<{ title: string; favicon: string }> {
  try {
    // Add protocol if missing
    const fullUrl = url.startsWith("http") ? url : `https://${url}`;
    
    // Fetch the webpage HTML
    const response = await fetch(fullUrl);
    const html = await response.text();
    
    // Extract title
    let title = extractTitle(html) || new URL(fullUrl).hostname;
    
    // Extract favicon
    let favicon = "";
    const faviconFromLink = extractFaviconFromLink(html, fullUrl);
    if (faviconFromLink) {
      favicon = faviconFromLink;
    } else {
      // Try default favicon location
      const defaultFavicon = `${new URL(fullUrl).origin}/favicon.ico`;
      try {
        const faviconResponse = await fetch(defaultFavicon, { method: "HEAD" });
        if (faviconResponse.ok) {
          favicon = defaultFavicon;
        }
      } catch (error) {
        console.error("Error checking default favicon:", error);
      }
    }
    
    return { title, favicon };
  } catch (error) {
    console.error("Error fetching title and favicon:", error);
    return {
      title: new URL(url.startsWith("http") ? url : `https://${url}`).hostname,
      favicon: "",
    };
  }
}

/**
 * Extract title from HTML
 */
function extractTitle(html: string): string | null {
  // Try Open Graph title first
  const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']*)["'][^>]*>/i);
  if (ogTitleMatch && ogTitleMatch[1]) {
    return ogTitleMatch[1];
  }
  
  // Fall back to regular title tag
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  if (titleMatch && titleMatch[1]) {
    return titleMatch[1].trim();
  }
  
  return null;
}

/**
 * Extract favicon from HTML link tags
 */
function extractFaviconFromLink(html: string, baseUrl: string): string | null {
  // Look for link rel="icon", "shortcut icon", etc.
  const iconMatches = [
    ...html.matchAll(/<link[^>]*rel=["'](?:icon|shortcut icon|apple-touch-icon)[^"']*["'][^>]*href=["']([^"']*)["'][^>]*>/gi)
  ];
  
  if (iconMatches.length > 0) {
    for (const match of iconMatches) {
      if (match && match[1]) {
        let faviconUrl = match[1];
        
        // Ensure absolute URL
        if (faviconUrl.startsWith("/")) {
          faviconUrl = `${new URL(baseUrl).origin}${faviconUrl}`;
        } else if (!faviconUrl.startsWith("http")) {
          faviconUrl = `${new URL(baseUrl).origin}/${faviconUrl}`;
        }
        
        return faviconUrl;
      }
    }
  }
  
  return null;
}

/**
 * Fetch summary from URL using Jina AI
 */
export async function fetchSummaryFromURL(url: string): Promise<string> {
  try {
    // Add protocol if missing
    const fullUrl = url.startsWith("http") ? url : `https://${url}`;
    const encodedUrl = encodeURIComponent(fullUrl);
    
    // Make request to Jina AI using native fetch API
    const response = await fetch(`https://r.jina.ai/http://${encodedUrl}`);
    
    if (!response.ok) {
      throw new Error(`Failed to get summary: ${response.status}`);
    }
    
    const summary = await response.text();
    
    // Trim the summary if it's too long (optional)
    return summary.length > 1000 ? `${summary.substring(0, 997)}...` : summary;
  } catch (error) {
    console.error("Error fetching summary:", error);
    return "Summary temporarily unavailable.";
  }
}
