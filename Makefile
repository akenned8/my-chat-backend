# Makefile
LOCALSTACK_URL=http://localhost:4566
REGION=us-east-1
STACK_NAME=chat-stack
DOCKER_IMAGE = my-chat-server:latest

.PHONY: start-localstack deploy-local clean-local

build:
	npm run build

# LocalStack commands
localstack-up:
	docker-compose -f docker-compose.localstack.yml up -d

localstack-down:
	docker-compose -f docker-compose.localstack.yml down

# Server commands
server-build:
	docker-compose -f docker-compose.server.yml build

server-up: server-build
	docker-compose -f docker-compose.server.yml up -d

server-down:
	docker-compose -f docker-compose.server.yml down

deploy-local:
	awslocal cloudformation deploy \
		--template-file templates/dynamodb.yaml \
		--stack-name $(STACK_NAME) \
		--region $(REGION)

clean-local:
	awslocal cloudformation delete-stack --stack-name $(STACK_NAME)

clean-server: server-down

list-tables:
	awslocal dynamodb list-tables --region $(REGION)