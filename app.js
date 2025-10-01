// Documents Capture Application - Main JavaScript

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadDocuments();
    setupEventListeners();
    updateStatistics();
});

// Document class to represent a document record
class Document {
    constructor(id, clientName, documentType, numberOfPages, costPerPage, revenue) {
        this.id = id;
        this.clientName = clientName;
        this.documentType = documentType;
        this.numberOfPages = parseInt(numberOfPages);
        this.costPerPage = parseFloat(costPerPage);
        this.totalCost = this.numberOfPages * this.costPerPage;
        this.revenue = parseFloat(revenue);
        this.netProfit = this.revenue - this.totalCost;
        this.createdAt = new Date().toISOString();
    }
}

// LocalStorage management
const StorageManager = {
    KEY: 'documentsCapture',
    
    getDocuments: function() {
        const data = localStorage.getItem(this.KEY);
        return data ? JSON.parse(data) : [];
    },
    
    saveDocuments: function(documents) {
        localStorage.setItem(this.KEY, JSON.stringify(documents));
    },
    
    addDocument: function(document) {
        const documents = this.getDocuments();
        documents.push(document);
        this.saveDocuments(documents);
    },
    
    updateDocument: function(id, updatedDocument) {
        const documents = this.getDocuments();
        const index = documents.findIndex(doc => doc.id === id);
        if (index !== -1) {
            documents[index] = updatedDocument;
            this.saveDocuments(documents);
            return true;
        }
        return false;
    },
    
    deleteDocument: function(id) {
        const documents = this.getDocuments();
        const filtered = documents.filter(doc => doc.id !== id);
        this.saveDocuments(filtered);
    },
    
    clearAll: function() {
        localStorage.removeItem(this.KEY);
    }
};

// Event Listeners Setup
function setupEventListeners() {
    // Form submission
    document.getElementById('documentForm').addEventListener('submit', handleFormSubmit);
    
    // Cancel button
    document.getElementById('cancelBtn').addEventListener('click', resetForm);
    
    // Clear all button
    document.getElementById('clearAllBtn').addEventListener('click', handleClearAll);
    
    // Search input
    document.getElementById('searchInput').addEventListener('input', handleSearch);
    
    // Calculate total cost and net profit when inputs change
    document.getElementById('numberOfPages').addEventListener('input', calculateTotals);
    document.getElementById('costPerPage').addEventListener('input', calculateTotals);
    document.getElementById('revenue').addEventListener('input', calculateTotals);
}

// Calculate total cost and net profit
function calculateTotals() {
    const numberOfPages = parseFloat(document.getElementById('numberOfPages').value) || 0;
    const costPerPage = parseFloat(document.getElementById('costPerPage').value) || 0;
    const revenue = parseFloat(document.getElementById('revenue').value) || 0;
    
    const totalCost = numberOfPages * costPerPage;
    const netProfit = revenue - totalCost;
    
    document.getElementById('totalCost').value = totalCost.toFixed(2);
    document.getElementById('netProfit').value = netProfit.toFixed(2);
}

// Handle form submission
function handleFormSubmit(event) {
    event.preventDefault();
    
    const id = document.getElementById('documentId').value;
    const clientName = document.getElementById('clientName').value.trim();
    const documentType = document.getElementById('documentType').value.trim();
    const numberOfPages = document.getElementById('numberOfPages').value;
    const costPerPage = document.getElementById('costPerPage').value;
    const revenue = document.getElementById('revenue').value;
    
    // Validation
    if (!clientName || !documentType || !numberOfPages || !costPerPage || !revenue) {
        showAlert('Please fill in all required fields!', 'danger');
        return;
    }
    
    if (id) {
        // Update existing document
        const document = new Document(id, clientName, documentType, numberOfPages, costPerPage, revenue);
        if (StorageManager.updateDocument(id, document)) {
            showAlert('Document updated successfully!', 'success');
        }
    } else {
        // Create new document
        const newId = 'doc_' + Date.now();
        const document = new Document(newId, clientName, documentType, numberOfPages, costPerPage, revenue);
        StorageManager.addDocument(document);
        showAlert('Document added successfully!', 'success');
    }
    
    resetForm();
    loadDocuments();
    updateStatistics();
}

