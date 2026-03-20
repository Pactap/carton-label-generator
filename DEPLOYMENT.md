# AWS Deployment Guide

This guide covers deploying the Warehouse Label System to AWS using multiple methods.

## Prerequisites

- AWS Account
- AWS CLI installed and configured (`aws configure`)
- Basic knowledge of AWS services

## Method 1: AWS S3 + CloudFront (Recommended)

This is the most cost-effective method for static websites.

### Step 1: Create S3 Bucket

1. Open AWS S3 Console
2. Click "Create bucket"
3. Configure:
   - **Bucket name**: `warehouse-label-system` (or your preferred name, must be globally unique)
   - **Region**: Choose your preferred region (e.g., `us-east-1`)
   - **Block Public Access**: Uncheck "Block all public access" (we'll make it public for static hosting)
   - **Bucket Versioning**: Optional (recommended for production)
   - Click "Create bucket"

### Step 2: Enable Static Website Hosting

1. Select your bucket
2. Go to "Properties" tab
3. Scroll to "Static website hosting"
4. Click "Edit"
5. Enable static website hosting:
   - **Hosting type**: Static website hosting
   - **Index document**: `index.html`
   - **Error document**: `index.html` (for SPA routing)
6. Click "Save changes"
7. Note the **Bucket website endpoint** URL (e.g., `http://warehouse-label-system.s3-website-us-east-1.amazonaws.com`)

### Step 3: Configure Bucket Policy

1. Go to "Permissions" tab
2. Click "Bucket policy"
3. Add the following policy (replace `YOUR-BUCKET-NAME` with your bucket name):

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
        }
    ]
}
```

4. Click "Save changes"

### Step 4: Upload Files

**Option A: Using AWS Console**
1. Go to your bucket
2. Click "Upload"
3. Select all files: `index.html`, `app.js`, `barcode.js`, `label.js`, `styles.css`
4. Click "Upload"

**Option B: Using AWS CLI** (Recommended)
```bash
aws s3 sync . s3://YOUR-BUCKET-NAME --exclude "*.md" --exclude ".git/*" --exclude "DEPLOYMENT.md" --exclude "*.json"
```

**Option C: Using the provided script**
```bash
# Windows PowerShell
.\deploy-s3.ps1

# Linux/Mac
./deploy-s3.sh
```

### Step 5: Set Up CloudFront Distribution (Optional but Recommended)

CloudFront provides:
- HTTPS/SSL certificate
- Custom domain support
- Better performance (CDN)
- Lower latency

1. Open AWS CloudFront Console
2. Click "Create distribution"
3. Configure:
   - **Origin domain**: Select your S3 bucket (NOT the website endpoint)
   - **Origin access**: Select "Origin access control settings (recommended)"
   - **Viewer protocol policy**: Redirect HTTP to HTTPS
   - **Allowed HTTP methods**: GET, HEAD, OPTIONS
   - **Price class**: Choose based on your needs
   - **Default root object**: `index.html`
4. Click "Create distribution"
5. Wait for deployment (15-20 minutes)
6. Update S3 bucket policy to allow CloudFront access (CloudFront will provide the policy)

### Step 6: Access Your Application

- **S3 Website Endpoint**: `http://YOUR-BUCKET-NAME.s3-website-REGION.amazonaws.com`
- **CloudFront URL**: `https://YOUR-DISTRIBUTION-ID.cloudfront.net`

---

## Method 2: AWS Amplify (Easiest)

AWS Amplify provides automatic deployments with CI/CD.

### Step 1: Install Amplify CLI

```bash
npm install -g @aws-amplify/cli
```

### Step 2: Initialize Amplify

```bash
amplify init
```

Follow the prompts:
- Project name: `warehouse-label-system`
- Environment: `dev` (or `prod`)
- Default editor: Your preference
- Type: JavaScript
- Framework: None (static)
- Source directory: `.`
- Build command: (leave empty or use `echo "No build needed"`)
- Start command: (leave empty)

