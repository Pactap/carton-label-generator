# PowerShell script to deploy to AWS S3
# Usage: .\deploy-s3.ps1 -BucketName "your-bucket-name" -Region "us-east-1"

param(
    [Parameter(Mandatory=$true)]
    [string]$BucketName,
    
    [Parameter(Mandatory=$false)]
    [string]$Region = "us-east-1",
    
    [Parameter(Mandatory=$false)]
    [switch]$CreateBucket,
    
    [Parameter(Mandatory=$false)]
    [switch]$EnableWebsiteHosting
)

Write-Host "Starting deployment to S3..." -ForegroundColor Green

# Check if AWS CLI is installed
try {
    $awsVersion = aws --version
    Write-Host "AWS CLI found: $awsVersion" -ForegroundColor Green
} catch {
    Write-Host "Error: AWS CLI is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install AWS CLI from: https://aws.amazon.com/cli/" -ForegroundColor Yellow
    exit 1
}

# Check if bucket exists
$bucketExists = aws s3 ls "s3://$BucketName" 2>&1
if ($LASTEXITCODE -ne 0) {
    if ($CreateBucket) {
        Write-Host "Creating bucket: $BucketName in region: $Region" -ForegroundColor Yellow
        aws s3 mb "s3://$BucketName" --region $Region
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Error: Failed to create bucket" -ForegroundColor Red
            exit 1
        }
        Write-Host "Bucket created successfully" -ForegroundColor Green
    } else {
        Write-Host "Error: Bucket '$BucketName' does not exist" -ForegroundColor Red
        Write-Host "Use -CreateBucket to create it automatically" -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host "Bucket exists: $BucketName" -ForegroundColor Green
}

# Enable static website hosting if requested
if ($EnableWebsiteHosting) {
    Write-Host "Enabling static website hosting..." -ForegroundColor Yellow
    
    $websiteConfig = @"
{
    "IndexDocument": {
        "Suffix": "index.html"
    },
    "ErrorDocument": {
        "Key": "index.html"
    }
}
"@
    
    $websiteConfig | Out-File -FilePath "website-config.json" -Encoding UTF8
    aws s3 website "s3://$BucketName" --index-document "index.html" --error-document "index.html"
    Remove-Item "website-config.json"
    
    Write-Host "Static website hosting enabled" -ForegroundColor Green
}

# Upload files
Write-Host "Uploading files to S3..." -ForegroundColor Yellow

$filesToUpload = @("index.html", "app.js", "barcode.js", "label.js", "styles.css")

foreach ($file in $filesToUpload) {
    if (Test-Path $file) {
        Write-Host "Uploading: $file" -ForegroundColor Cyan
        aws s3 cp $file "s3://$BucketName/$file" --content-type "text/html" --content-type "application/javascript" --content-type "text/css"
    } else {
        Write-Host "Warning: $file not found, skipping..." -ForegroundColor Yellow
    }
}

# Set content types correctly
Write-Host "Setting correct content types..." -ForegroundColor Yellow
aws s3 cp "index.html" "s3://$BucketName/index.html" --content-type "text/html"
aws s3 cp "app.js" "s3://$BucketName/app.js" --content-type "application/javascript"
aws s3 cp "barcode.js" "s3://$BucketName/barcode.js" --content-type "application/javascript"
aws s3 cp "label.js" "s3://$BucketName/label.js" --content-type "application/javascript"
aws s3 cp "styles.css" "s3://$BucketName/styles.css" --content-type "text/css"

# Make files public (if needed)
Write-Host "Setting public read permissions..." -ForegroundColor Yellow
aws s3api put-object-acl --bucket $BucketName --key "index.html" --acl public-read
aws s3api put-object-acl --bucket $BucketName --key "app.js" --acl public-read
aws s3api put-object-acl --bucket $BucketName --key "barcode.js" --acl public-read
aws s3api put-object-acl --bucket $BucketName --key "label.js" --acl public-read
aws s3api put-object-acl --bucket $BucketName --key "styles.css" --acl public-read

Write-Host "`nDeployment completed successfully!" -ForegroundColor Green
Write-Host "Website URL: http://$BucketName.s3-website-$Region.amazonaws.com" -ForegroundColor Cyan
Write-Host "`nNote: Make sure your bucket policy allows public read access." -ForegroundColor Yellow
