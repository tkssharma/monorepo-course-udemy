# Module 21: Deploy Express API from Monorepo with GitHub Actions

A simple, practical guide to deploying an Express.js API from a pnpm monorepo using GitHub Actions.

---

## � Project Structure

```
monorepo-pnom-deploy-ci-cd-21/
├── apps/
│   └── api/                    # Express.js API
│       ├── src/
│       │   └── index.ts        # Main server file
│       ├── Dockerfile          # Container build
│       ├── package.json
│       └── tsconfig.json
├── packages/
│   └── lib/                    # Shared utilities & types
│       ├── src/
│       │   ├── index.ts        # Re-exports
│       │   ├── utils.ts        # Utility functions
│       │   ├── constants.ts    # App constants
│       │   └── types.ts        # TypeScript interfaces
│       ├── package.json
│       └── tsconfig.json
├── .github/
│   └── workflows/
│       ├── ci.yml              # CI: lint, build, test
│       ├── deploy.yml          # Full deployment workflow
│       └── deploy-simple.yml   # Simple deployment options
├── package.json                # Root workspace config
├── pnpm-workspace.yaml         # Workspace definition
└── README.md
```

---

## 📦 Shared Library (`@packages/lib`)

The `packages/lib` contains shared code used across apps:

### Utils

- `formatDate()` - ISO date formatting
- `formatCurrency()` - Currency formatting
- `slugify()` - URL slug generation
- `generateId()` - Random ID generator
- `capitalize()` - String capitalization

### Constants

- `APP_NAME`, `APP_VERSION`
- `HTTP_STATUS` - HTTP status codes
- `API_ROUTES` - Route paths

### Types

- `User`, `ApiResponse<T>`, `PaginatedResponse<T>`, `HealthCheckResponse`

### Usage in API

```typescript
import { APP_NAME, formatDate, type User } from '@packages/lib';
```

---

## � Quick Start

```bash
# Install dependencies
pnpm install

# Run in development
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

API will be available at `http://localhost:3000`

### Endpoints

| Endpoint         | Description       |
| ---------------- | ----------------- |
| `GET /`          | Welcome message   |
| `GET /health`    | Health check      |
| `GET /api/users` | Sample users data |

---

## � GitHub Actions Workflows

### 1. CI Workflow (`ci.yml`)

Runs on every push and PR to ensure code quality:

```yaml
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
```

**Steps**: Checkout → Setup pnpm → Install → Lint → Build → Test

### 2. Deploy to Lambda (`deploy-lambda.yml`)

Serverless deployment using AWS Lambda + API Gateway:

```yaml
on:
  push:
    branches: [main]
    paths:
      - 'apps/api/**'
      - 'packages/lib/**'
```

**Features**:

- Deploys using Serverless Framework
- Auto-scales with demand
- Pay per request pricing

### 3. Deploy to EC2 (`deploy-ec2.yml`)

Traditional server deployment via SSH:

**Features**:

- Full control over server
- PM2 process management
- Rolling deployments

---

## 🌐 AWS Deployment Options

### Option 1: AWS Lambda (Serverless) - Recommended

Best for: APIs with variable traffic, cost optimization, auto-scaling.

#### Prerequisites

1. AWS Account with IAM user
2. Serverless Framework installed

#### Setup Steps

1. **Create IAM User** with programmatic access:
   - Go to AWS Console → IAM → Users → Add User
   - Attach policies: `AWSLambdaFullAccess`, `AmazonAPIGatewayAdministrator`, `CloudFormationFullAccess`
   - Save Access Key ID and Secret

2. **Add GitHub Secrets**:

   ```
   AWS_ACCESS_KEY_ID     = your-access-key
   AWS_SECRET_ACCESS_KEY = your-secret-key
   ```

3. **Deploy locally first** (to test):

   ```bash
   cd apps/api
   npx serverless deploy --stage dev
   ```

4. **Push to main** to trigger GitHub Actions deployment

#### Lambda Handler

The `apps/api/src/lambda.ts` wraps Express for Lambda:

```typescript
import serverless from 'serverless-http';
import app from './index';

export const handler = serverless(app);
```

