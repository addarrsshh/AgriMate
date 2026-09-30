$nodeDir = "C:\Program Files\nodejs"

# Add to current session PATH
$env:Path = "$nodeDir;$env:Path"

# Add to User PATH persistently if not already there
$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($userPath -notlike "*$nodeDir*") {
    [Environment]::SetEnvironmentVariable("Path", "$userPath;$nodeDir", "User")
    Write-Host "[Setup] Added $nodeDir to User Environment PATH."
}

Write-Host "=========================================="
Write-Host "Node.js Path: $(Get-Command node | Select-Object -ExpandProperty Source)"
Write-Host "Node Version: $(node -v)"
Write-Host "NPM Version:  $(npm -v)"
Write-Host "=========================================="

Write-Host "`n>>> [1/2] Installing Backend Dependencies..."
Set-Location "c:\Users\PC\Desktop\Hackathon\backend"
npm install --no-audit

Write-Host "`n>>> [2/2] Installing Frontend Dependencies..."
Set-Location "c:\Users\PC\Desktop\Hackathon\frontend"
npm install --no-audit

Write-Host "`n=========================================="
Write-Host "SUCCESS: All packages installed successfully!"
Write-Host "=========================================="
