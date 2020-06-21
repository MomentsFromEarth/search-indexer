package main

import (
	"fmt"
	"os"

	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws/session"
)

var qURL = "https://sqs.us-east-1.amazonaws.com/776913033148/search.fifo"
var awsSession *session.Session

// Handler is entrypoint
func Handler(request Request) (Response, error) {

	fmt.Println("SearchIndexer Start")

	return Response{
		Message: fmt.Sprintf("SearchIndexer Complete"),
		Ok:      true,
	}, nil
}

func main() {
	lambda.Start(Handler)
}

func check(err error, msg string) {
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}
