# Simple Calorie Tracking

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

### Frontend Setup

1. Navigate to the `/frontend` directory:

```sh
cd frontend
```

2. Install dependencies using pnpm:

```sh
pnpm install
```

3. Start the frontend application:

```sh
pnpm dev
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

### Basic Functionalities

- **User Authentication**: Users can log in, and log out.
- **Food Entry Management**: Users can add, edit, and delete food entries.
- **Calorie Tracking**: Users can track their daily calorie intake.
- **Budget Tracking**: Users can monitor their monthly food budget.
- **Admin Panel**: Admin users can manage all food entries and see statistics.

### Additional Notes

- Ensure Docker and Docker Compose are installed and running on your machine.
- Use `pnpm` for managing dependencies in both the frontend and backend directories.
- Refer to the respective `README.md` files in `/frontend` and `/backend` for more detailed instructions.
