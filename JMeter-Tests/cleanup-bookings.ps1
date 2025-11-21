$baseUrl = "http://af859bf4c90fe45a8a617d2337fe265b-73469934.us-west-2.elb.amazonaws.com"
$ownerEmail = "john.smith@gmail.com"
$ownerPassword = "password123"

Write-Host "🔐 Logging in as owner..." -ForegroundColor Cyan

# Login as owner
$loginBody = @{
    email = $ownerEmail
    password = $ownerPassword
    userType = "owner"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/owner/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.token
    
    if (-not $token) {
        Write-Host "❌ Login failed: No token received" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "✅ Login successful!" -ForegroundColor Green
    
    # Get all owner bookings
    Write-Host "`n📋 Fetching owner bookings..." -ForegroundColor Cyan
    
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    
    $bookingsResponse = Invoke-RestMethod -Uri "$baseUrl/api/owner/bookings/owner" -Method GET -Headers $headers
    $bookings = $bookingsResponse.bookings
    
    if (-not $bookings -or $bookings.Count -eq 0) {
        Write-Host "✅ No bookings found!" -ForegroundColor Green
        exit 0
    }
    
    Write-Host "Found $($bookings.Count) bookings" -ForegroundColor Yellow
    
    # Filter for PENDING and ACCEPTED bookings
    $activeBookings = $bookings | Where-Object { $_.status -eq "PENDING" -or $_.status -eq "ACCEPTED" }
    
    if ($activeBookings.Count -eq 0) {
        Write-Host "✅ No active bookings to cancel (all are already CANCELLED/REJECTED)" -ForegroundColor Green
        exit 0
    }
    
    Write-Host "`n🗑️  Cancelling $($activeBookings.Count) active bookings..." -ForegroundColor Cyan
    
    $cancelled = 0
    $failed = 0
    
    foreach ($booking in $activeBookings) {
        try {
            $cancelResponse = Invoke-RestMethod -Uri "$baseUrl/api/owner/bookings/$($booking.id)/cancel" -Method PUT -Headers $headers
            if ($cancelResponse.success) {
                $cancelled++
                if ($cancelled % 50 -eq 0) {
                    Write-Host "  Progress: $cancelled/$($activeBookings.Count) cancelled..." -ForegroundColor Yellow
                }
            } else {
                $failed++
            }
        } catch {
            $failed++
        }
    }
    
    Write-Host "`n✅ Cleanup complete!" -ForegroundColor Green
    Write-Host "   Cancelled: $cancelled" -ForegroundColor Green
    Write-Host "   Failed: $failed" -ForegroundColor $(if ($failed -eq 0) { "Green" } else { "Red" })
    
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response: $responseBody" -ForegroundColor Red
    }
    exit 1
}

