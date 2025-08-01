#!/bin/bash

echo "🚀 Mission Groomsmen - Cloudflare Pages Deployment"
echo "=================================================="

# Build the project
echo "📦 Building project..."
bun run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build completed successfully!"

# Check if audio file exists in build output
if [ -f "dist/audio/mission-impossible-theme.mp3" ]; then
    echo "🎵 Audio file found in build output ✓"
else
    echo "⚠️  Warning: Audio file not found in build output"
fi

echo ""
echo "🌐 Deployment Options:"
echo "======================"
echo ""
echo "Option 1: Direct Upload via Cloudflare Dashboard"
echo "1. Go to https://dash.cloudflare.com"
echo "2. Navigate to Workers & Pages > Create application > Pages"
echo "3. Choose 'Upload assets'"
echo "4. Upload the entire 'dist' folder"
echo ""
echo "Option 2: Wrangler CLI (Recommended)"
echo "1. Install Wrangler: npm install -g wrangler"
echo "2. Login: wrangler login"
echo "3. Create project: wrangler pages project create mission-groomsmen"
echo "4. Deploy: wrangler pages deploy dist"
echo ""
echo "Option 3: Drag and Drop"
echo "1. Zip the 'dist' folder contents"
echo "2. Go to Cloudflare Pages dashboard"
echo "3. Drag and drop the zip file"
echo ""
echo "📁 Build output location: ./dist"
echo "🎵 Audio file location: ./dist/audio/mission-impossible-theme.mp3"
echo ""
echo "✅ Ready for deployment!" 