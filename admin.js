class AdminPanel {
    constructor() {
        this.allResponses = [];
        this.filteredResponses = [];
        this.filters = {
            mdp: '',
            function: '',
            manager: '',
            rotation: '',
            search: ''
        };
        
        // Question sets by function - for displaying full question text
        this.questionsByFunction = {
            "Planning": [
                { id: "Q1", text: "MDP can effectively explain their category's P&L and tell a compelling business story through it.", area: "Job Knowledge" },
                { id: "Q2", text: "To what extent does the participant demonstrate fluency in retail math and independently access key financial metrics?", area: "Job Knowledge" },
                { id: "Q3", text: "MDP can navigate and apply financial planning tools (e.g., PBC, ISB Forecasting, AOP, One-Time-Buy).", area: "Job Knowledge" },
                { id: "Q4", text: "MDP can understand and articulate the financial impact of decisions on their category, including budget and JBP alignment.", area: "Job Knowledge" },
                { id: "Q5", text: "MDP produced high-quality deliverables that reflected strong attention to detail and accuracy.", area: "Quality of Work" },
                { id: "Q6", text: "MDP demonstrated problem-solving skills in their work, contributing meaningful insights or improvements to the team or their project.", area: "Quality of Work" },
                { id: "Q7", text: "MDP communicated clearly and effectively with team, stakeholders, and cross-functional partners throughout the rotation.", area: "Communication Skills & Teamwork" },
                { id: "Q8", text: "MDP demonstrated strong collaboration skills and contributed positively to team dynamics.", area: "Communication Skills & Teamwork" },
                { id: "Q9", text: "MDP consistently demonstrated initiative by proactively identifying opportunities, asking thoughtful questions, and seeking out ways to add value during the rotation.", area: "Initiative & Productivity" },
                { id: "Q10", text: "MDP maintained a high level of productivity while also effectively managing their time and responsibilities.", area: "Initiative & Productivity" }
            ],
            "Digital Merch": [
                { id: "Q1", text: "MDP demonstrated a clear understanding of the HAVE + FIND + LOVE + BUY framework and how it supports the digital purchase funnel at Sam's Club.", area: "Job Knowledge" },
                { id: "Q2", text: "MDP can articulate how Digital Merchandising's strategy aligns with the broader Sam's Club strategy, particularly in accelerating the omni member experience.", area: "Job Knowledge" },
                { id: "Q3", text: "MDP understands and can articulate how images and content impact SEO in Google.", area: "Job Knowledge" },
                { id: "Q4", text: "MDP has a solid understanding of how items come to life on samsclub.com, from creation to discovery, checkout, and delivery.", area: "Job Knowledge" },
                { id: "Q5", text: "MDP produced high-quality deliverables that reflected strong attention to detail and accuracy.", area: "Quality of Work" },
                { id: "Q6", text: "MDP demonstrated problem-solving skills in their work, contributing meaningful insights or improvements to the team or their project.", area: "Quality of Work" },
                { id: "Q7", text: "MDP communicated clearly and effectively with team, stakeholders, and cross-functional partners throughout the rotation.", area: "Communication Skills & Teamwork" },
                { id: "Q8", text: "MDP demonstrated strong collaboration skills and contributed positively to team dynamics.", area: "Communication Skills & Teamwork" },
                { id: "Q9", text: "MDP consistently demonstrated initiative by proactively identifying opportunities, asking thoughtful questions, and seeking out ways to add value during the rotation.", area: "Initiative & Productivity" },
                { id: "Q10", text: "MDP maintained a high level of productivity while also effectively managing their time and responsibilities.", area: "Initiative & Productivity" }
            ],
            "Replenishment": [
                { id: "Q1", text: "MDP demonstrates confidence in using dashboards and reporting tools across replenishment systems to identify demand accuracy and support decision-making.", area: "Job Knowledge" },
                { id: "Q2", text: "MDP understands the importance of item creation and maintenance accuracy, and recognizes how errors in this process can impact club operations.", area: "Job Knowledge" },
                { id: "Q3", text: "MDP applies strategies to improve forecast accuracy and shows an understanding of how demand planning decisions drive seasonal and short-term sell-through.", area: "Job Knowledge" },
                { id: "Q4", text: "MDP demonstrates an understanding of the importance of collaboration between merchants and replenishment teams in strengthening inventory allocation and supporting club performance.", area: "Job Knowledge" },
                { id: "Q5", text: "MDP produced high-quality deliverables that reflected strong attention to detail and accuracy.", area: "Quality of Work" },
                { id: "Q6", text: "MDP demonstrated problem-solving skills in their work, contributing meaningful insights or improvements to the team or their project.", area: "Quality of Work" },
                { id: "Q7", text: "MDP communicated clearly and effectively with team, stakeholders, and cross-functional partners throughout the rotation.", area: "Communication Skills & Teamwork" },
                { id: "Q8", text: "MDP demonstrated strong collaboration skills and contributed positively to team dynamics.", area: "Communication Skills & Teamwork" },
                { id: "Q9", text: "MDP consistently demonstrated initiative by proactively identifying opportunities, asking thoughtful questions, and seeking out ways to add value during the rotation.", area: "Initiative & Productivity" },
                { id: "Q10", text: "MDP maintained a high level of productivity while also effectively managing their time and responsibilities.", area: "Initiative & Productivity" }
            ],
            "Member's Mark": [
                { id: "Q1", text: "MDP demonstrates a clear understanding of the Member's Mark ambition and strategy, and can articulate how it connects to the broader Sam's Club strategy.", area: "Job Knowledge" },
                { id: "Q2", text: "MDP demonstrated a strong understanding of the Member's Mark creative guidelines and contributed to delivering a consistent member experience through packaging and design.", area: "Job Knowledge" },
                { id: "Q3", text: "MDP effectively engaged with member research and sensory testing processes, showing a clear understanding of how member insights inform product development.", area: "Job Knowledge" },
                { id: "Q4", text: "MDP showed a solid grasp of cross-functional collaboration, including quality, sourcing, and brand line management, and how these functions align to support the Member's Mark strategy.", area: "Job Knowledge" },
                { id: "Q5", text: "MDP produced high-quality deliverables that reflected strong attention to detail and accuracy.", area: "Quality of Work" },
                { id: "Q6", text: "MDP demonstrated problem-solving skills in their work, contributing meaningful insights or improvements to the team or their project.", area: "Quality of Work" },
                { id: "Q7", text: "MDP communicated clearly and effectively with team, stakeholders, and cross-functional partners throughout the rotation.", area: "Communication Skills & Teamwork" },
                { id: "Q8", text: "MDP demonstrated strong collaboration skills and contributed positively to team dynamics.", area: "Communication Skills & Teamwork" },
                { id: "Q9", text: "MDP consistently demonstrated initiative by proactively identifying opportunities, asking thoughtful questions, and seeking out ways to add value during the rotation.", area: "Initiative & Productivity" },
                { id: "Q10", text: "MDP maintained a high level of productivity while also effectively managing their time and responsibilities.", area: "Initiative & Productivity" }
            ]
        };
        
        this.init();
    }

    async init() {
        console.log('AdminPanel initializing...');
        this.setupEventListeners();
        await this.loadResponses();
        console.log('AdminPanel initialized');
    }

    setupEventListeners() {
        // Filter event listeners with null checks
        const mdpFilter = document.getElementById('mdpFilter');
        if (mdpFilter) {
            mdpFilter.addEventListener('change', (e) => {
                this.filters.mdp = e.target.value;
                this.applyFilters();
            });
        }

        const functionFilter = document.getElementById('functionFilter');
        if (functionFilter) {
            functionFilter.addEventListener('change', (e) => {
                this.filters.function = e.target.value;
                this.applyFilters();
            });
        }

        const managerFilter = document.getElementById('managerFilter');
        if (managerFilter) {
            managerFilter.addEventListener('change', (e) => {
                this.filters.manager = e.target.value;
                this.applyFilters();
            });
        }

        const rotationFilter = document.getElementById('rotationFilter');
        if (rotationFilter) {
            rotationFilter.addEventListener('change', (e) => {
                this.filters.rotation = e.target.value;
                this.applyFilters();
            });
        }

        const searchFilter = document.getElementById('searchFilter');
        if (searchFilter) {
            searchFilter.addEventListener('input', (e) => {
                this.filters.search = e.target.value;
                this.applyFilters();
            });
        }

        // Modal close on outside click
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('responseModal');
            if (e.target === modal) {
                this.closeModal();
            }
        });
    }

    async loadResponses() {
        try {
            console.log('Loading responses from API...');
            const response = await fetch('/api/survey-responses');
            console.log('API response status:', response.status);
            if (!response.ok) throw new Error('Failed to load responses');
            
            this.allResponses = await response.json();
            console.log('Loaded responses:', this.allResponses.length);
            console.log('First response:', this.allResponses[0]);
            this.populateFilters();
            this.applyFilters();
            this.updateStats();
            this.updateLastUpdated();
            console.log('Admin panel loaded successfully');
        } catch (error) {
            console.error('Error loading responses:', error);
            console.error('Error stack:', error.stack);
            const tableContent = document.getElementById('tableContent');
            if (tableContent) {
                tableContent.innerHTML = 
                    '<div class="error">Error loading responses: ' + error.message + '</div>';
            }
        }
    }

    populateFilters() {
        // Populate MDP filter
        const mdps = [...new Set(this.allResponses.map(r => r.mdpName))].sort();
        this.populateSelect('mdpFilter', mdps, 'All MDPs');

        // Populate Function filter
        const functions = [...new Set(this.allResponses.map(r => r.functionName))].sort();
        this.populateSelect('functionFilter', functions, 'All Functions');

        // Populate Manager filter (normalized)
        const managers = [...new Set(this.allResponses.map(r => 
            r.manager.trim().split(' ').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            ).join(' ')
        ))].sort();
        this.populateSelect('managerFilter', managers, 'All Managers');

        // Populate Rotation filter
        const rotations = [...new Set(this.allResponses.map(r => r.rotation))].sort((a, b) => a - b);
        this.populateSelect('rotationFilter', rotations, 'All Rotations');
    }

    populateSelect(selectId, options, defaultText) {
        const select = document.getElementById(selectId);
        select.innerHTML = `<option value="">${defaultText}</option>`;
        
        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.textContent = option;
            select.appendChild(optionElement);
        });
    }

    applyFilters() {
        this.filteredResponses = this.allResponses.filter(response => {
            // Normalize manager name for comparison
            const normalizedManager = response.manager.trim().split(' ').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            ).join(' ');

            return (
                (!this.filters.mdp || response.mdpName === this.filters.mdp) &&
                (!this.filters.function || response.functionName === this.filters.function) &&
                (!this.filters.manager || normalizedManager === this.filters.manager) &&
                (!this.filters.rotation || response.rotation.toString() === this.filters.rotation) &&
                (!this.filters.search || 
                    response.mdpName.toLowerCase().includes(this.filters.search.toLowerCase()) ||
                    response.manager.toLowerCase().includes(this.filters.search.toLowerCase()) ||
                    response.functionName.toLowerCase().includes(this.filters.search.toLowerCase())
                )
            );
        });

        this.renderTable();
        this.updateStats();
    }

    renderTable() {
        const tableContent = document.getElementById('tableContent');
        
        if (!tableContent) {
            console.warn('tableContent element not found');
            return;
        }
        
        if (this.filteredResponses.length === 0) {
            tableContent.innerHTML = '<div class="no-data">No responses match your filters.</div>';
            return;
        }

        const tableHTML = `
            <table class="response-table">
                <thead>
                    <tr>
                        <th>MDP Name</th>
                        <th>Function</th>
                        <th>Manager</th>
                        <th>Rotation</th>
                        <th>Overall Score</th>
                        <th>Submitted</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.filteredResponses.map(response => this.renderResponseRow(response)).join('')}
                </tbody>
            </table>
        `;

        tableContent.innerHTML = tableHTML;
    }

    // Privacy: Format names as "First Name L." for display
    formatNameForPrivacy(fullName) {
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
    }

    renderResponseRow(response) {
        // Safe handling for missing scores
        const overall = response.overall || this.calculateOverallScore(response.responses) || 0;
        const scoreClass = this.getScoreClass(overall);
        const submittedDate = new Date(response.submittedAt).toLocaleDateString();
        
        return `
            <tr>
                <td><strong>${this.formatNameForPrivacy(response.mdpName)}</strong></td>
                <td>${response.functionName}</td>
                <td>${this.formatNameForPrivacy(response.manager)}</td>
                <td>Rotation ${response.rotation}</td>
                <td><span class="score-badge ${scoreClass}">${overall.toFixed(2)}</span></td>
                <td>${submittedDate}</td>
                <td>
                    <button class="btn-view" onclick="admin.viewResponse('${response.id}')">View</button>
                    <button class="btn-view" onclick="admin.exportSingleResponse('${response.id}')">Export</button>
                </td>
            </tr>
        `;
    }

    getScoreClass(score) {
        if (score >= 4.5) return 'score-excellent';
        if (score >= 4.0) return 'score-good';
        if (score >= 3.0) return 'score-fair';
        return 'score-poor';
    }

    updateStats() {
        const responses = this.filteredResponses;
        
        // Total responses - with null check
        const totalResponsesEl = document.getElementById('totalResponses');
        if (totalResponsesEl) {
            totalResponsesEl.textContent = responses.length;
        }
        
        // Average score with safe handling
        const avgScore = responses.length > 0 
            ? (responses.reduce((sum, r) => {
                const overall = r.overall || this.calculateOverallScore(r.responses) || 0;
                return sum + overall;
            }, 0) / responses.length).toFixed(2)
            : '--';
        const avgScoreEl = document.getElementById('avgScore');
        if (avgScoreEl) {
            avgScoreEl.textContent = avgScore;
        }
        
        // Latest rotation
        const latestRotation = responses.length > 0 
            ? Math.max(...responses.map(r => parseInt(r.rotation)))
            : '--';
        const latestRotationEl = document.getElementById('latestRotation');
        if (latestRotationEl) {
            latestRotationEl.textContent = latestRotation;
        }
    }

    updateLastUpdated() {
        const now = new Date().toLocaleString();
        const lastUpdatedEl = document.getElementById('lastUpdated');
        if (lastUpdatedEl) {
            lastUpdatedEl.textContent = `Last updated: ${now}`;
        }
    }

    viewResponse(responseId) {
        const response = this.allResponses.find(r => r.id === responseId);
        if (!response) return;

        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        
        modalTitle.textContent = `${this.formatNameForPrivacy(response.mdpName)} - Rotation ${response.rotation}`;
        
        modalBody.innerHTML = `
            <div class="response-section">
                <div class="section-title">Participant Information</div>
                <p><strong>MDP Name:</strong> ${this.formatNameForPrivacy(response.mdpName)}</p>
                <p><strong>Function:</strong> ${response.functionName}</p>
                <p><strong>Manager:</strong> ${this.formatNameForPrivacy(response.manager)}</p>
                <p><strong>Rotation:</strong> ${response.rotation}</p>
                <p><strong>Submitted:</strong> ${new Date(response.submittedAt).toLocaleString()}</p>
            </div>

            <div class="response-section">
                <div class="section-title">Performance Scores</div>
                <p><strong>Overall Score:</strong> <span class="score-badge ${this.getScoreClass(response.overall || 0)}">${(response.overall || 0).toFixed(2)}</span></p>
                <p><strong>Job Knowledge:</strong> ${(response.jobKnowledge || 0).toFixed(2)}</p>
                <p><strong>Quality of Work:</strong> ${(response.qualityOfWork || 0).toFixed(2)}</p>
                <p><strong>Communication:</strong> ${(response.communication || 0).toFixed(2)}</p>
                <p><strong>Initiative:</strong> ${(response.initiative || 0).toFixed(2)}</p>
            </div>

            <div class="response-section">
                <div class="section-title">Individual Question Responses</div>
                ${this.renderQuestionResponses(response)}
            </div>

            <div class="response-section">
                <div class="section-title">Export Options</div>
                <button class="export-btn" onclick="admin.exportSingleResponse('${response.id}')">Export This Response</button>
            </div>
        `;

        document.getElementById('responseModal').style.display = 'block';
    }

    renderQuestionResponses(response) {
        const questions = Object.entries(response.responses);
        const functionQuestions = this.questionsByFunction[response.functionName] || [];
        
        return questions.map(([questionId, score]) => {
            const questionData = functionQuestions.find(q => q.id === questionId);
            const questionText = questionData ? questionData.text : `Question ${questionId.substring(1)}`;
            const questionArea = questionData ? questionData.area : '';
            
            return `
                <div class="question-detail">
                    <div class="question-id">${questionId}</div>
                    <div class="question-text">${questionText}</div>
                    <div class="question-area">${questionArea}</div>
                    <div class="question-score">Score: ${score}/5</div>
                </div>
            `;
        }).join('');
    }

    closeModal() {
        document.getElementById('responseModal').style.display = 'none';
    }

    exportSingleResponse(responseId) {
        const response = this.allResponses.find(r => r.id === responseId);
        if (!response) return;

        const csvContent = this.generateCSV([response]);
        const filename = `${this.formatNameForPrivacy(response.mdpName).replace(' ', '_')}_Rotation_${response.rotation}_${new Date().toISOString().split('T')[0]}.csv`;
        this.downloadCSV(csvContent, filename);
    }

    exportAllResponses() {
        const csvContent = this.generateCSV(this.allResponses);
        const filename = `All_Survey_Responses_${new Date().toISOString().split('T')[0]}.csv`;
        this.downloadCSV(csvContent, filename);
    }

    exportFilteredResponses() {
        const csvContent = this.generateCSV(this.filteredResponses);
        const filename = `Filtered_Survey_Responses_${new Date().toISOString().split('T')[0]}.csv`;
        this.downloadCSV(csvContent, filename);
    }

    generateCSV(responses) {
        if (responses.length === 0) return '';

        // CSV Headers - keeping it simple to avoid errors
        const headers = [
            'MDP Name',
            'Function',
            'Manager',
            'Rotation',
            'Overall Score',
            'Job Knowledge',
            'Quality of Work',
            'Communication',
            'Initiative',
            'Submitted Date',
            'Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8', 'Q9', 'Q10'
        ];

        // CSV Rows
        const rows = responses.map(response => [
            this.formatNameForPrivacy(response.mdpName),
            response.functionName,
            this.formatNameForPrivacy(response.manager),
            response.rotation,
            (response.overall || 0).toFixed(2),
            (response.jobKnowledge || 0).toFixed(2),
            (response.qualityOfWork || 0).toFixed(2),
            (response.communication || 0).toFixed(2),
            (response.initiative || 0).toFixed(2),
            new Date(response.submittedAt).toLocaleString(),
            ...Object.values(response.responses)
        ]);

        // Combine headers and rows
        const csvArray = [headers, ...rows];
        
        // Convert to CSV string
        return csvArray.map(row => 
            row.map(field => `"${field}"`).join(',')
        ).join('\n');
    }

    downloadCSV(csvContent, filename) {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    // Helper function to calculate overall score from responses
    calculateOverallScore(responses) {
        if (!responses || typeof responses !== 'object') return 0;
        
        const values = Object.values(responses).filter(v => !isNaN(v) && v > 0);
        if (values.length === 0) return 0;
        
        return values.reduce((sum, val) => sum + parseInt(val), 0) / values.length;
    }
}

// Global functions for onclick handlers
window.loadResponses = () => admin.loadResponses();
window.exportAllResponses = () => admin.exportAllResponses();
window.exportFilteredResponses = () => admin.exportFilteredResponses();
window.closeModal = () => admin.closeModal();

// Initialize admin panel
const admin = new AdminPanel();