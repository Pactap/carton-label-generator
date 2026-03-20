# Quick Deployment Reference

## GitHub + AWS Automated Deployment

### Initial Setup (One-Time)

1. **Install Git**: https://git-scm.com/download/win
2. **Initialize Repository**:
   ```powershell
   git init
   git add .
   git commit -m "Initial commit"
   ```
3. **Create GitHub Repo**: Go to github.com → New repository
4. **Connect & Push**:
   ```powershell
   git remote add origin https://github.com/YOUR-USERNAME/warehouse-label-system.git
   git branch -M main
   git push -u origin main
   ```
5. **Set GitHub Secrets** (Settings → Secrets → Actions):
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_REGION` (e.g., `us-east-1`)
   - `AWS_S3_BUCKET` (your bucket name)
   - `AWS_CLOUDFRONT_DISTRIBUTION_ID` (optional)

### Daily Workflow

1. **Make Changes** to your files
2. **Commit**:
   ```powershell
   git add .
   git commit -m "Description of changes"
   git push
   ```
3. **Deployment happens automatically!** 🚀
   - Check progress: GitHub → Actions tab
   - Files deploy to S3 automatically
   - CloudFront cache invalidated (if configured)

### Manual Deployment

If you need to deploy manually without pushing to GitHub:

**Windows (PowerShell):**
```powershell
.\deploy-s3.ps1 -BucketName "your-bucket-name" -Region "us-east-1"
```

**Linux/Mac:**
```bash
./deploy-s3.sh -b your-bucket-name -r us-east-1
```

### Troubleshooting

- **Git not found**: Install Git and restart terminal
- **Push failed**: Use Personal Access Token, not password
- **Deployment failed**: Check GitHub Secrets and AWS permissions
- **Files not updating**: Check CloudFront cache or browser cache

For detailed setup, see [GITHUB_SETUP.md](./GITHUB_SETUP.md)
