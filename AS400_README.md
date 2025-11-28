# AS/400 Object Manager - Complete Integration System

A production-ready full-stack application for connecting to IBM AS/400 (IBM i) systems, extracting object data using WRKOBJ commands, and managing the data through a modern web interface.

## 🏗️ Project Structure

```
.
├── as400-backend/          # Node.js + Express Backend
│   ├── config/            # Database configuration
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API routes
│   ├── services/          # Business logic & AS/400 integration
│   ├── .env              # Environment variables
│   ├── package.json      # Backend dependencies
│   └── server.js         # Main server file
│
└── frontend-window/       # React + Vite Frontend
    ├── src/
    │   ├── services/     # API client
    │   ├── App.jsx       # Main component
    │   ├── App.css       # Styles
    │   └── main.jsx      # Entry point
    ├── index.html        # HTML template
    ├── package.json      # Frontend dependencies
    └── vite.config.js    # Vite configuration
```

## ✨ Features

### Backend Features
- ✅ Connect to IBM AS/400 (IBM i) systems using `node-jt400`
- ✅ Execute `WRKOBJ OBJ(*ALL)` command and create outfile
- ✅ Read and parse QTEMP/OBJLIST data
- ✅ Store object data in MongoDB with full schema
- ✅ Automatic sync scheduler (runs every 24 hours)
- ✅ RESTful API endpoints for all operations
- ✅ Production-ready error handling and logging

### Frontend Features
- ✅ Simple, functional UI (no fancy design as requested)
- ✅ Connect to AS/400 button
- ✅ Fetch Data button
- ✅ Sync to Database button
- ✅ Real-time connection status
- ✅ Data table with search functionality
- ✅ Statistics dashboard
- ✅ Responsive design

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **MongoDB** (v5 or higher) - Running locally or remote
- **npm** or **yarn**
- **Access to IBM AS/400 system** with valid credentials

## 🚀 Installation

### 1. Clone or Navigate to Project Directory

```bash
cd d:\mumbaiHack\404-KILLERS
```

### 2. Install Backend Dependencies

```bash
cd as400-backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend-window
npm install
```

## ⚙️ Configuration

### Backend Configuration

1. Navigate to `as400-backend` folder
2. Edit the `.env` file with your settings:

```env
# IBM AS/400 Connection
AS400_HOST=your_as400_host_ip_or_hostname
AS400_USER=CHETAN137
AS400_PASSWORD=chetan137

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/as400_objects

# Server Configuration
PORT=5000
NODE_ENV=development

# Sync Schedule (cron format: 0 0 * * * = every day at midnight)
SYNC_SCHEDULE=0 0 * * *
```

**Important:** Replace `your_as400_host_ip_or_hostname` with your actual AS/400 host address.

### Database Schema

The system automatically creates the following MongoDB schema:

```javascript
{
  objectName: String,      // Object name from AS/400
  objectType: String,      // Object type (e.g., *FILE, *PGM, *DTAARA)
  library: String,         // Library name
  description: String,     // Object description
  size: Number,           // Object size in bytes
  createDate: Date,       // Creation date
  changeDate: Date,       // Last change date
  lastSyncDate: Date,     // Last sync timestamp
  timestamps: true        // createdAt, updatedAt
}
```

## 🎯 How to Run

### Step 1: Start MongoDB

Ensure MongoDB is running on your system:

```bash
# Windows
mongod

# Or if MongoDB is installed as a service, it should already be running
```

### Step 2: Start Backend Server

```bash
cd as400-backend
npm start

# For development with auto-reload:
npm run dev
```

You should see:
```
==================================================
🚀 AS/400 Backend Server running on port 5000
📍 Environment: development
🌐 API URL: http://localhost:5000
==================================================
✅ MongoDB Connected: localhost
⏰ Starting sync scheduler with schedule: 0 0 * * *
✅ Sync scheduler started
```

### Step 3: Start Frontend Application

Open a new terminal:

```bash
cd frontend-window
npm run dev
```

You should see:
```
  VITE v4.4.5  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

### Step 4: Open Browser

Navigate to: **http://localhost:3000**

## 📡 How to Connect to AS/400

### Using the Frontend UI:

1. **Connect to AS/400**
   - Click the "🔌 Connect to AS/400" button
   - Wait for connection confirmation
   - Status will change to "🟢 Connected"

2. **Fetch Data**
   - Click the "📋 Fetch Data" button
   - System will execute: `WRKOBJ OBJ(*ALL) OUTPUT(*OUTFILE) OUTFILE(QTEMP/OBJLIST)`
   - Data will be displayed in the table

3. **Sync to Database**
   - Click the "💾 Sync to Database" button
   - All fetched objects will be saved to MongoDB
   - Statistics will be updated

### Using API Directly:

```bash
# Connect to AS/400
curl -X POST http://localhost:5000/api/as400/connect

# Fetch objects from AS/400
curl -X POST http://localhost:5000/api/objects/fetch

