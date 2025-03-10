# Backend

## Setup Instructions

### Prerequisites

- Docker
- Docker Compose
- pnpm (https://pnpm.io/installation)

### Backend Setup

1. Navigate to the `/backend` directory:

```sh
cd backend
```

2. Install dependencies using pnpm:

```sh
pnpm install
```

3. Generate Prisma Client:

```sh
pnpm prisma generate
```

4. Start the backend services using Docker Compose:

```sh
docker-compose up
```

### Backend Development

1. Navigate to the `/backend` directory:

```sh
cd backend
```

2. Install dependencies using pnpm:

```sh
pnpm install
```

3. Generate Prisma Client:

```sh
pnpm prisma generate
```

4. Start the backend application:

```sh
pnpm start:dev
```

### Additional Notes

- Ensure Docker and Docker Compose are installed and running on your machine.
- Use `pnpm` for managing dependencies in the backend directory.
