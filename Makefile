# Makefile
LOCALSTACK_URL=http://localhost:4566
REGION=us-east-1
STACK_NAME=chat-stack

.PHONY: start-localstack deploy-local clean-local

start-localstack:
	docker-compose up -d

deploy-local:
	awslocal cloudformation deploy \
		--template-file templates/dynamodb.yaml \
		--stack-name $(STACK_NAME) \
		--region $(REGION)

clean-local:
	awslocal cloudformation delete-stack --stack-name $(STACK_NAME)

list-tables:
	awslocal dynamodb list-tables --region $(REGION)