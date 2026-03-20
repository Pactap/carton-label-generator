# GitHub Integration & Automated Deployment Setup Guide

This guide will help you connect your project to GitHub and set up automatic deployment to AWS.

## Prerequisites

1. **Git** - Version control system
2. **GitHub Account** - Free account at [github.com](https://github.com)
3. **AWS Account** - With S3 bucket and CloudFront distribution (optional) set up

## Step 1: Install Git

### Windows
1. Download Git from: https://git-scm.com/download/win
2. Run the installer with default settings
3. Restart your terminal/PowerShell after installation

### Verify Installation
```bash
git --version
```

## Step 2: Initialize Git Repository

Open PowerShell in your project directory and run:

```powershell
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Warehouse Label System"
```

## Step 3: Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **"+"** icon in the top right → **"New repository"**
3. Fill in:
   - **Repository name**: `warehouse-label-system` (or your preferred name)
   - **Description**: "Warehouse Carton Label Printing System"
   - **Visibility**: Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
4. Click **"Create repository"**

## Step 4: Connect Local Repository to GitHub

After creating the repository, GitHub will show you commands. Run these in your project directory:

```powershell
# Add GitHub as remote (replace YOUR-USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR-USERNAME/warehouse-label-system.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

You'll be prompted for your GitHub username and password (use a Personal Access Token, not your password).

## Step 5: Create GitHub Personal Access Token

GitHub requires a Personal Access Token instead of password:

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click **"Generate new token (classic)"**
3. Give it a name: `GitHub Actions Deployment`
4. Select scopes:
   - ✅ `repo` (Full control of private repositories)
5. Click **"Generate token"**
6. **Copy the token immediately** (you won't see it again!)
7. Use this token as your password when pushing

## Step 6: Set Up AWS Credentials

You need AWS credentials for GitHub Actions to deploy:

### Option A: Create IAM User (Recommended)

1. Go to AWS Console → IAM → Users
2. Click **"Add users"**
3. Username: `github-actions-deploy`
4. Access type: **Programmatic access**
5. Click **"Next: Permissions"**
6. Attach policies:
   - `AmazonS3FullAccess` (or create custom policy with only needed permissions)
   - `CloudFrontFullAccess` (if using CloudFront)
7. Click through and **"Create user"**
8. **Save the Access Key ID and Secret Access Key** (you'll need these)

### Option B: Use Existing AWS Credentials

If you already have AWS CLI configured, you can use those credentials.

## Step 7: Configure GitHub Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"** and add these secrets:

   | Secret Name | Value | Description |
   |------------|-------|-------------|
   | `AWS_ACCESS_KEY_ID` | Your AWS Access Key | From Step 6 |
   | `AWS_SECRET_ACCESS_KEY` | Your AWS Secret Key | From Step 6 |
   | `AWS_REGION` | `us-east-1` | Your AWS region |
   | `AWS_S3_BUCKET` | `your-bucket-name` | Your S3 bucket name |
   | `AWS_CLOUDFRONT_DISTRIBUTION_ID` | `E1234567890ABC` | CloudFront ID (optional) |

## Step 8: Set Up AWS S3 Bucket (If Not Already Done)

If you haven't created an S3 bucket yet:

1. Go to AWS S3 Console
2. Click **"Create bucket"**
3. Configure:
   - **Bucket name**: Choose a unique name (e.g., `warehouse-label-system-prod`)
   - **Region**: Same as `AWS_REGION` secret
   - **Block Public Access**: Uncheck (for static website hosting)
4. Click **"Create bucket"**
5. Enable static website hosting:
   - Go to bucket → **Properties** → **Static website hosting**
   - Enable it with `index.html` as index document
6. Set bucket policy (see `bucket-policy.json` in project)

## Step 9: Test the Deployment

1. Make a small change to any file (e.g., add a comment)
2. Commit and push:

```powershell
git add .
git commit -m "Test deployment"
git push
```

3. Go to your GitHub repository → **Actions** tab
4. You should see a workflow running
5. Once complete, check your S3 bucket - files should be updated!

## Step 10: Verify Deployment

Visit your S3 website URL:
```
http://YOUR-BUCKET-NAME.s3-website-REGION.amazonaws.com
```

Or if using CloudFront, visit your CloudFront distribution URL.

## Troubleshooting

### Git not found
- Make sure Git is installed and terminal is restarted
- Check PATH environment variable includes Git

### Authentication failed
- Use Personal Access Token, not password
- Make sure token has `repo` scope

### AWS deployment failed
- Check AWS credentials in GitHub Secrets
- Verify S3 bucket name is correct
- Check IAM user has proper permissions
- Review GitHub Actions logs for detailed error messages

### Files not updating
- Check CloudFront cache invalidation (if using CloudFront)
- Clear browser cache
- Check S3 bucket permissions

## Workflow Details

The GitHub Actions workflow (`.github/workflows/deploy.yml`) will:
- ✅ Trigger on every push to `main` or `master` branch
- ✅ Deploy all files to S3 with correct content types
- ✅ Set public read permissions
- ✅ Invalidate CloudFront cache (if configured)
- ✅ Can be manually triggered from Actions tab

## Next Steps

1. **Set up CloudFront** (optional but recommended):
   - Create CloudFront distribution pointing to S3 bucket
   - Add CloudFront Distribution ID to GitHub Secrets
   - Update workflow to invalidate cache

2. **Custom Domain** (optional):
   - Configure Route 53 or use CloudFront custom domain
   - Update DNS records

3. **Branch Protection** (recommended):
   - Go to Settings → Branches
   - Add rule for `main` branch
   - Require pull request reviews before merging

## Support

If you encounter issues:
1. Check GitHub Actions logs in the **Actions** tab
2. Verify all secrets are set correctly
3. Test AWS credentials manually with AWS CLI
4. Review AWS CloudWatch logs for S3/CloudFront errors
