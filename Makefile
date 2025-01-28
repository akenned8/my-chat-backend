# Makefile
LOCALSTACK_URL=http://localhost:4566
REGION=us-east-2
STACK_NAME=chat-stack
DOCKER_IMAGE = my-chat-server:latest
AWS_ACCOUNT_ID = 913524913648

.PHONY: start-localstack deploy-local clean-local prod-build-server-container 

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

# Production commands for actual AWS deployment

prod-build-tables:
	aws cloudformation deploy \
		--template-file templates/dynamodb.yaml \
		--stack-name my-chat-tables \
		--region $(REGION)

prod-build-ECR-repo:
	aws ecr create-repository --repository-name my-chat-app/server-containers --region us-east-2

prod-create-ec2-keypair:
	aws ec2 create-key-pair --key-name my-ec2-keypair --query 'KeyMaterial' --output text > my-ec2-keypair.pem
	chmod 400 my-ec2-keypair.pem

prod-build-server-container:
	@echo "==================================================="
	@echo "Step 1: ECR Login"
	aws ecr get-login-password --region us-east-2 \
		| docker login --username AWS \
			--password-stdin $(AWS_ACCOUNT_ID).dkr.ecr.us-east-2.amazonaws.com

	@echo "==================================================="
	@echo "Step 2: Building Docker image"
	docker build -t my-chat-app-backend .

	@echo "==================================================="
	@echo "Step 3: Tagging Docker image"
	docker tag my-chat-app-backend:latest \
		$(AWS_ACCOUNT_ID).dkr.ecr.us-east-2.amazonaws.com/my-chat-app/server-containers:latest

	@echo "==================================================="
	@echo "Step 4: Pushing Docker image to ECR"
	docker push $(AWS_ACCOUNT_ID).dkr.ecr.us-east-2.amazonaws.com/my-chat-app/server-containers:latest

	@echo "==================================================="
	@echo "Done! Your Docker image has been pushed to ECR."


prod-deploy-server:
#rework this!
	aws cloudformation deploy \
	--template-file templates/server.yaml \
	--stack-name my-chat-server \
	--capabilities CAPABILITY_NAMED_IAM \
	--parameter-overrides \
		VpcId=vpc-0617d8aaa4ace3c0f \
		SubnetId1=subnet-047d029f5574a2b19 \
		SubnetId2=subnet-0e881da71a0aebc5a \
		KeyPairName=my-ec2-keypair \
		EcrImageUrl=913524913648.dkr.ecr.us-east-2.amazonaws.com/my-chat-app/server-containers:latest

list-tables:
	aws dynamodb list-tables --region $(REGION)