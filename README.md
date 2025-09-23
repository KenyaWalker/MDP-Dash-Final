# 🚀 MDP Performance Dashboard

> **Comprehensive Privacy-Compliant Survey and Analytics Platform for Sam's Club Management Development Program**

## ✨ **System Overview**

A complete MDP evaluation ecosystem featuring:
- **📝 Privacy-compliant survey forms** with role-based questions
- **📊 Real-time analytics dashboard** with 30-second auto-refresh
- **⚙️ Administrative panel** with full data management
- **🔒 Complete privacy protection** - all names display as "First N." format
- **📧 Email notifications** with privacy-formatted content
- **📄 PDF/CSV exports** with privacy compliance

## 🌐 **Live Access Points**

- **📝 Survey Form**: `http://localhost:3001/` (or your deployment URL)
- **📈 Performance Dashboard**: `http://localhost:3001/dashboard.html`
- **⚙️ Admin Panel**: `http://localhost:3001/admin.html`
- **✅ Success Page**: `http://localhost:3001/success.html`
- **🔗 API Endpoint**: `http://localhost:3001/api/survey-responses`

## ✨ Key Features

- ✅ **Privacy-Compliant System**: ALL names displayed as "First N." format across entire application
- ✅ **Real-time Dashboard** with 30-second auto-refresh and interactive analytics
- ✅ **Multi-Role Survey Forms**: Manager, Rotation Partner, Mentor evaluation roles
- ✅ **Function-Specific Questions**: Planning, Digital Merch, Replenishment, Member's Mark
- ✅ **Administrative Control Panel**: Complete data management and export capabilities
- ✅ **CSV/PDF Export**: Privacy-formatted exports with Sam's Club branding
- ✅ **Email Notifications**: Privacy-compliant email alerts and confirmations
- ✅ **Rotation Management**: Smart rotation filtering and progress tracking
- ✅ **Mobile Responsive**: Works seamlessly across all devices
- ✅ **Live Data Updates**: Real-time synchronization between survey and dashboard

## 📁 **Project Structure**

```
mdp-performance-dashboard/
├── app.js                    # Express server with privacy-compliant email system
├── package.json              # Dependencies and scripts
├── data.json                 # Survey data storage (JSON format)
├── .gitignore               # Git ignore configuration
├── README.md                # Project documentation
├── 
├── Frontend Files:
├── index.html               # Survey form with privacy-formatted MDP dropdown
├── dashboard.html           # Analytics dashboard interface  
├── admin.html              # Administrative management panel
├── success.html            # Post-submission confirmation with PDF download
├── 
├── JavaScript Logic:
├── survey.js               # Survey form logic with privacy formatting
├── dashboard-redesign.js   # Dashboard analytics with real-time updates
├── admin.js               # Admin panel functionality with privacy compliance
├── 
└── Assets:
    └── SC_Logo_Symbol_RGB_WHT.png  # Sam's Club logo
```

## 🚀 **Quick Start**

### Prerequisites
- Node.js (version 14.0.0 or higher)
- npm (comes with Node.js)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd mdp-performance-dashboard
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the server**:
   ```bash
   npm start
   ```

4. **Access the application**:
   - Survey Form: `http://localhost:3001/`
   - Dashboard: `http://localhost:3001/dashboard.html`
   - Admin Panel: `http://localhost:3001/admin.html`

### 🌐 **Railway Deployment**

1. **Connect to Railway**:
   - Fork this repository to your GitHub
   - Connect your GitHub repository to Railway
   - Railway will automatically detect and deploy the Node.js application

2. **Environment Configuration**:
   ```bash
   # Railway will automatically set PORT
   # No additional environment variables required for basic operation
   ```

3. **Production URL Access**:
   - Survey: `https://your-app-name.railway.app/`
   - Dashboard: `https://your-app-name.railway.app/dashboard.html`
   - Admin: `https://your-app-name.railway.app/admin.html`

### Usage

#### Taking Surveys
1. Navigate to http://localhost:3001
2. Click "📝 Take Survey"
3. Fill out participant information (MDP name, function, manager)
4. Complete the function-specific evaluation questions
5. Submit the survey

#### Viewing Dashboard
1. Navigate to http://localhost:3001
2. Click "📊 Dashboard" 
3. View real-time analytics including:
   - Total responses and average scores
   - Top performers
   - Detailed performance breakdown by assessment area
   - Filter by MDP, function, or rotation

### API Endpoints

- `GET /api/survey-responses` - Retrieve all survey responses
- `POST /api/survey-responses` - Submit a new survey response
- `DELETE /api/survey-responses/:id` - Delete a survey response

### Function-Specific Questions

The survey includes tailored questions for four functions:
- **Planning**: P&L understanding, retail math, financial tools
- **Digital Merch**: HAVE+FIND+LOVE+BUY framework, SEO, omni experience
- **Replenishment**: Demand forecasting, inventory allocation, system tools
- **Member's Mark**: Brand strategy, creative guidelines, member research

### Assessment Areas

Each response is evaluated across:
- Job Knowledge (50% weight)
- Quality of Work (20% weight)
- Communication Skills & Teamwork (15% weight)
- Initiative & Productivity (15% weight)

## Development

### Adding New Features
- Survey questions: Edit `questionsByFunction` in `survey.js`
- Dashboard metrics: Modify `dashboard.js` analytics functions
- API endpoints: Add routes in `server/index.js`

### Data Storage
Currently uses JSON file storage (`server/data.json`). To upgrade to a database:
1. Replace file operations in `server/index.js`
2. Add database dependency (MongoDB, PostgreSQL, etc.)
3. Update connection and query logic

## Deployment

### Local Development
The app is ready to run locally with the steps above.

### 24/7 Operation
For continuous operation:

1. **Windows Service (Recommended)**:
   ```powershell
   # Install Node.js as Windows Service using node-windows
   npm install -g node-windows
   # Create service script (see server/install-service.js)
   ```

2. **VS Code Task**:
   - Use Ctrl+Shift+P → "Tasks: Run Task" → "Start MDP Dashboard Server"
   - Server runs in background with auto-restart

3. **PowerShell Background**:
   ```powershell
   # Start in background
   cd "server"
   Start-Process powershell -ArgumentList "node index.js" -WindowStyle Hidden
   ```

4. **PM2 Process Manager** (if installed):
   ```bash
   npm install -g pm2
   pm2 start server/index.js --name "mdp-dashboard"
   pm2 startup  # Auto-start on system boot
   pm2 save     # Save current configuration
   ```

### Recent Updates
- **Fixed Communication & Initiative Scoring**: Corrected area name matching for proper score calculation
- **Data Migration**: Existing survey data automatically recalculated with correct scores
- **Real-time Dashboard**: Communication and Initiative metrics now display properly

### Production Deployment
1. Set environment variable: `PORT=80` (or desired port)
2. Use process manager like PM2: `pm2 start server/index.js`
3. Configure reverse proxy (nginx) if needed
4. Ensure proper file permissions for data storage

## Browser Compatibility
- Chrome/Edge: Full support
- Firefox: Full support  
- Safari: Full support
- IE11: Basic support (may need polyfills)

## License
Internal use only - Walmart Inc.