// Load and display documents
function loadDocuments(searchTerm = '') {
    const documents = StorageManager.getDocuments();
    const tbody = document.getElementById('documentsTableBody');
    
    // Filter documents based on search term
    const filteredDocuments = documents.filter(doc => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return doc.clientName.toLowerCase().includes(term) || 
               doc.documentType.toLowerCase().includes(term);
    });
    
    if (filteredDocuments.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center text-muted">
                    <i class="bi bi-inbox"></i> ${searchTerm ? 'No documents match your search.' : 'No documents found. Add your first document!'}
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = filteredDocuments.map(doc => `
        <tr class="fade-in">
            <td>${escapeHtml(doc.clientName)}</td>
            <td>${escapeHtml(doc.documentType)}</td>
            <td>${doc.numberOfPages}</td>
            <td>$${doc.costPerPage.toFixed(2)}</td>
            <td>$${doc.totalCost.toFixed(2)}</td>
            <td>$${doc.revenue.toFixed(2)}</td>
            <td class="${doc.netProfit >= 0 ? 'profit-positive' : 'profit-negative'}">
                $${doc.netProfit.toFixed(2)}
            </td>
            <td>
                <button class="btn btn-sm btn-warning btn-action" onclick="editDocument('${doc.id}')">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-danger btn-action" onclick="deleteDocument('${doc.id}')">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Edit document
function editDocument(id) {
    const documents = StorageManager.getDocuments();
    const document = documents.find(doc => doc.id === id);
    
    if (!document) {
        showAlert('Document not found!', 'danger');
        return;
    }
    
    // Populate form with document data
    document.getElementById('documentId').value = document.id;
    document.getElementById('clientName').value = document.clientName;
    document.getElementById('documentType').value = document.documentType;
    document.getElementById('numberOfPages').value = document.numberOfPages;
    document.getElementById('costPerPage').value = document.costPerPage;
    document.getElementById('revenue').value = document.revenue;
    
    // Calculate totals
    calculateTotals();
    
    // Update form title and show cancel button
    document.getElementById('formTitle').textContent = 'Edit Document';
    document.getElementById('submitBtn').innerHTML = '<i class="bi bi-save"></i> Update Document';
    document.getElementById('cancelBtn').style.display = 'block';
    
    // Scroll to form
    document.getElementById('documentForm').scrollIntoView({ behavior: 'smooth' });
}

// Delete document
function deleteDocument(id) {
    if (confirm('Are you sure you want to delete this document?')) {
        StorageManager.deleteDocument(id);
        showAlert('Document deleted successfully!', 'info');
        loadDocuments();
        updateStatistics();
    }
}

// Handle clear all
function handleClearAll() {
    if (confirm('Are you sure you want to delete ALL documents? This action cannot be undone!')) {
        StorageManager.clearAll();
        showAlert('All documents have been cleared!', 'info');
        loadDocuments();
        updateStatistics();
    }
}

// Handle search
function handleSearch(event) {
    const searchTerm = event.target.value;
    loadDocuments(searchTerm);
}

// Reset form
function resetForm() {
    document.getElementById('documentForm').reset();
    document.getElementById('documentId').value = '';
    document.getElementById('totalCost').value = '';
    document.getElementById('netProfit').value = '';
    document.getElementById('formTitle').textContent = 'Add New Document';
    document.getElementById('submitBtn').innerHTML = '<i class="bi bi-save"></i> Save Document';
    document.getElementById('cancelBtn').style.display = 'none';
}

// Update statistics
function updateStatistics() {
    const documents = StorageManager.getDocuments();
    
    const totalDocuments = documents.length;
    const totalPages = documents.reduce((sum, doc) => sum + doc.numberOfPages, 0);
    const totalRevenue = documents.reduce((sum, doc) => sum + doc.revenue, 0);
    const totalProfit = documents.reduce((sum, doc) => sum + doc.netProfit, 0);
    
    document.getElementById('totalDocuments').textContent = totalDocuments;
    document.getElementById('totalPages').textContent = totalPages;
    document.getElementById('totalRevenue').textContent = '$' + totalRevenue.toFixed(2);
    
    const profitElement = document.getElementById('totalProfit');
    profitElement.textContent = '$' + totalProfit.toFixed(2);
    profitElement.className = totalProfit >= 0 ? 'text-success' : 'text-danger';
}

// Show alert message
function showAlert(message, type) {
    // Remove any existing alerts
    const existingAlert = document.querySelector('.alert-custom');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show alert-custom`;
    alert.style.position = 'fixed';
    alert.style.top = '20px';
    alert.style.right = '20px';
    alert.style.zIndex = '9999';
    alert.style.minWidth = '300px';
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alert);
    
    // Auto-dismiss after 3 seconds
    setTimeout(() => {
        alert.remove();
    }, 3000);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
