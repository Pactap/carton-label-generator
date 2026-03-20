# Quick Start - AWS Deployment

## Fastest Method: AWS S3 + CloudFront

### Prerequisites
1. Install AWS CLI: https://aws.amazon.com/cli/
2. Configure AWS credentials: `aws configure`

### Quick Deploy (5 minutes)

#### Step 1: Create S3 Bucket
```bash
aws s3 mb s3://your-bucket-name --region us-east-1
```

#### Step 2: Enable Static Website Hosting
```bash
aws s3 website s3://your-bucket-name --index-document index.html --error-document index.html
```

#### Step 3: Set Bucket Policy (Replace YOUR-BUCKET-NAME)
```bash
aws s3api put-bucket-policy --bucket YOUR-BUCKET-NAME --policy '{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "PublicReadGetObject",
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
  }]
}'
```

#### Step 4: Deploy Files

**Windows (PowerShell):**
```powershell
.\deploy-s3.ps1 -BucketName "your-bucket-name" -Region "us-east-1" -EnableWebsiteHosting
```

**Linux/Mac:**
```bash
./deploy-s3.sh -b your-bucket-name -r us-east-1 -w
```

**Or manually:**
```bash
aws s3 cp index.html s3://your-bucket-name/index.html --content-type "text/html"
aws s3 cp app.js s3://your-bucket-name/app.js --content-type "application/javascript"
aws s3 cp barcode.js s3://your-bucket-name/barcode.js --content-type "application/javascript"
aws s3 cp label.js s3://your-bucket-name/label.js --content-type "application/javascript"
aws s3 cp styles.css s3://your-bucket-name/styles.css --content-type "text/css"
```

#### Step 5: Access Your App
Visit: `http://your-bucket-name.s3-website-us-east-1.amazonaws.com`

---

## Alternative: AWS Amplify (Even Easier)

### Step 1: Install Amplify CLI
```bash
npm install -g @aws-amplify/cli
```

### Step 2: Initialize and Deploy
```bash
amplify init
amplify add hosting
amplify publish
```

That's it! Amplify will provide you with a URL.

---

## Update Your App

After making changes, redeploy:

**S3:**
```bash
# Windows
.\deploy-s3.ps1 -BucketName "your-bucket-name"

# Linux/Mac
./deploy-s3.sh -b your-bucket-name
```

**Amplify:**
```bash
amplify publish
```

---

## Add CloudFront (Recommended for Production)

1. Go to AWS CloudFront Console
2. Create distribution
3. Origin: Your S3 bucket
4. Viewer protocol: Redirect HTTP to HTTPS
5. Default root object: `index.html`
6. Create distribution
7. Wait 15-20 minutes
8. Use CloudFront URL instead of S3 URL

After updating files, invalidate cache:
```bash
# Windows
.\cloudfront-invalidate.ps1 -DistributionId "E1234567890ABC"

# Linux/Mac
./cloudfront-invalidate.sh -d E1234567890ABC
```

---

## Troubleshooting

**403 Forbidden:**
- Check bucket policy allows public read
- Verify static website hosting is enabled

**Files not updating:**
- Clear browser cache
- If using CloudFront, invalidate cache

**CDN libraries not loading:**
- Check internet connection
- Verify CDN URLs in `index.html` are accessible

---

For detailed instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)
