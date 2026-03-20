# Complete Beginner's Guide - Step by Step

This guide will walk you through everything from scratch. Don't worry if you're new to this - we'll explain each step!

## 📋 What We're Going to Do

1. Install Git (version control software)
2. Create a GitHub account (if you don't have one)
3. Put your code on GitHub
4. Set up automatic deployment to AWS
5. Test that everything works

**Time needed**: About 30-45 minutes

---

## Step 1: Install Git

### What is Git?
Git is a tool that helps you track changes to your code and share it with others.

### How to Install:

1. **Open your web browser**
2. **Go to**: https://git-scm.com/download/win
3. **Click the big download button** (it will download automatically)
4. **Find the downloaded file** (usually in your Downloads folder, named something like `Git-2.xx.x-64-bit.exe`)
5. **Double-click the file** to start installation
6. **Click "Next"** on all the screens (the default options are fine)
7. **Click "Install"** when you get to the install screen
8. **Wait for it to finish** (a few minutes)
9. **Click "Finish"**

### Verify It Worked:

1. **Close any open PowerShell or Command Prompt windows**
2. **Open a NEW PowerShell window**:
   - Press `Windows Key + X`
   - Click "Windows PowerShell" or "Terminal"
3. **Type this command** and press Enter:
   ```powershell
   git --version
   ```
4. **You should see something like**: `git version 2.xx.x`
   - ✅ If you see a version number, Git is installed!
   - ❌ If you see an error, try restarting your computer and try again

**🎉 Great! Step 1 is complete!**

---

## Step 2: Create a GitHub Account

### What is GitHub?
GitHub is like a cloud storage for your code. It also helps automate deployments.

### How to Create an Account:

1. **Open your web browser**
2. **Go to**: https://github.com
3. **Click the "Sign up" button** (top right corner)
4. **Fill in the form**:
   - **Username**: Choose something unique (e.g., `yourname-warehouse`)
   - **Email**: Your email address
   - **Password**: Create a strong password
5. **Click "Create account"**
6. **Verify your email** (check your email inbox and click the verification link)
7. **Complete any additional setup** (you can skip most of it)

**🎉 Great! Step 2 is complete!**

---

## Step 3: Prepare Your Project for GitHub

### What We're Doing:
We're going to tell Git to track your project files and prepare them to be uploaded to GitHub.

### How to Do It:

1. **Open PowerShell** in your project folder:
   - Press `Windows Key + R`
   - Type: `powershell`
   - Press Enter
   - Type: `cd C:\Users\Admin\my-project\warehouse-label-system`
   - Press Enter

2. **Initialize Git** (this tells Git to start tracking this folder):
   ```powershell
   git init
   ```
   - You should see: `Initialized empty Git repository...`

3. **Add all your files**:
   ```powershell
   git add .
   ```
   - The `.` means "all files in this folder"
   - You won't see any output - that's normal!

4. **Create your first "commit"** (this saves a snapshot of your files):
   ```powershell
   git commit -m "Initial commit: Warehouse Label System"
   ```
   - You might see a message about configuring your name and email first
   - If you do, follow the instructions below

### If Git Asks for Your Name and Email:

Run these commands (replace with YOUR information):

```powershell
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

Then try the commit command again:
```powershell
git commit -m "Initial commit: Warehouse Label System"
```

**🎉 Great! Step 3 is complete!**

---

## Step 4: Create a GitHub Repository

### What is a Repository?
A repository (or "repo") is like a folder on GitHub where your code lives.

### How to Create One:

1. **Go to**: https://github.com
2. **Make sure you're logged in** (check top right corner)
3. **Click the "+" icon** in the top right corner
4. **Click "New repository"**

5. **Fill in the form**:
   - **Repository name**: `warehouse-label-system`
   - **Description**: `Warehouse Carton Label Printing System` (optional)
   - **Visibility**: 
     - Choose **Public** (anyone can see it) OR
     - Choose **Private** (only you can see it)
   - **IMPORTANT**: 
     - ❌ **DO NOT** check "Add a README file"
     - ❌ **DO NOT** check "Add .gitignore"
     - ❌ **DO NOT** check "Choose a license"
     - (We already have these files!)
   - **Click "Create repository"** (green button at bottom)

6. **You'll see a page with instructions** - **DON'T follow them yet!** We'll do it differently.

**🎉 Great! Step 4 is complete!**

---

## Step 5: Connect Your Local Project to GitHub

### What We're Doing:
We're linking your local project folder to the GitHub repository you just created.

### How to Do It:

1. **Go back to PowerShell** (in your project folder)

2. **Add GitHub as a remote** (replace `YOUR-USERNAME` with your actual GitHub username):
   ```powershell
   git remote add origin https://github.com/YOUR-USERNAME/warehouse-label-system.git
   ```
   - Example: If your username is `johnsmith`, it would be:
   ```powershell
   git remote add origin https://github.com/johnsmith/warehouse-label-system.git
   ```

3. **Rename your branch to "main"**:
   ```powershell
   git branch -M main
   ```

4. **Push your code to GitHub**:
   ```powershell
   git push -u origin main
   ```

5. **You'll be asked for credentials**:
   - **Username**: Your GitHub username
   - **Password**: You need a "Personal Access Token" (see Step 6 below)

**🎉 Great! Step 5 is almost complete!** (You need Step 6 first)

---

## Step 6: Create a GitHub Personal Access Token

### Why Do We Need This?
GitHub doesn't let you use your password anymore. You need a special token instead.

### How to Create One:

1. **Go to GitHub** and make sure you're logged in

2. **Click your profile picture** (top right corner)
3. **Click "Settings"**

4. **Scroll down** on the left sidebar
5. **Click "Developer settings"** (at the very bottom)

6. **Click "Personal access tokens"**
7. **Click "Tokens (classic)"**

8. **Click "Generate new token"**
9. **Click "Generate new token (classic)"**

10. **Fill in the form**:
    - **Note**: `GitHub Actions Deployment` (or any name you like)
    - **Expiration**: Choose how long it should last (90 days is good)
    - **Select scopes**: Check the box for **`repo`** (this gives full access to repositories)
    - Scroll down and **click "Generate token"** (green button)

11. **IMPORTANT**: **Copy the token immediately!**
    - You'll see a long string of letters and numbers
    - **Copy it** (Ctrl+C)
    - **Save it somewhere safe** (like a text file)
    - ⚠️ **You won't be able to see it again!**

12. **Go back to PowerShell** and try the push command again:
    ```powershell
    git push -u origin main
    ```
    - **Username**: Your GitHub username
    - **Password**: **Paste the token you just copied** (not your GitHub password!)

13. **You should see it uploading files!**
    - Wait for it to finish
    - You should see: `Writing objects: 100%`

**🎉 Great! Step 6 is complete!**

---

## Step 7: Verify Your Code is on GitHub

### How to Check:

1. **Go to**: https://github.com/YOUR-USERNAME/warehouse-label-system
   - Replace `YOUR-USERNAME` with your actual username

2. **You should see all your files!**
   - `index.html`
   - `app.js`
   - `styles.css`
   - etc.

**🎉 Great! Step 7 is complete!**

---

## Step 8: Set Up AWS Account (If You Don't Have One)

### What is AWS?
Amazon Web Services (AWS) is where we'll host your website.

### How to Create an Account:

1. **Go to**: https://aws.amazon.com
2. **Click "Create an AWS Account"** (top right)
3. **Fill in the form**:
   - Email address
   - Password
   - Account name
4. **Follow the steps**:
   - Enter payment information (you'll need a credit card, but we'll stay in free tier)
   - Verify your phone number
   - Choose a support plan (Basic/Free is fine)
5. **Wait for account activation** (can take a few minutes)

**🎉 Great! Step 8 is complete!**

---

## Step 9: Create an S3 Bucket

### What is S3?
S3 is like a storage bucket where we'll put your website files.

### How to Create One:

1. **Go to AWS Console**: https://console.aws.amazon.com
2. **Make sure you're in the right region** (top right, choose something like "US East (N. Virginia)")
3. **Search for "S3"** in the search bar at the top
4. **Click "S3"** in the results

5. **Click "Create bucket"** (orange button)

6. **Fill in the form**:
   - **Bucket name**: Choose something unique (e.g., `warehouse-label-system-yourname`)
     - ⚠️ Must be globally unique (try adding your name or numbers)
     - ⚠️ No capital letters, no spaces
     - Example: `warehouse-label-john-2024`
   - **AWS Region**: Choose the same region you selected earlier (e.g., `us-east-1`)
   - **Object Ownership**: Leave as default
   - **Block Public Access**: 
     - ⚠️ **UNCHECK** "Block all public access" (we need it public for website)
     - Check the box that says "I acknowledge..."
   - **Bucket Versioning**: Leave disabled (or enable if you want)
   - **Default encryption**: Leave as default
   - **Click "Create bucket"** (bottom)

7. **Enable Static Website Hosting**:
   - Click on your bucket name (in the list)
   - Click the **"Properties"** tab (at the top)
   - Scroll down to **"Static website hosting"**
   - Click **"Edit"**
   - Select **"Enable"**
   - **Index document**: `index.html`
   - **Error document**: `index.html`
   - Click **"Save changes"**
   - **Copy the "Bucket website endpoint" URL** (save it somewhere!)

8. **Set Bucket Policy** (make it public):
   - Click the **"Permissions"** tab
   - Scroll to **"Bucket policy"**
   - Click **"Edit"**
   - **Copy this policy** (replace `YOUR-BUCKET-NAME` with your actual bucket name):
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
   - **Paste it** into the policy editor
   - **Replace** `YOUR-BUCKET-NAME` with your actual bucket name
   - Click **"Save changes"**

**🎉 Great! Step 9 is complete!**

---

## Step 10: Create AWS Access Keys

### What Are Access Keys?
These are like a username and password that GitHub will use to upload files to AWS.

### How to Create Them:

1. **In AWS Console**, search for **"IAM"** (Identity and Access Management)
2. **Click "IAM"** in the results

3. **Click "Users"** (left sidebar)
4. **Click "Create user"** (blue button)

5. **Fill in**:
   - **User name**: `github-actions-deploy`
   - **Click "Next"**

6. **Set Permissions**:
   - Click **"Attach policies directly"**
   - **Search for**: `S3`
   - **Check the box** for **"AmazonS3FullAccess"**
   - **Search for**: `CloudFront` (optional, but recommended)
   - **Check the box** for **"CloudFrontFullAccess"** (if you plan to use CloudFront)
   - **Click "Next"**

7. **Review and Create**:
   - Click **"Create user"**

8. **Get Your Access Keys**:
   - Click on the user you just created (`github-actions-deploy`)
   - Click the **"Security credentials"** tab
   - Scroll to **"Access keys"**
   - Click **"Create access key"**
   - Select **"Application running outside AWS"**
   - Click **"Next"**
   - Click **"Create access key"**
   - **IMPORTANT**: 
     - **Copy the "Access key ID"** (save it!)
     - **Copy the "Secret access key"** (save it! You won't see it again!)
     - Click **"Done"**

**🎉 Great! Step 10 is complete!**

---

## Step 11: Add Secrets to GitHub

### What Are Secrets?
These are secure storage for your AWS credentials that GitHub Actions will use.

### How to Add Them:

1. **Go to your GitHub repository**: https://github.com/YOUR-USERNAME/warehouse-label-system

2. **Click "Settings"** (top menu bar)

3. **Click "Secrets and variables"** (left sidebar)
4. **Click "Actions"**

5. **Click "New repository secret"** (green button)

6. **Add each secret one by one**:

   **Secret 1: AWS_ACCESS_KEY_ID**
   - **Name**: `AWS_ACCESS_KEY_ID`
   - **Secret**: Paste your Access Key ID from Step 10
   - Click **"Add secret"**

   **Secret 2: AWS_SECRET_ACCESS_KEY**
   - **Name**: `AWS_SECRET_ACCESS_KEY`
   - **Secret**: Paste your Secret Access Key from Step 10
   - Click **"Add secret"**

   **Secret 3: AWS_REGION**
   - **Name**: `AWS_REGION`
   - **Secret**: `us-east-1` (or whatever region you chose)
   - Click **"Add secret"**

   **Secret 4: AWS_S3_BUCKET**
   - **Name**: `AWS_S3_BUCKET`
   - **Secret**: Your bucket name (e.g., `warehouse-label-john-2024`)
   - Click **"Add secret"**

   **Secret 5: AWS_CLOUDFRONT_DISTRIBUTION_ID** (Optional - skip if you don't have CloudFront)
   - **Name**: `AWS_CLOUDFRONT_DISTRIBUTION_ID`
   - **Secret**: Leave empty or add later if you set up CloudFront
   - Click **"Add secret"**

**🎉 Great! Step 11 is complete!**

---

## Step 12: Test Automatic Deployment

### What We're Doing:
We're going to make a small change and see if it automatically deploys to AWS!

### How to Test:

1. **Make a small change** to your code:
   - Open `index.html` in a text editor
   - Find the `<h1>` tag (around line 13)
   - Change it slightly, like:
   ```html
   <h1>Warehouse Carton Label Printing System - Updated!</h1>
   ```
   - Save the file

2. **Go to PowerShell** (in your project folder)

3. **Add the change**:
   ```powershell
   git add .
   ```

4. **Commit the change**:
   ```powershell
   git commit -m "Test automatic deployment"
   ```

5. **Push to GitHub**:
   ```powershell
   git push
   ```
   - Use your GitHub username
   - Use your Personal Access Token as password

6. **Check GitHub Actions**:
   - Go to your GitHub repository
   - Click the **"Actions"** tab (top menu)
   - You should see a workflow running!
   - Wait for it to complete (you'll see a green checkmark ✅)

7. **Check Your Website**:
   - Go to your S3 bucket website URL (from Step 9)
   - You should see your change!

**🎉 Great! Step 12 is complete!**

---

## 🎉 Congratulations!

You've successfully set up:
- ✅ Git version control
- ✅ GitHub repository
- ✅ Automatic deployment to AWS
- ✅ Your website is live!

---

## 📝 Daily Workflow (From Now On)

Whenever you want to update your website:

1. **Make changes** to your files
2. **Open PowerShell** in your project folder
3. **Run these commands**:
   ```powershell
   git add .
   git commit -m "Description of your changes"
   git push
   ```
4. **Wait a minute** for GitHub Actions to deploy
5. **Check your website** - it's updated!

---

## 🆘 Troubleshooting

### Git Not Found
- Make sure Git is installed
- Restart your computer
- Try opening a new PowerShell window

### Can't Push to GitHub
- Make sure you're using Personal Access Token, not password
- Check your GitHub username is correct
- Try creating a new token

### Deployment Failed
- Check GitHub Secrets are all set correctly
- Check AWS bucket name is correct
- Check AWS credentials are correct
- Look at GitHub Actions logs for error messages

### Website Not Loading
- Check bucket policy allows public access
- Check static website hosting is enabled
- Make sure you're using the website endpoint URL, not the bucket URL

---

## 📚 Need More Help?

- Check the other guides in this folder
- Look at GitHub Actions logs (Actions tab → Click on workflow → View logs)
- Check AWS CloudWatch logs

**You did it! 🎉**
