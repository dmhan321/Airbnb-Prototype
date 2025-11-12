# PowerShell script to start all microservices
Write-Host "🚀 Starting all microservices..." -ForegroundColor Green
Write-Host ""

$services = @(
    @{Name="Traveler Service"; Port=5001; Dir="traveler-service"},
    @{Name="Owner Service"; Port=5002; Dir="owner-service"},
    @{Name="Property Service"; Port=5003; Dir="property-service"},
    @{Name="Booking Service"; Port=5004; Dir="booking-service"}
)

$jobs = @()

foreach ($service in $services) {
    $servicePath = Join-Path $PSScriptRoot "services\$($service.Dir)"
    
    Write-Host "Starting $($service.Name) on port $($service.Port)..." -ForegroundColor Yellow
    
    # Check if node_modules exists, if not, install dependencies
    $nodeModulesPath = Join-Path $servicePath "node_modules"
    if (-not (Test-Path $nodeModulesPath)) {
        Write-Host "  Installing dependencies for $($service.Name)..." -ForegroundColor Cyan
        Set-Location $servicePath
        npm install
        Set-Location $PSScriptRoot
    }
    
    # Start the service in a new window
    $job = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$servicePath'; npm run dev" -PassThru
    $jobs += $job
    
    Start-Sleep -Seconds 2
}

Write-Host ""
Write-Host "✅ All services started in separate windows!" -ForegroundColor Green
Write-Host "Press any key to close this window (services will continue running)..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

