$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$backend = Join-Path $root "backend"
$frontend = Join-Path $root "frontend"

if (-not (Get-Command uv -ErrorAction SilentlyContinue)) {
    Write-Host "uv is not installed or not in PATH. Install uv first, then run this script again." -ForegroundColor Red
    exit 1
}

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "npm is not installed or not in PATH. Install Node.js first, then run this script again." -ForegroundColor Red
    exit 1
}

if (-not (Test-Path (Join-Path $frontend "node_modules"))) {
    Write-Host "Installing frontend dependencies..."
    Push-Location $frontend
    npm install
    Pop-Location
}

Write-Host "Starting backend on http://localhost:8000 ..."
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-ExecutionPolicy", "Bypass",
    "-Command",
    "Set-Location '$backend'; uv run uvicorn app.main:app --reload --port 8000"
) -WindowStyle Normal

Write-Host "Starting frontend on http://localhost:5173 ..."
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-ExecutionPolicy", "Bypass",
    "-Command",
    "Set-Location '$frontend'; npm run dev"
) -WindowStyle Normal

Start-Sleep -Seconds 3
Start-Process "http://localhost:5173"

Write-Host "Done. Close the two server windows to stop the project."
