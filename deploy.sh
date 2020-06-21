echo "Start Deploying to AWS Lambda"
aws lambda update-function-code --function-name mfeSearchIndexer --zip fileb://search-indexer.zip --region us-east-1
echo "Done Deploying to AWS Lambda"