# Sync to database
curl -X POST http://localhost:5000/api/sync

# Get all objects from database
curl http://localhost:5000/api/objects

# Get statistics
curl http://localhost:5000/api/objects/statistics

# Search objects
curl http://localhost:5000/api/objects/search?q=QSYS
```

## 🔄 Automatic Sync

The system includes an automatic sync scheduler that runs every 24 hours by default.

- **Schedule:** Defined in `.env` as `SYNC_SCHEDULE` (cron format)
- **Default:** `0 0 * * *` (midnight every day)
- **Customize:** Edit the cron expression in `.env`

Example schedules:
```
0 0 * * *     # Every day at midnight
0 */6 * * *   # Every 6 hours
0 12 * * *    # Every day at noon
0 0 * * 0     # Every Sunday at midnight
```

## 📚 API Documentation

### AS/400 Connection Endpoints

#### Connect to AS/400
```
POST /api/as400/connect
Response: { success: true, message: "Connected to AS/400" }
```

#### Get Connection Status
```
GET /api/as400/status
Response: { success: true, connected: true }
```

#### Disconnect from AS/400
```
POST /api/as400/disconnect
Response: { success: true, message: "Disconnected from AS/400" }
```

### Object Management Endpoints

#### Fetch Objects from AS/400
```
POST /api/objects/fetch
Response: { success: true, count: 1234, data: [...] }
```

#### Get All Objects from Database
```
GET /api/objects
Query Params: ?library=QSYS&objectType=*FILE&objectName=CUSTOMER
Response: { success: true, count: 10, data: [...] }
```

#### Get Statistics
```
GET /api/objects/statistics
Response: {
  success: true,
  data: {
    totalObjects: 1234,
    topLibraries: [...],
    objectTypes: [...],
    lastSyncDate: "2025-11-28T00:00:00.000Z"
  }
}
```

#### Search Objects
```
GET /api/objects/search?q=searchTerm
Response: { success: true, count: 5, data: [...] }
```

### Sync Endpoints

#### Manual Sync
```
POST /api/sync
Response: {
  success: true,
  objectCount: 1234,
  message: "Successfully synced 1234 objects"
}
```

#### Get Sync Status
```
GET /api/sync/status
Response: {
  success: true,
  data: {
    isRunning: false,
    isScheduled: true,
    schedule: "0 0 * * *"
  }
}
```

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **node-jt400** - IBM i (AS/400) connectivity
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **node-cron** - Task scheduler
- **dotenv** - Environment configuration
- **cors** - Cross-origin resource sharing

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Axios** - HTTP client
- **Vanilla CSS** - Styling

## 🔒 Security Considerations

For production deployment:

1. **Environment Variables**
   - Never commit `.env` file to version control
   - Use secure credential management
   - Rotate passwords regularly

2. **Network Security**
   - Use HTTPS in production
   - Implement proper firewall rules
   - Restrict AS/400 access to specific IPs

3. **Authentication**
   - Add JWT or session-based auth
   - Implement role-based access control
   - Add rate limiting

4. **Database**
   - Use MongoDB authentication
   - Enable SSL/TLS connections
   - Regular backups

## 🐛 Troubleshooting

### Backend won't start
- Check if MongoDB is running
- Verify `.env` file exists and is configured
- Check if port 5000 is available

### Can't connect to AS/400
- Verify AS/400 host is reachable: `ping your_as400_host`
- Check firewall settings
- Verify credentials are correct
- Ensure AS/400 user has proper permissions

### Frontend can't connect to backend
- Ensure backend is running on port 5000
- Check browser console for CORS errors
- Verify API URL in `frontend-window/src/services/api.js`

### No data appearing
- Check backend logs for errors
- Verify WRKOBJ command executed successfully
- Check MongoDB has data: `db.as400objects.find().limit(5)`

## 📝 Development Notes

### Adding New Fields

To add new fields to the object schema:

1. Update `as400-backend/models/AS400Object.js`
2. Update `as400-backend/services/as400Service.js` (formatObjectData method)
3. Update frontend table in `frontend-window/src/App.jsx`

### Customizing Sync Schedule

Edit `SYNC_SCHEDULE` in `.env`:
```env
SYNC_SCHEDULE=0 */12 * * *  # Every 12 hours
```

## 📄 License

ISC

## 👥 Support

For issues or questions:
1. Check the troubleshooting section
2. Review backend logs
3. Check MongoDB connection
4. Verify AS/400 connectivity

## 🎉 Success Criteria

The system is working correctly when:
- ✅ Backend starts without errors
- ✅ MongoDB connection is established
- ✅ Frontend loads at http://localhost:3000
- ✅ Can connect to AS/400
- ✅ WRKOBJ command executes successfully
- ✅ Objects are displayed in the table
- ✅ Data syncs to MongoDB
- ✅ Statistics are shown
- ✅ Search functionality works
- ✅ Automatic sync scheduler is running

---

**Built with ❤️ for IBM AS/400 Integration**
