#!/bin/bash
# Script to invalidate CloudFront cache after deployment
# Usage: ./cloudfront-invalidate.sh -d DISTRIBUTION-ID

DISTRIBUTION_ID=""

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -d|--distribution-id)
            DISTRIBUTION_ID="$2"
            shift 2
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

if [ -z "$DISTRIBUTION_ID" ]; then
    echo "Error: Distribution ID is required"
    echo "Usage: ./cloudfront-invalidate.sh -d DISTRIBUTION-ID"
    exit 1
fi

echo "Creating CloudFront invalidation for distribution: $DISTRIBUTION_ID"

INVALIDATION_ID=$(aws cloudfront create-invalidation \
    --distribution-id "$DISTRIBUTION_ID" \
    --paths "/*" \
    --query 'Invalidation.Id' \
    --output text)

if [ $? -eq 0 ]; then
    echo "Invalidation created successfully!"
    echo "Invalidation ID: $INVALIDATION_ID"
    echo "This may take 5-15 minutes to complete."
else
    echo "Error: Failed to create invalidation"
    exit 1
fi
