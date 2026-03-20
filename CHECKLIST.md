# Setup Checklist - Follow This Order

Print this page or keep it open while you set up!

## ✅ Pre-Setup Checklist

- [ ] I have a computer with internet connection
- [ ] I can open PowerShell/Command Prompt
- [ ] I have about 30-45 minutes available

---

## 📦 Step 1: Install Git

- [ ] Downloaded Git from https://git-scm.com/download/win
- [ ] Installed Git (clicked through all the Next buttons)
- [ ] Opened a NEW PowerShell window
- [ ] Typed `git --version` and saw a version number
- [ ] ✅ Git is working!

**Time taken**: ___ minutes

---

## 👤 Step 2: Create GitHub Account

- [ ] Went to https://github.com
- [ ] Created an account
- [ ] Verified my email
- [ ] ✅ I can log into GitHub!

**Time taken**: ___ minutes

---

## 📁 Step 3: Prepare Project

- [ ] Opened PowerShell in project folder
- [ ] Ran `git init`
- [ ] Ran `git add .`
- [ ] Ran `git commit -m "Initial commit"`
- [ ] ✅ Project is ready for GitHub!

**Time taken**: ___ minutes

---

## 🗂️ Step 4: Create GitHub Repository

- [ ] Logged into GitHub
- [ ] Clicked "+" → "New repository"
- [ ] Named it `warehouse-label-system`
- [ ] Did NOT check any boxes (README, .gitignore, license)
- [ ] Clicked "Create repository"
- [ ] ✅ Repository created!

**Time taken**: ___ minutes

---

## 🔗 Step 5: Connect to GitHub

- [ ] Created Personal Access Token (GitHub → Settings → Developer settings)
- [ ] Copied the token and saved it safely
- [ ] Ran `git remote add origin https://github.com/MY-USERNAME/warehouse-label-system.git`
- [ ] Ran `git branch -M main`
- [ ] Ran `git push -u origin main`
- [ ] Used token as password when prompted
- [ ] ✅ Code is on GitHub!

**Time taken**: ___ minutes

---

## ☁️ Step 6: Create AWS Account

- [ ] Went to https://aws.amazon.com
- [ ] Created AWS account
- [ ] Verified email and phone
- [ ] ✅ AWS account is ready!

**Time taken**: ___ minutes

---

## 🪣 Step 7: Create S3 Bucket

- [ ] Went to AWS Console → S3
- [ ] Created bucket with unique name
- [ ] Unchecked "Block all public access"
- [ ] Enabled static website hosting
- [ ] Set bucket policy (copied from bucket-policy.json)
- [ ] Saved the website endpoint URL
- [ ] ✅ S3 bucket is ready!

**Time taken**: ___ minutes

---

## 🔑 Step 8: Create AWS Access Keys

- [ ] Went to AWS Console → IAM
- [ ] Created user: `github-actions-deploy`
- [ ] Attached `AmazonS3FullAccess` policy
- [ ] Created access key
- [ ] Saved Access Key ID
- [ ] Saved Secret Access Key
- [ ] ✅ Access keys are ready!

**Time taken**: ___ minutes

---

## 🔐 Step 9: Add GitHub Secrets

- [ ] Went to GitHub repository → Settings → Secrets → Actions
- [ ] Added `AWS_ACCESS_KEY_ID`
- [ ] Added `AWS_SECRET_ACCESS_KEY`
- [ ] Added `AWS_REGION` (e.g., `us-east-1`)
- [ ] Added `AWS_S3_BUCKET` (my bucket name)
- [ ] ✅ All secrets are set!

**Time taken**: ___ minutes

---

## 🧪 Step 10: Test Deployment

- [ ] Made a small change to `index.html`
- [ ] Ran `git add .`
- [ ] Ran `git commit -m "Test deployment"`
- [ ] Ran `git push`
- [ ] Went to GitHub → Actions tab
- [ ] Saw workflow running
- [ ] Saw green checkmark ✅
- [ ] Checked my website - change is there!
- [ ] ✅ Everything works!

**Time taken**: ___ minutes

---

## 🎉 All Done!

**Total time**: ___ minutes

**My GitHub repository**: https://github.com/________/warehouse-label-system

**My website URL**: http://________.s3-website-________.amazonaws.com

**Notes**:
- Personal Access Token saved at: ________________
- AWS Access Key saved at: ________________
- AWS Secret Key saved at: ________________

---

## 📝 Daily Workflow (Remember This!)

1. Make changes to files
2. `git add .`
3. `git commit -m "Description"`
4. `git push`
5. Wait for GitHub Actions to deploy
6. Check website!

---

## 🆘 If Something Goes Wrong

- [ ] Checked GitHub Actions logs (Actions tab → Click workflow → View logs)
- [ ] Verified all secrets are correct
- [ ] Checked AWS bucket permissions
- [ ] Read the error message carefully
- [ ] Checked BEGINNER_GUIDE.md for help

---

**You've got this! 💪**
