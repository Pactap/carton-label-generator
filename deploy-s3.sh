#!/bin/bash
# Bash script to deploy to AWS S3
# Usage: ./deploy-s3.sh -b your-bucket-name -r us-east-1

BUCKET_NAME=""
REGION="us-east-1"
CREATE_BUCKET=false
ENABLE_WEBSITE=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -b|--bucket)
            BUCKET_NAME="$2"
            shift 2
            ;;
        -r|--region)
            REGION="$2"
            shift 2
            ;;
        -c|--create-bucket)
            CREATE_BUCKET=true
            shift
            ;;
        -w|--enable-website)
            ENABLE_WEBSITE=true
            shift
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

if [ -z "$BUCKET_NAME" ]; then
    echo "Error: Bucket name is required"
    echo "Usage: ./deploy-s3.sh -b your-bucket-name [-r region] [-c] [-w]"
    exit 1
fi

echo "Starting deployment to S3..."

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "Error: AWS CLI is not installed"
    echo "Please install AWS CLI from: https://aws.amazon.com/cli/"
    exit 1
fi

echo "AWS CLI found: $(aws --version)"

# Check if bucket exists
if aws s3 ls "s3://$BUCKET_NAME" 2>&1 | grep -q 'NoSuchBucket'; then
    if [ "$CREATE_BUCKET" = true ]; then
        echo "Creating bucket: $BUCKET_NAME in region: $REGION"
        aws s3 mb "s3://$BUCKET_NAME" --region "$REGION"
        if [ $? -ne 0 ]; then
            echo "Error: Failed to create bucket"
            exit 1
        fi
        echo "Bucket created successfully"
    else
        echo "Error: Bucket '$BUCKET_NAME' does not exist"
        echo "Use -c or --create-bucket to create it automatically"
        exit 1
    fi
else
    echo "Bucket exists: $BUCKET_NAME"
fi

# Enable static website hosting if requested
if [ "$ENABLE_WEBSITE" = true ]; then
    echo "Enabling static website hosting..."
    aws s3 website "s3://$BUCKET_NAME" \
        --index-document "index.html" \
        --error-document "index.html"
    echo "Static website hosting enabled"
fi

# Upload files with correct content types
echo "Uploading files to S3..."

echo "Uploading: index.html"
aws s3 cp "index.html" "s3://$BUCKET_NAME/index.html" --content-type "text/html"

echo "Uploading: app.js"
aws s3 cp "app.js" "s3://$BUCKET_NAME/app.js" --content-type "application/javascript"

echo "Uploading: barcode.js"
aws s3 cp "barcode.js" "s3://$BUCKET_NAME/barcode.js" --content-type "application/javascript"

echo "Uploading: label.js"
aws s3 cp "label.js" "s3://$BUCKET_NAME/label.js" --content-type "application/javascript"

echo "Uploading: styles.css"
aws s3 cp "styles.css" "s3://$BUCKET_NAME/styles.css" --content-type "text/css"

# Make files public
echo "Setting public read permissions..."
aws s3api put-object-acl --bucket "$BUCKET_NAME" --key "index.html" --acl public-read
aws s3api put-object-acl --bucket "$BUCKET_NAME" --key "app.js" --acl public-read
aws s3api put-object-acl --bucket "$BUCKET_NAME" --key "barcode.js" --acl public-read
aws s3api put-object-acl --bucket "$BUCKET_NAME" --key "label.js" --acl public-read
aws s3api put-object-acl --bucket "$BUCKET_NAME" --key "styles.css" --acl public-read

echo ""
echo "Deployment completed successfully!"
echo "Website URL: http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com"
echo ""
echo "Note: Make sure your bucket policy allows public read access."