### Step 3: Add Hosting

```bash
amplify add hosting
```

Select:
- Hosting with Amplify Console
- Manual deployment

### Step 4: Publish

```bash
amplify publish
```

This will:
1. Create an S3 bucket
2. Set up CloudFront distribution
3. Upload your files
4. Provide you with a URL

### Step 5: Continuous Deployment (Optional)

1. Go to AWS Amplify Console
2. Select your app
3. Go to "Hosting" → "Amplify Hosting"
4. Connect your Git repository
5. Configure build settings (use the provided `amplify.yml`)

---

## Method 3: AWS Elastic Beanstalk

For more control, but overkill for a static site.

### Step 1: Create Application Package

Create a `package.json`:
```json
{
  "name": "warehouse-label-system",
  "version": "1.0.0",
  "scripts": {
    "start": "npx http-server -p 8080"
  },
  "dependencies": {
    "http-server": "^14.1.1"
  }
}
```

### Step 2: Deploy via Console

1. Open Elastic Beanstalk Console
2. Create new application
3. Choose "Web server environment"
4. Platform: Node.js
5. Upload your code
6. Deploy

**Note**: This method is more expensive and complex than needed for a static site.

---

## Cost Estimation

### S3 + CloudFront (Method 1)
- **S3 Storage**: ~$0.023 per GB/month (first 50 TB)
- **S3 Requests**: ~$0.0004 per 1,000 GET requests
- **CloudFront**: ~$0.085 per GB (first 10 TB)
- **Estimated monthly cost**: < $1 for low traffic

### AWS Amplify (Method 2)
- **Free tier**: 1,000 build minutes/month, 15 GB storage, 5 GB served/month
- **After free tier**: Similar to S3 + CloudFront
- **Estimated monthly cost**: Free for low traffic, then < $1

---

## Custom Domain Setup

### Using CloudFront

1. Request SSL certificate in AWS Certificate Manager (ACM)
2. In CloudFront distribution, add your domain
3. Update DNS records (CNAME) to point to CloudFront distribution
4. Wait for DNS propagation

### Using Route 53

1. Create hosted zone in Route 53
2. Register or transfer your domain
3. Create A record (alias) pointing to CloudFront distribution

---

## Updating Your Application

### S3 Method
```bash
aws s3 sync . s3://YOUR-BUCKET-NAME --exclude "*.md" --exclude ".git/*"
```

### Amplify Method
```bash
amplify publish
```

Or push to connected Git repository for automatic deployment.

---

## Troubleshooting

### CORS Issues
If you encounter CORS errors, ensure your S3 bucket policy allows public access.

### 403 Forbidden
- Check bucket policy
- Verify static website hosting is enabled
- Ensure files are uploaded correctly

### CloudFront Not Updating
- Invalidate CloudFront cache: `aws cloudfront create-invalidation --distribution-id YOUR-DIST-ID --paths "/*"`
- Wait 5-15 minutes for propagation

### CDN Libraries Not Loading
- Verify CDN URLs in `index.html` are accessible
- Check browser console for network errors

---

## Security Considerations

1. **HTTPS**: Always use CloudFront with HTTPS
2. **Bucket Policy**: Restrict access if needed
3. **CloudFront OAC**: Use Origin Access Control for S3
4. **WAF**: Consider AWS WAF for additional protection

---

## Monitoring

### CloudWatch Metrics
- Monitor S3 requests
- Track CloudFront distribution metrics
- Set up alarms for unusual activity

### Access Logs
- Enable S3 access logging
- Enable CloudFront access logs
- Analyze traffic patterns

---

## Backup and Versioning

1. Enable S3 versioning for rollback capability
2. Use S3 lifecycle policies for old versions
3. Consider cross-region replication for disaster recovery

---

## Support

For issues:
1. Check AWS documentation
2. Review CloudWatch logs
3. Check browser console for client-side errors
4. Verify all files are uploaded correctly
