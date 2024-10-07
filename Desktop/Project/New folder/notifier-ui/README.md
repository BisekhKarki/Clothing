This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, install the dependencies:

```bash
npm install
```

copy `.env.example` to `.env` and update the environment variables.

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment Guide

- Apply notifier-ui-tf terraform to deploy ec2 instance.

- SSH into EC2 instance.

- Clone the notifier-ui repository.

```shell
git clone https://github.com/meroDera/notifier-ui.git
```

- Install dependencies.

```shell
cd notifier-ui

chmod +x scripts/install.sh

./scripts/install.sh

git restore scripts/install.sh
```

Update `AWS_EC2_HOST` github secret with the EC2 instance public DNS.

Rerun the deployment pipeline.

### Happy Coding! 🚀
