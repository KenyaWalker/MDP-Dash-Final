const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Email functionality - nodemailer will be required when emails are enabled
let nodemailer = null;
try {
    nodemailer = require('nodemailer');
    console.log('✅ Email functionality enabled (nodemailer loaded)');
} catch (error) {
    console.log('⚠️ Email functionality disabled (nodemailer not installed)');
    console.log('   Run: npm install nodemailer');
    console.log('   Then restart server to enable email notifications');
}

const app = express();
const PORT = process.env.PORT || 3001;

// Railway-specific configuration
if (process.env.RAILWAY_ENVIRONMENT) {
    console.log('🚂 Running on Railway platform');
}

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from current directory for deployment
app.use(express.static(__dirname));
console.log('✅ Serving static files from root directory');

// Simple JSON file storage - use /tmp for persistence on Railway
const dataFile = process.env.RAILWAY_VOLUME_MOUNT_PATH 
    ? path.join(process.env.RAILWAY_VOLUME_MOUNT_PATH, 'data.json')
    : path.join('/tmp', 'data.json');

// Initialize data file if it doesn't exist - copy from source if available
if (!fs.existsSync(dataFile)) {
    const sourceDataFile = path.join(__dirname, 'data.json');
    if (fs.existsSync(sourceDataFile)) {
        // Copy the uploaded data.json to the persistent location
        const sourceData = fs.readFileSync(sourceDataFile, 'utf8');
        fs.writeFileSync(dataFile, sourceData);
        console.log('✅ Initialized data from uploaded data.json file');
    } else {
        // Fallback to empty array if no source file
        fs.writeFileSync(dataFile, JSON.stringify([]));
        console.log('⚠️ No source data found, initialized empty database');
    }
}

// Helper function to format names for privacy
const formatNameForPrivacy = (fullName) => {
    if (!fullName || fullName === 'Anonymous' || fullName === 'N/A') {
        return fullName;
    }
    
    const nameParts = fullName.trim().split(' ');
    if (nameParts.length === 1) {
        return nameParts[0]; // Just first name if only one name provided
    }
    
    const firstName = nameParts[0];
    const lastNameInitial = nameParts[nameParts.length - 1].charAt(0).toUpperCase();
    return `${firstName} ${lastNameInitial}.`;
};

