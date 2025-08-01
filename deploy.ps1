# Mission Groomsmen - Cloudflare Pages Deployment Script (Windows)
Write-Host "Mission Groomsmen - Cloudflare Pages Deployment" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green

# Build the project
Write-Host "Building project..." -ForegroundColor Yellow
bun run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "Build completed successfully!" -ForegroundColor Green

# Check if audio file exists in build output
if (Test-Path "dist/audio/mission-impossible-theme.mp3") {
    Write-Host "Audio file found in build output" -ForegroundColor Green
} else {
    Write-Host "Warning: Audio file not found in build output" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Deployment Options:" -ForegroundColor Cyan
Write-Host "======================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Option 1: Direct Upload via Cloudflare Dashboard" -ForegroundColor White
Write-Host "1. Go to https://dash.cloudflare.com" -ForegroundColor Gray
Write-Host "2. Navigate to Workers and Pages - Create application - Pages" -ForegroundColor Gray
Write-Host "3. Choose 'Upload assets'" -ForegroundColor Gray
Write-Host "4. Upload the entire 'dist' folder" -ForegroundColor Gray
Write-Host ""
Write-Host "Option 2: Wrangler CLI (Recommended)" -ForegroundColor White
Write-Host "1. Install Wrangler: npm install -g wrangler" -ForegroundColor Gray
Write-Host "2. Login: wrangler login" -ForegroundColor Gray
Write-Host "3. Create project: wrangler pages project create mission-groomsmen" -ForegroundColor Gray
Write-Host "4. Deploy: wrangler pages deploy dist" -ForegroundColor Gray
Write-Host ""
Write-Host "Option 3: Drag and Drop" -ForegroundColor White
Write-Host "1. Right-click the 'dist' folder and 'Send to - Compressed (zipped) folder'" -ForegroundColor Gray
Write-Host "2. Go to Cloudflare Pages dashboard" -ForegroundColor Gray
Write-Host "3. Drag and drop the zip file" -ForegroundColor Gray
Write-Host ""
Write-Host "Build output location: ./dist" -ForegroundColor Magenta
Write-Host "Audio file location: ./dist/audio/mission-impossible-theme.mp3" -ForegroundColor Magenta
Write-Host ""
Write-Host "Ready for deployment!" -ForegroundColor Green 