#### Test Locally with Serverless Offline

```bash
cd apps/api
npx serverless offline
# API available at http://localhost:3000
```

---

### Option 2: AWS EC2 (Traditional Server)

Best for: Long-running processes, WebSockets, consistent traffic.

#### Prerequisites

1. EC2 instance running (Ubuntu recommended)
2. Node.js 20 + pnpm installed on EC2
3. PM2 installed globally (`npm i -g pm2`)
4. SSH key pair

#### Setup Steps

1. **Launch EC2 Instance**:
   - AMI: Ubuntu 22.04 LTS
   - Instance type: t3.micro (free tier) or t3.small
   - Security group: Allow ports 22 (SSH), 80, 443, 3000

2. **Configure EC2**:

   ```bash
   # SSH into EC2
   ssh -i your-key.pem ubuntu@your-ec2-ip

   # Install Node.js 20
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Install pnpm and PM2
   npm install -g pnpm pm2

   # Create app directory
   mkdir -p /home/ubuntu/api
   ```

3. **Add GitHub Secrets**:

   ```
   AWS_ACCESS_KEY_ID     = your-access-key
   AWS_SECRET_ACCESS_KEY = your-secret-key
   EC2_HOST              = your-ec2-public-ip
   EC2_SSH_KEY           = contents-of-your-private-key.pem
   ```

4. **Push to main** to trigger deployment

#### EC2 Deployment Flow

```
GitHub Actions → Build → Package → SCP to EC2 → SSH commands → PM2 restart
```

---

## 📋 Deployment Checklist

### For Lambda:

- [ ] AWS account created
- [ ] IAM user with Lambda/API Gateway permissions
- [ ] `AWS_ACCESS_KEY_ID` secret added
- [ ] `AWS_SECRET_ACCESS_KEY` secret added
- [ ] Test with `serverless deploy --stage dev`
- [ ] Push to `main` to deploy

### For EC2:

- [ ] EC2 instance launched and configured
- [ ] Node.js 20, pnpm, PM2 installed on EC2
- [ ] Security group allows required ports
- [ ] `EC2_HOST` secret added
- [ ] `EC2_SSH_KEY` secret added
- [ ] Push to `main` to deploy

---

## 🔑 Required GitHub Secrets

| Secret                  | Service | How to Get                         |
| ----------------------- | ------- | ---------------------------------- |
| `AWS_ACCESS_KEY_ID`     | AWS     | IAM → Users → Security credentials |
| `AWS_SECRET_ACCESS_KEY` | AWS     | IAM → Users → Security credentials |
| `EC2_HOST`              | EC2     | EC2 Dashboard → Public IPv4        |
| `EC2_SSH_KEY`           | EC2     | Your .pem file contents            |
| `GITHUB_TOKEN`          | GitHub  | Auto-provided                      |

---

## ⚡ Serverless Configuration

The `apps/api/serverless.yml` configures Lambda deployment:

```yaml
service: monorepo-api

provider:
  name: aws
  runtime: nodejs20.x
  region: us-east-1
  memorySize: 512
  timeout: 30

functions:
  api:
    handler: dist/lambda.handler
    events:
      - httpApi: '*'
```

### Local Development with Serverless

```bash
cd apps/api
pnpm add -D serverless-offline
npx serverless offline
```

---

## 🎯 Key Concepts

### 1. **Selective Deployment**

Only deploy when relevant files change:

```yaml
paths:
  - 'apps/api/**'
```

### 2. **pnpm Filter**

Run commands for specific packages:

```bash
pnpm --filter @apps/api build
```

### 3. **Environment Variables**

```yaml
env:
  NODE_ENV: production
  PORT: 3000
```

---

## 📚 Resources

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [AWS Lambda Docs](https://docs.aws.amazon.com/lambda/)
- [Serverless Framework](https://www.serverless.com/framework/docs)
- [AWS EC2 Docs](https://docs.aws.amazon.com/ec2/)
- [PM2 Process Manager](https://pm2.keymetrics.io/docs/)
- [serverless-http](https://github.com/dougmoscrop/serverless-http)
