# Database Setup Guide

## Self-Hosted PostgreSQL Database

### Step 1: Start the Database

```bash
# Start the PostgreSQL database
docker-compose up -d postgres

# Check if the database is running
docker-compose ps
```

### Step 2: Create Environment File

Create a `.env` file in your project root with:

```
DATABASE_URL="postgresql://postgres:your_secure_password_here@localhost:5432/ai_data_repository?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-key-here"
NODE_ENV="development"
```

**Important:** Replace `your_secure_password_here` with a strong password in both the `.env` file and `docker-compose.yml`.

### Step 3: Generate Prisma Client and Push Schema

```bash
# Generate Prisma client
pnpm prisma generate

# Push the schema to create tables
pnpm prisma db push
```

### Step 4: Verify Connection

```bash
# Test the database connection
pnpm prisma db pull
```

### Step 5: Optional - Database Management

If you want to manage your database with a GUI:

```bash
# Start pgAdmin (optional)
docker-compose up -d pgadmin
```

Then visit http://localhost:8080 and login with:

- Email: admin@example.com
- Password: admin_password

### For Production Deployment

1. **Change the password** in `docker-compose.yml` to a strong, unique password
2. **Update the DATABASE_URL** in your production `.env` file
3. **Use environment variables** for sensitive data in production
4. **Set up proper backup** strategies for your PostgreSQL data

### Database Management Commands

```bash
# Stop the database
docker-compose down

# Stop and remove all data (WARNING: This deletes all data)
docker-compose down -v

# View database logs
docker-compose logs postgres

# Access database directly
docker-compose exec postgres psql -U postgres -d ai_data_repository
```

### Backup and Restore

```bash
# Backup database
docker-compose exec postgres pg_dump -U postgres ai_data_repository > backup.sql

# Restore database
docker-compose exec -T postgres psql -U postgres ai_data_repository < backup.sql
```
