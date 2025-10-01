# Documents Capture Application

## Overview
Documents Capture Application is a simple web-based CRUD system designed to help users add, edit, delete, and review document-related records. The application simulates a small document-tracking system where you can enter client details, number of pages, costs, and automatically calculate net profit.

It is built using HTML, CSS (Bootstrap), and JavaScript and relies on LocalStorage for data persistence — meaning all records are saved locally in the browser.

## Features

- **Create** - Add new document records with client details, document type, pages, costs, and revenue
- **Read** - View all document records in an organized table format
- **Update** - Edit existing document records
- **Delete** - Remove individual records or clear all records
- **Search** - Filter documents by client name or document type
- **Automatic Calculations** - Automatically calculates:
  - Total Cost (Number of Pages × Cost per Page)
  - Net Profit (Revenue - Total Cost)
- **Statistics Dashboard** - Real-time statistics showing:
  - Total number of documents
  - Total pages processed
  - Total revenue
  - Total profit
- **Data Persistence** - All data is stored locally in the browser using LocalStorage

## How to Use

1. **Open the Application**
   - Simply open `index.html` in any modern web browser
   - No server or installation required

2. **Add a New Document**
   - Fill in the form on the left side with:
     - Client Name
     - Document Type
     - Number of Pages
     - Cost per Page
     - Revenue
   - Total Cost and Net Profit will be calculated automatically
   - Click "Save Document" to add the record

3. **View Documents**
   - All documents are displayed in the table on the right side
   - Statistics are shown above the table
   - Documents show profit in green (positive) or red (negative)

4. **Edit a Document**
   - Click the pencil icon (✏️) in the Actions column
   - Update the information in the form
   - Click "Update Document" to save changes

5. **Delete a Document**
   - Click the trash icon (🗑️) in the Actions column
   - Confirm the deletion

6. **Search Documents**
   - Use the search box above the table
   - Search by client name or document type

7. **Clear All Documents**
   - Click "Clear All" button to remove all records
   - This action requires confirmation

## Technologies Used

- **HTML5** - Structure and content
- **CSS3** - Custom styling
- **Bootstrap 5.3** - Responsive design and UI components
- **Bootstrap Icons** - Icon library
- **JavaScript (ES6)** - Application logic and functionality
- **LocalStorage API** - Data persistence

## File Structure

```
Documents-Capture-Application/
│
├── index.html          # Main HTML file with application structure
├── styles.css          # Custom CSS styles
├── app.js              # JavaScript application logic
└── README.md           # This file
```

## Browser Compatibility

This application works on all modern browsers that support:
- HTML5
- CSS3
- ES6 JavaScript
- LocalStorage API

Recommended browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Data Storage

All data is stored locally in your browser using the LocalStorage API. This means:
- ✅ No server required
- ✅ Fast performance
- ✅ Data persists between sessions
- ⚠️ Data is specific to the browser and device
- ⚠️ Clearing browser data will delete all records
- ⚠️ Data is not synchronized across devices

## License

This project is open source and available for educational and commercial use.
