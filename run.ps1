#!/usr/bin/env pwsh
# Run all services for Decision-Centric AI MSME Platform

Write-Host "🚀 Starting Decision-Centric AI for MSME Operations..." -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Gray

$ProjectRoot = $PSScriptRoot

# Check if .env exists
if (-not (Test-Path "$ProjectRoot\.env")) {
    Write-Host "❌ .env file not found. Please run setup.ps1 first" -ForegroundColor Red
    exit 1
}

Write-Host "`n📋 Starting services in separate windows..." -ForegroundColor Yellow

# Start Backend
Write-Host "`n🔧 Starting Backend API..." -ForegroundColor Green
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd '$ProjectRoot\backend'; .\venv\Scripts\Activate.ps1; python app.py"

# Wait a bit before starting next service
Start-Sleep -Seconds 2

# Start AI Agents
Write-Host "🤖 Starting AI Agents..." -ForegroundColor Green
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd '$ProjectRoot\ai_agents'; .\venv\Scripts\Activate.ps1; python automation_loop.py"

# Wait a bit before starting next service
Start-Sleep -Seconds 2

# Start Frontend
Write-Host "🎨 Starting Frontend..." -ForegroundColor Green
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd '$ProjectRoot\frontend'; npm start"

Write-Host "`n✅ All services starting..." -ForegroundColor Green
Write-Host "`n📍 Access points:" -ForegroundColor Cyan
Write-Host "   Frontend:  http://localhost:3000"
Write-Host "   Backend:   http://localhost:8000"
Write-Host "   API Docs:  http://localhost:8000/docs"
Write-Host ""
Write-Host "Press Ctrl+C in each window to stop services" -ForegroundColor Yellow
