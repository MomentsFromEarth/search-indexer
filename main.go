package main

import (
	"fmt"

	"github.com/aws/aws-lambda-go/lambda"
)

// Request is a struct
type Request struct {
	ID    string `json:"id"`
	Value string `json:"value"`
}

// Response is a struct
type Response struct {
	Message string `json:"message"`
	Ok      bool   `json:"ok"`
}

var qURL = "https://sqs.us-east-1.amazonaws.com/776913033148/search.fifo"

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