// Helper function to read data
const readData = () => {
    try {
        const data = fs.readFileSync(dataFile, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading data:', error);
        return [];
    }
};

// Helper function to write data
const writeData = (data) => {
    try {
        fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing data:', error);
        return false;
    }
};

// Calculate weighted scores based on assessment areas
const calculateScores = (responses) => {
    // Assessment area mappings based on question content
    const assessmentAreas = {
        jobKnowledge: [1, 2, 3, 4, 5],      // Questions 1-5: Job Knowledge (50% weight)
        qualityOfWork: [6, 7],              // Questions 6-7: Quality of Work (20% weight)
        communication: [8, 9],              // Questions 8-9: Communication & Teamwork (15% weight)
        initiative: [10]                    // Question 10: Initiative & Productivity (15% weight)
    };

    // Calculate average for each assessment area
    const jobKnowledge = assessmentAreas.jobKnowledge.reduce((sum, q) => sum + (responses[`Q${q}`] || 0), 0) / assessmentAreas.jobKnowledge.length;
    const qualityOfWork = assessmentAreas.qualityOfWork.reduce((sum, q) => sum + (responses[`Q${q}`] || 0), 0) / assessmentAreas.qualityOfWork.length;
    const communication = assessmentAreas.communication.reduce((sum, q) => sum + (responses[`Q${q}`] || 0), 0) / assessmentAreas.communication.length;
    const initiative = assessmentAreas.initiative.reduce((sum, q) => sum + (responses[`Q${q}`] || 0), 0) / assessmentAreas.initiative.length;

    // Apply weights: Job Knowledge (50%), Quality (20%), Communication (15%), Initiative (15%)
    const overall = (jobKnowledge * 0.5) + (qualityOfWork * 0.2) + (communication * 0.15) + (initiative * 0.15);

    return {
        jobKnowledge: Math.round(jobKnowledge * 100) / 100,
        qualityOfWork: Math.round(qualityOfWork * 100) / 100,
        communication: Math.round(communication * 100) / 100,
        initiative: Math.round(initiative * 100) / 100,
        overall: Math.round(overall * 100) / 100
    };
};

// Email notification function
const sendProgramManagerNotification = async (surveyData) => {
    if (!nodemailer) {
        console.log('📧 Email notification skipped - nodemailer not available');
        return false;
    }

    try {
        // Load email configuration from environment variables
        const emailConfig = {
            service: process.env.EMAIL_SERVICE || 'outlook',
            host: process.env.EMAIL_HOST || 'smtp.office365.com',
            port: parseInt(process.env.EMAIL_PORT) || 587,
            secure: process.env.EMAIL_SECURE === 'true' || false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        };

        // Skip email if credentials not configured
        if (!emailConfig.auth.user || !emailConfig.auth.pass) {
            console.log('📧 Email notification skipped - credentials not configured');
            return false;
        }

        const transporter = nodemailer.createTransport(emailConfig);

        const emailTemplate = {
            from: emailConfig.auth.user,
            to: process.env.PROGRAM_MANAGER_EMAIL || 'raley.oneill@samsclub.com',
            subject: `📊 New MDP Performance Evaluation - ${formatNameForPrivacy(surveyData.mdpName)}`,
            html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <div style="background-color: #004c91; color: white; padding: 20px; text-align: center;">
        <h1>📊 New MDP Performance Evaluation</h1>
        <p>Management Development Program - Performance Dashboard</p>
    </div>
    
    <div style="padding: 20px; background-color: #f8f9fa;">
        <h2>📋 Evaluation Details</h2>
        <table style="width: 100%; border-collapse: collapse;">
            <tr style="background-color: white;">
                <td style="padding: 10px; border: 1px solid #dee2e6; font-weight: bold;">MDP Participant:</td>
                <td style="padding: 10px; border: 1px solid #dee2e6;">${formatNameForPrivacy(surveyData.mdpName)}</td>
            </tr>
            <tr style="background-color: #f8f9fa;">
                <td style="padding: 10px; border: 1px solid #dee2e6; font-weight: bold;">Function:</td>
                <td style="padding: 10px; border: 1px solid #dee2e6;">${surveyData.functionName}</td>
            </tr>
            <tr style="background-color: white;">
                <td style="padding: 10px; border: 1px solid #dee2e6; font-weight: bold;">Manager:</td>
                <td style="padding: 10px; border: 1px solid #dee2e6;">${formatNameForPrivacy(surveyData.manager)}</td>
            </tr>
            <tr style="background-color: #f8f9fa;">
                <td style="padding: 10px; border: 1px solid #dee2e6; font-weight: bold;">Rotation:</td>
                <td style="padding: 10px; border: 1px solid #dee2e6;">Rotation ${surveyData.rotation}</td>
            </tr>
            <tr style="background-color: white;">
                <td style="padding: 10px; border: 1px solid #dee2e6; font-weight: bold;">Overall Score:</td>
                <td style="padding: 10px; border: 1px solid #dee2e6; font-weight: bold; color: #004c91;">${surveyData.overall}/5.0</td>
            </tr>
        </table>
    </div>

    <div style="padding: 20px;">
        <h3>📊 Assessment Area Breakdown</h3>
        <div style="background-color: #e3f2fd; padding: 15px; border-radius: 5px;">
            <p><strong>Job Knowledge:</strong> ${surveyData.jobKnowledge}/5.0 (50% weight)</p>
            <p><strong>Quality of Work:</strong> ${surveyData.qualityOfWork}/5.0 (20% weight)</p>
            <p><strong>Communication & Teamwork:</strong> ${surveyData.communication}/5.0 (15% weight)</p>
            <p><strong>Initiative & Productivity:</strong> ${surveyData.initiative}/5.0 (15% weight)</p>
        </div>
    </div>

    <div style="text-align: center; padding: 20px;">
        <a href="${process.env.DASHBOARD_URL || 'https://your-dashboard-url.com'}/dashboard.html" 
           style="background-color: #004c91; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
           📈 View Full Dashboard
        </a>
    </div>
    
    <div style="background-color: #6c757d; color: white; padding: 15px; text-align: center; font-size: 12px;">
        <p>MDP Performance Dashboard - Sam's Club Management Development Program</p>
        <p>Submitted: ${new Date(surveyData.submittedAt).toLocaleString()}</p>
    </div>
</div>`,
            text: `
📊 NEW MDP PERFORMANCE EVALUATION

Participant: ${formatNameForPrivacy(surveyData.mdpName)}
Function: ${surveyData.functionName}
Manager: ${formatNameForPrivacy(surveyData.manager)}
Rotation: ${surveyData.rotation}
Overall Score: ${surveyData.overall}/5.0

Assessment Breakdown:
• Job Knowledge: ${surveyData.jobKnowledge}/5.0 (50% weight)
• Quality of Work: ${surveyData.qualityOfWork}/5.0 (20% weight)
• Communication & Teamwork: ${surveyData.communication}/5.0 (15% weight)
• Initiative & Productivity: ${surveyData.initiative}/5.0 (15% weight)

View the full dashboard: ${process.env.DASHBOARD_URL || 'https://your-dashboard-url.com'}/dashboard.html

---
MDP Performance Dashboard
Sam's Club Management Development Program
Submitted: ${new Date(surveyData.submittedAt).toLocaleString()}
`
        };

        await transporter.sendMail(emailTemplate);
        console.log('✅ Program manager notification sent successfully');
        return true;

    } catch (error) {
        console.error('❌ Failed to send email notification:', error.message);
        return false;
    }
};

// Send copy to user who submitted the survey
const sendUserCopyEmail = async (surveyData, userEmail) => {
    if (!nodemailer) {
        console.log('📧 User copy email skipped - nodemailer not available');
        return false;
    }

    try {
        // Load email configuration from environment variables
        const emailConfig = {
            service: process.env.EMAIL_SERVICE || 'outlook',
            host: process.env.EMAIL_HOST || 'smtp.office365.com',
            port: parseInt(process.env.EMAIL_PORT) || 587,
            secure: process.env.EMAIL_SECURE === 'true' || false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        };

        // Skip email if credentials not configured
        if (!emailConfig.auth.user || !emailConfig.auth.pass) {
            console.log('📧 User copy email skipped - credentials not configured');
            return false;
        }

        const transporter = nodemailer.createTransport(emailConfig);

        const userEmailTemplate = {
            from: emailConfig.auth.user,
            to: userEmail,
            subject: `📋 Your MDP Evaluation Submission - ${formatNameForPrivacy(surveyData.mdpName)}`,
            html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <div style="background-color: #004c91; color: white; padding: 20px; text-align: center;">
        <h1>📋 Evaluation Submitted Successfully</h1>
        <p>MDP Performance Dashboard - Copy for Your Records</p>
    </div>
    
    <div style="padding: 20px; background-color: #f8f9fa;">
        <div style="background-color: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <h3>✅ Thank you for your evaluation!</h3>
            <p>Your feedback has been recorded and will contribute to ${formatNameForPrivacy(surveyData.mdpName)}'s performance assessment.</p>
        </div>
        
        <h2>📋 Evaluation Summary</h2>
        <table style="width: 100%; border-collapse: collapse;">
            <tr style="background-color: white;">
                <td style="padding: 10px; border: 1px solid #dee2e6; font-weight: bold;">MDP Participant:</td>
                <td style="padding: 10px; border: 1px solid #dee2e6;">${formatNameForPrivacy(surveyData.mdpName)}</td>
            </tr>
            <tr style="background-color: #f8f9fa;">
                <td style="padding: 10px; border: 1px solid #dee2e6; font-weight: bold;">Function:</td>
                <td style="padding: 10px; border: 1px solid #dee2e6;">${surveyData.functionName}</td>
            </tr>
            <tr style="background-color: white;">
                <td style="padding: 10px; border: 1px solid #dee2e6; font-weight: bold;">Manager:</td>
                <td style="padding: 10px; border: 1px solid #dee2e6;">${formatNameForPrivacy(surveyData.manager)}</td>
            </tr>
            <tr style="background-color: #f8f9fa;">
                <td style="padding: 10px; border: 1px solid #dee2e6; font-weight: bold;">Rotation:</td>
                <td style="padding: 10px; border: 1px solid #dee2e6;">Rotation ${surveyData.rotation}</td>
            </tr>
            <tr style="background-color: white;">
                <td style="padding: 10px; border: 1px solid #dee2e6; font-weight: bold;">Submission Date:</td>
                <td style="padding: 10px; border: 1px solid #dee2e6;">${new Date(surveyData.submittedAt).toLocaleString()}</td>
            </tr>
        </table>
    </div>

    <div style="padding: 20px;">
        <h3>📊 Assessment Scores</h3>
        <div style="background-color: #e3f2fd; padding: 15px; border-radius: 5px;">
            <p><strong>Job Knowledge:</strong> ${surveyData.jobKnowledge}/5.0 (50% weight)</p>
            <p><strong>Quality of Work:</strong> ${surveyData.qualityOfWork}/5.0 (20% weight)</p>
            <p><strong>Communication & Teamwork:</strong> ${surveyData.communication}/5.0 (15% weight)</p>
            <p><strong>Initiative & Productivity:</strong> ${surveyData.initiative}/5.0 (15% weight)</p>
            <p style="margin-top: 15px; font-size: 1.1em;"><strong>Overall Score: ${surveyData.overall}/5.0</strong></p>
        </div>
    </div>

    <div style="padding: 20px;">
        <h3>📝 Individual Question Responses</h3>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px;">
            <table style="width: 100%; border-collapse: collapse;">
                <tr style="background-color: white;">
                    <td style="padding: 8px; border: 1px solid #dee2e6; font-weight: bold;">Question 1:</td>
                    <td style="padding: 8px; border: 1px solid #dee2e6;">${surveyData.responses.Q1}/5</td>
                </tr>
                <tr style="background-color: #f8f9fa;">
                    <td style="padding: 8px; border: 1px solid #dee2e6; font-weight: bold;">Question 2:</td>
                    <td style="padding: 8px; border: 1px solid #dee2e6;">${surveyData.responses.Q2}/5</td>
                </tr>
                <tr style="background-color: white;">
                    <td style="padding: 8px; border: 1px solid #dee2e6; font-weight: bold;">Question 3:</td>
                    <td style="padding: 8px; border: 1px solid #dee2e6;">${surveyData.responses.Q3}/5</td>
                </tr>
                <tr style="background-color: #f8f9fa;">
                    <td style="padding: 8px; border: 1px solid #dee2e6; font-weight: bold;">Question 4:</td>
                    <td style="padding: 8px; border: 1px solid #dee2e6;">${surveyData.responses.Q4}/5</td>
                </tr>
                <tr style="background-color: white;">
                    <td style="padding: 8px; border: 1px solid #dee2e6; font-weight: bold;">Question 5:</td>
                    <td style="padding: 8px; border: 1px solid #dee2e6;">${surveyData.responses.Q5}/5</td>
                </tr>
                <tr style="background-color: #f8f9fa;">
                    <td style="padding: 8px; border: 1px solid #dee2e6; font-weight: bold;">Question 6:</td>
                    <td style="padding: 8px; border: 1px solid #dee2e6;">${surveyData.responses.Q6}/5</td>
                </tr>
                <tr style="background-color: white;">
                    <td style="padding: 8px; border: 1px solid #dee2e6; font-weight: bold;">Question 7:</td>
                    <td style="padding: 8px; border: 1px solid #dee2e6;">${surveyData.responses.Q7}/5</td>
                </tr>
                <tr style="background-color: #f8f9fa;">
                    <td style="padding: 8px; border: 1px solid #dee2e6; font-weight: bold;">Question 8:</td>
                    <td style="padding: 8px; border: 1px solid #dee2e6;">${surveyData.responses.Q8}/5</td>
                </tr>
                <tr style="background-color: white;">
                    <td style="padding: 8px; border: 1px solid #dee2e6; font-weight: bold;">Question 9:</td>
                    <td style="padding: 8px; border: 1px solid #dee2e6;">${surveyData.responses.Q9}/5</td>
                </tr>
                <tr style="background-color: #f8f9fa;">
                    <td style="padding: 8px; border: 1px solid #dee2e6; font-weight: bold;">Question 10:</td>
                    <td style="padding: 8px; border: 1px solid #dee2e6;">${surveyData.responses.Q10}/5</td>
                </tr>
            </table>
        </div>
    </div>
    
    <div style="background-color: #6c757d; color: white; padding: 15px; text-align: center; font-size: 12px;">
        <p>This is a copy of your evaluation submission for your records.</p>
        <p>MDP Performance Dashboard - Sam's Club Management Development Program</p>
    </div>
</div>`,
            text: `
📋 MDP EVALUATION SUBMITTED SUCCESSFULLY

Thank you for your evaluation! Your feedback has been recorded and will contribute to ${formatNameForPrivacy(surveyData.mdpName)}'s performance assessment.

EVALUATION SUMMARY:
• MDP Participant: ${formatNameForPrivacy(surveyData.mdpName)}
• Function: ${surveyData.functionName}
• Manager: ${formatNameForPrivacy(surveyData.manager)}
• Rotation: ${surveyData.rotation}
• Submission Date: ${new Date(surveyData.submittedAt).toLocaleString()}

ASSESSMENT SCORES:
• Job Knowledge: ${surveyData.jobKnowledge}/5.0 (50% weight)
• Quality of Work: ${surveyData.qualityOfWork}/5.0 (20% weight)
• Communication & Teamwork: ${surveyData.communication}/5.0 (15% weight)
• Initiative & Productivity: ${surveyData.initiative}/5.0 (15% weight)

Overall Score: ${surveyData.overall}/5.0

INDIVIDUAL QUESTION RESPONSES:
• Question 1: ${surveyData.responses.Q1}/5
• Question 2: ${surveyData.responses.Q2}/5
• Question 3: ${surveyData.responses.Q3}/5
• Question 4: ${surveyData.responses.Q4}/5
• Question 5: ${surveyData.responses.Q5}/5
• Question 6: ${surveyData.responses.Q6}/5
• Question 7: ${surveyData.responses.Q7}/5
• Question 8: ${surveyData.responses.Q8}/5
• Question 9: ${surveyData.responses.Q9}/5
• Question 10: ${surveyData.responses.Q10}/5

This is a copy of your evaluation submission for your records.

---
MDP Performance Dashboard
Sam's Club Management Development Program
`
        };

        await transporter.sendMail(userEmailTemplate);
        console.log(`✅ User copy email sent successfully to ${userEmail}`);
        return true;

    } catch (error) {
        console.error('❌ Failed to send user copy email:', error.message);
        return false;
    }
};

// Routes
app.get('/api/survey-responses', (req, res) => {
    try {
        const data = readData();
        res.json(data);
    } catch (error) {
        console.error('Error fetching survey responses:', error);
        res.status(500).json({ error: 'Failed to fetch survey responses' });
    }
});

app.post('/api/survey-responses', async (req, res) => {
    try {
        const { mdpName, functionName, manager, rotation, responses, emailResponse, respondentEmail } = req.body;

        // Validate required fields
        if (!mdpName || !functionName || !manager || !rotation || !responses) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Calculate scores using weighted system
        const scores = calculateScores(responses);

        // Create survey entry
        const surveyEntry = {
            id: Date.now().toString(),
            mdpName,
            functionName,
            manager,
            rotation: parseInt(rotation),
            responses,
            submittedAt: new Date().toISOString(),
            emailResponse: emailResponse || false,
            respondentEmail: respondentEmail || null,
            ...scores
        };

        // Save to file
        const data = readData();
        data.push(surveyEntry);
        
        if (writeData(data)) {
            console.log(`✅ Survey saved for ${mdpName} - ${functionName} (Overall: ${scores.overall})`);
            
            // Send program manager notification (non-blocking)
            sendProgramManagerNotification(surveyEntry).catch(error => {
                console.log('📧 Program manager email failed but survey was saved:', error.message);
            });

            // Send user copy if requested (non-blocking)
            if (emailResponse && respondentEmail) {
                sendUserCopyEmail(surveyEntry, respondentEmail).catch(error => {
                    console.log('📧 User copy email failed but survey was saved:', error.message);
                });
            }
            
            res.status(201).json({ 
                message: 'Survey response saved successfully',
                id: surveyEntry.id,
                overall: scores.overall,
                emailSent: emailResponse && respondentEmail ? 'Copy will be sent to your email' : false
            });
        } else {
            res.status(500).json({ error: 'Failed to save survey response' });
        }
    } catch (error) {
        console.error('Error saving survey response:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Health check endpoint for Railway monitoring
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: '1.0.0'
    });
});

// Serve main pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

app.get('/admin.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

app.get('/success.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'success.html'));
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
    const host = server.address().address;
    const port = server.address().port;
    
    console.log(`🚀 MDP Dashboard Server running on http://${host}:${port}`);
    console.log(`📊 API available at /api/survey-responses`);
    console.log(`👩‍💼 Admin Panel available at /admin.html`);
    console.log(`🏥 Health check available at /health`);
    
    if (process.env.RAILWAY_ENVIRONMENT) {
        console.log(`🌐 Railway deployment successful - web service active`);
    }
});

module.exports = app;