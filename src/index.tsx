import { serve } from "bun";
import index from "./index.html";

// Helper function to determine content type based on file extension
function getContentType(filePath: string): string {
  const ext = filePath.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'mp3':
      return 'audio/mpeg';
    case 'wav':
      return 'audio/wav';
    case 'ogg':
      return 'audio/ogg';
    case 'm4a':
      return 'audio/mp4';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'svg':
      return 'image/svg+xml';
    case 'css':
      return 'text/css';
    case 'js':
      return 'application/javascript';
    case 'json':
      return 'application/json';
    case 'html':
      return 'text/html';
    case 'txt':
      return 'text/plain';
    default:
      return 'application/octet-stream';
  }
}

const server = serve({
  routes: {
    // Serve static files from public directory
    "/audio/*": async (req) => {
      const url = new URL(req.url);
      const filePath = `public${url.pathname}`;
      const file = Bun.file(filePath);
      
      if (await file.exists()) {
        return new Response(file, {
          headers: {
            "Content-Type": getContentType(filePath),
            "Cache-Control": "public, max-age=31536000", // Cache for 1 year
          },
        });
      }
      
      return new Response("File not found", { status: 404 });
    },

    // Serve other static files from public directory
    "/public/*": async (req) => {
      const url = new URL(req.url);
      const filePath = `public${url.pathname.replace('/public', '')}`;
      const file = Bun.file(filePath);
      
      if (await file.exists()) {
        return new Response(file, {
          headers: {
            "Content-Type": getContentType(filePath),
            "Cache-Control": "public, max-age=31536000", // Cache for 1 year
          },
        });
      }
      
      return new Response("File not found", { status: 404 });
    },

    // Serve index.html for all unmatched routes.
    "/*": index,

    "/api/hello": {
      async GET(req) {
        return Response.json({
          message: "Hello, world!",
          method: "GET",
        });
      },
      async PUT(req) {
        return Response.json({
          message: "Hello, world!",
          method: "PUT",
        });
      },
    },

    "/api/hello/:name": async req => {
      const name = req.params.name;
      return Response.json({
        message: `Hello, ${name}!`,
      });
    },
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
