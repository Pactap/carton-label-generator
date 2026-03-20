# PowerShell script to invalidate CloudFront cache after deployment
# Usage: .\cloudfront-invalidate.ps1 -DistributionId "E1234567890ABC"

param(
    [Parameter(Mandatory=$true)]
    [string]$DistributionId
)

Write-Host "Creating CloudFront invalidation for distribution: $DistributionId" -ForegroundColor Yellow

try {
    $invalidation = aws cloudfront create-invalidation `
        --distribution-id $DistributionId `
        --paths "/*" `
        --output json | ConvertFrom-Json
    
    if ($invalidation.Invalidation.Id) {
        Write-Host "Invalidation created successfully!" -ForegroundColor Green
        Write-Host "Invalidation ID: $($invalidation.Invalidation.Id)" -ForegroundColor Cyan
        Write-Host "This may take 5-15 minutes to complete." -ForegroundColor Yellow
    } else {
        Write-Host "Error: Failed to create invalidation" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "Error: Failed to create invalidation" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}
