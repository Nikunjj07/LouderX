# MongoDB Setup Guide

This guide will help you set up MongoDB for the Sydney Events Aggregator project.

## Option 1: Local MongoDB Installation

### Windows

1. **Download MongoDB**
   - Visit [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - Select "Windows" as your platform
   - Download the MSI installer

2. **Install MongoDB**
   - Run the downloaded MSI file
   - Choose "Complete" installation
   - Install as a Windows Service (recommended)
   - Default data directory: `C:\Program Files\MongoDB\Server\{version}\data`

3. **Start MongoDB**
   ```powershell
   # Start MongoDB Service (as Administrator)
   net start MongoDB
   
   # Verify MongoDB is running
   mongo --version
   ```

4. **Test Connection**
   ```powershell
   # Connect to MongoDB shell
   mongo
   
   # Or using mongosh (new shell)
   mongosh
   ```

5. **Update .env File**
   ```
   MONGODB_URI=mongodb://localhost:27017/sydney-events
   ```

### macOS

1. **Install MongoDB using Homebrew**
   ```bash
   # Install Homebrew (if not installed)
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   
   # Tap MongoDB
   brew tap mongodb/brew
   
   # Install MongoDB Community Edition
   brew install mongodb-community
   ```

2. **Start MongoDB**
   ```bash
   # Start MongoDB as a service
   brew services start mongodb-community
   
   # Or run manually
   mongod --config /usr/local/etc/mongod.conf
   ```

3. **Test Connection**
   ```bash
   mongosh
   ```

4. **Update .env File**
   ```
   MONGODB_URI=mongodb://localhost:27017/sydney-events
   ```

### Linux (Ubuntu/Debian)

1. **Install MongoDB**
   ```bash
   # Import public key
   wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
   
   # Create list file
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
   
   # Update package list
   sudo apt-get update
   
   # Install MongoDB
   sudo apt-get install -y mongodb-org
   ```

2. **Start MongoDB**
   ```bash
   # Start MongoDB service
   sudo systemctl start mongod
   
   # Enable MongoDB to start on boot
   sudo systemctl enable mongod
   
   # Check status
   sudo systemctl status mongod
   ```

3. **Test Connection**
   ```bash
   mongosh
   ```

4. **Update .env File**
   ```
   MONGODB_URI=mongodb://localhost:27017/sydney-events
   ```

---

## Option 2: MongoDB Atlas (Cloud) - Recommended for Beginners

MongoDB Atlas is a free cloud-hosted MongoDB service. Perfect for development and production.

### Setup Steps

1. **Create Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Click "Try Free"
   - Sign up with email or Google

2. **Create a Free Cluster**
   - Choose "Free Shared" tier (M0)
   - Select a cloud provider (AWS, Google Cloud, or Azure)
   - Choose a region closest to you
   - Click "Create Cluster"
   - Wait 1-3 minutes for cluster creation

3. **Create Database User**
   - Go to "Database Access" in left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Set username and password (save these!)
   - Select "Read and write to any database"
   - Click "Add User"

4. **Whitelist IP Address**
   - Go to "Network Access" in left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
     - Or add your specific IP for security
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Databases" tab
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Select "Node.js" as driver
   - Copy the connection string
   - It looks like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/`

6. **Update .env File**
   ```
   MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/sydney-events?retryWrites=true&w=majority
   ```
   
   **Important**: 
   - Replace `<username>` with your database username
   - Replace `<password>` with your database password
   - Add `/sydney-events` before the `?` to specify database name

### Example

If your username is `myuser` and password is `mypass123`, your connection string would be:
```
MONGODB_URI=mongodb+srv://myuser:mypass123@cluster0.abcde.mongodb.net/sydney-events?retryWrites=true&w=majority
```

---

## Verify Your Setup

After setting up MongoDB (either local or Atlas), verify it works:

### 1. Create .env File

```bash
# In project root directory
cd d:\web d\projects\Louderx
cp .env.example .env
```

Then edit `.env` and add your `MONGODB_URI`

### 2. Test Database Connection

```bash
# Navigate to backend
cd backend

# Run database test
npm run test:db
```

You should see output like:
```
✅ MongoDB Connected: localhost
✅ All Database Tests Passed!
```

### 3. Seed Sample Data

```bash
# In backend directory
npm run seed
```

You should see:
```
✅ Inserted 6 events
✅ Database seeding completed successfully!
```

---

## Troubleshooting

### Connection Errors

**Error: `ECONNREFUSED`**
- Local MongoDB is not running
- Solution: Start MongoDB service

**Error: `Authentication failed`**
- Wrong username/password in connection string
- Solution: Double-check credentials in .env

**Error: `Network timeout`**
- IP not whitelisted (Atlas)
- Solution: Add your IP in Network Access

**Error: `Cannot find module 'mongoose'`**
- Dependencies not installed
- Solution: Run `npm install` in backend directory

### Common Issues

1. **Port 27017 already in use**
   - Another MongoDB instance is running
   - Solution: Stop other instance or use different port

2. **Database not found**
   - Normal - MongoDB creates database on first write
   - Solution: Run `npm run seed` to create database

3. **Slow connection (Atlas)**
   - Choose region closer to your location
   - Free tier may have some latency

---

## Useful MongoDB Commands

```bash
# Start MongoDB shell
mongosh

# Show all databases
show dbs

# Use sydney-events database
use sydney-events

# Show all collections
show collections

# Count events
db.events.countDocuments()

# Find all events
db.events.find()

# Find active events
db.events.find({ is_active: true })

# Delete all events (careful!)
db.events.deleteMany({})

# Exit shell
exit
```

---

## Database Schema

### Events Collection
```javascript
{
  title: String,
  date: Date,
  location: String,
  description: String,
  image_url: String,
  ticket_url: String,
  source: String,
  is_active: Boolean,
  last_updated: Date,
  event_hash: String (unique)
}
```

### Emails Collection
```javascript
{
  email: String,
  event_id: ObjectId (ref: Event),
  consent: Boolean,
  timestamp: Date,
  ip_address: String,
  user_agent: String
}
```

---

## Next Steps

After MongoDB is set up and tested:

1. ✅ MongoDB is running
2. ✅ Connection string in .env
3. ✅ Database tests pass
4. ✅ Sample data seeded
5. ➡️  Ready for Phase 3: Backend API Development

---

## Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [MongoDB University (Free Courses)](https://university.mongodb.com/)
