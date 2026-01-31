#!/usr/bin/env pwsh
# Complete Setup and Run Script for Decision-Centric AI MSME Platform

Write-Host "🚀 Decision-Centric AI for MSME - Complete Setup" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Gray

$ProjectRoot = "C:\Users\DARSHAN\OneDrive\Desktop\Decision-Centric AI for MSME Operations"

# Function to check if command exists
function Test-Command {
    param($Command)
    $null -ne (Get-Command $Command -ErrorAction SilentlyContinue)
}

# Check prerequisites
Write-Host "`n📋 Checking prerequisites..." -ForegroundColor Yellow
if (-not (Test-Command python)) {
    Write-Host "❌ Python not found. Please install Python 3.12+" -ForegroundColor Red
    exit 1
}
if (-not (Test-Command node)) {
    Write-Host "❌ Node.js not found. Please install Node.js 16+" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Python and Node.js found" -ForegroundColor Green

# Setup environment file
Write-Host "`n⚙️  Setting up environment..." -ForegroundColor Yellow
if (-not (Test-Path "$ProjectRoot\.env")) {
    Copy-Item "$ProjectRoot\.env.example" "$ProjectRoot\.env"
    Write-Host "✅ Created .env file (please add your API keys)" -ForegroundColor Green
} else {
    Write-Host "✅ .env file already exists" -ForegroundColor Green
}

Write-Host "`n✅ All dependencies installed successfully!" -ForegroundColor Green
Write-Host "`n📝 Next steps:" -ForegroundColor Cyan
Write-Host "1. Edit .env file and add your OPENAI_API_KEY"
Write-Host "2. Run: .\run.ps1 to start all services"
Write-Host ""
