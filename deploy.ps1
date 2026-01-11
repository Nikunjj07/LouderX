# Quick Deploy Script
# This script provides quick deployment commands for different platforms

Write-Host "Sydney Events Aggregator - Deployment Helper" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# Check if git is clean
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "WARNING: You have uncommitted changes!" -ForegroundColor Yellow
    Write-Host "Please commit or stash your changes before deploying." -ForegroundColor Yellow
    Write-Host ""
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne "y") {
        exit
    }
}

Write-Host "Select deployment option:" -ForegroundColor Green
Write-Host "1. Prepare for deployment (run tests, update docs)"
Write-Host "2. Deploy to Render (Backend)"
Write-Host "3. Deploy to Vercel (Frontend)"
Write-Host "4. Setup MongoDB Atlas"
Write-Host "5. View deployment checklist"
Write-Host "6. Exit"
Write-Host ""

$choice = Read-Host "Enter your choice (1-6)"

switch ($choice) {
    "1" {
        Write-Host "`nRunning pre-deployment checks..." -ForegroundColor Yellow
        
        # Backend tests
        Write-Host "`nTesting Backend..." -ForegroundColor Cyan
        Set-Location backend
        npm test
        Set-Location ..
        
        # Check environment files
        Write-Host "`nChecking environment files..." -ForegroundColor Cyan
        if (Test-Path ".env.production.example") {
            Write-Host "[OK] .env.production.example exists" -ForegroundColor Green
        } else {
            Write-Host "[WARNING] .env.production.example not found" -ForegroundColor Yellow
        }
        
        Write-Host "`nPre-deployment checks complete!" -ForegroundColor Green
        Write-Host "Review DEPLOYMENT_CHECKLIST.md before proceeding." -ForegroundColor Yellow
    }
    
    "2" {
        Write-Host "`nDeploying to Render..." -ForegroundColor Yellow
        Write-Host "Please follow these steps:" -ForegroundColor Cyan
        Write-Host "1. Go to https://dashboard.render.com"
        Write-Host "2. Click 'New +' > 'Web Service'"
        Write-Host "3. Connect your GitHub repository"
        Write-Host "4. Configure:"
        Write-Host "   - Name: sydney-events-api"
        Write-Host "   - Root Directory: backend"
        Write-Host "   - Build Command: npm install"
        Write-Host "   - Start Command: npm start"
        Write-Host "5. Add environment variables from .env.production.example"
        Write-Host "6. Click 'Create Web Service'"
        Write-Host ""
        Write-Host "Your backend will be deployed to: https://sydney-events-api.onrender.com"
    }
    
    "3" {
        Write-Host "`nDeploying to Vercel..." -ForegroundColor Yellow
        Write-Host "Please follow these steps:" -ForegroundColor Cyan
        Write-Host "1. Go to https://vercel.com"
        Write-Host "2. Click 'Add New' > 'Project'"
        Write-Host "3. Import your GitHub repository"
        Write-Host "4. Configure:"
        Write-Host "   - Framework Preset: Other"
        Write-Host "   - Root Directory: frontend"
        Write-Host "5. Update frontend/js/api.js with your backend URL"
        Write-Host "6. Click 'Deploy'"
        Write-Host ""
        Write-Host "Your frontend will be deployed to: https://sydney-events.vercel.app"
    }
    
    "4" {
        Write-Host "`nSetting up MongoDB Atlas..." -ForegroundColor Yellow
        Write-Host "Please follow these steps:" -ForegroundColor Cyan
        Write-Host "1. Go to https://www.mongodb.com/cloud/atlas"
        Write-Host "2. Sign up or log in"
        Write-Host "3. Create a new cluster (free tier available)"
        Write-Host "4. Create database user (Database Access)"
        Write-Host "5. Whitelist IP (Network Access) - use 0.0.0.0/0 for development"
        Write-Host "6. Get connection string (Connect > Connect your application)"
        Write-Host "7. Update MONGODB_URI in your environment variables"
        Write-Host ""
        Write-Host "See docs/mongodb-setup.md for detailed instructions"
    }
    
    "5" {
        if (Test-Path "DEPLOYMENT_CHECKLIST.md") {
            Write-Host "`nOpening deployment checklist..." -ForegroundColor Yellow
            Start-Process "DEPLOYMENT_CHECKLIST.md"
        } else {
            Write-Host "`nDEPLOYMENT_CHECKLIST.md not found!" -ForegroundColor Red
        }
    }
    
    "6" {
        Write-Host "`nExiting..." -ForegroundColor Yellow
        exit
    }
    
    default {
        Write-Host "`nInvalid choice!" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Deployment helper complete!" -ForegroundColor Green
Write-Host "For detailed instructions, see docs/DEPLOYMENT.md" -ForegroundColor Cyan
