# my-chat-backend
A working chat room backend to practice user and session management with Node and DynamoDB

Frontend repo is: [my-chat-app](https://github.com/akenned8/my-chat-app)

## How to run locally

### Prerequisites
- Node installed
- Docker installed
- AWS CLI installed and configured
- [LocalStack](https://www.localstack.cloud/) installed (Free version is sufficient. Allows us to emulate AWS infrastructure on a local container (very cool))

### Setup
1. Install dependencies:
```
npm install
```

2. Create a .env file in the root directory and add the following environment variables:
```
AWS_REGION=us-east-1
DB_URI=http://localhost:4566
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
```

3. Start LocalStack:

```
docker-compose up -d
```

4. Provision all DynamoDB tables in LocalStack via CloudFormation template (templates/dynamodb.yaml)

```
make deploy-local
```

5. Start the application via VSCode debugger or
```
npm run dev
```

6. (optional) Run the frontend [my-chat-app](https://github.com/akenned8/my-chat-app)
