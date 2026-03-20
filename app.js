/**
 * Main Application Controller
 * Handles form interactions and label generation
 */

// Wait for DOM to be ready
let barcodeManager;
let labelForm, exportPdfBtn, resetBtn;

// Timer state
let timerInterval = null;
let timerStart = null;

function startTimer() {
    const el = document.getElementById('timerDisplay');
    timerStart = performance.now();
    el.textContent = 'Generating... 0.00s';
    timerInterval = setInterval(() => {
        const elapsed = ((performance.now() - timerStart) / 1000).toFixed(2);
        el.textContent = `Generating... ${elapsed}s`;
    }, 50);
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    const elapsed = ((performance.now() - timerStart) / 1000).toFixed(2);
    document.getElementById('timerDisplay').textContent = `Done in ${elapsed}s`;
}


function updateTimeEstimate() {
    const n = parseInt(document.getElementById('numberOfCartons').value, 10) || 1;
    const secs = (0.3 + n * 0.25).toFixed(1);
    const el = document.getElementById('timeEstimate');
    if (el) el.textContent = `Estimated generation time: ~${secs}s`;
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    try {
        // Initialize barcode manager
        barcodeManager = new BarcodeManager();

        // DOM Elements
        labelForm = document.getElementById('labelForm');
        exportPdfBtn = document.getElementById('exportPdfBtn');
        resetBtn = document.getElementById('resetBtn');

        // Check if all elements are found
        if (!labelForm || !exportPdfBtn || !resetBtn) {
            console.error('Required DOM elements not found');
            alert('Error: Page not loaded correctly. Please refresh the page.');
            return;
        }

        // Check if required libraries are loaded
        if (typeof JsBarcode === 'undefined') {
            console.error('JsBarcode library not loaded');
            alert('Error: Barcode library not loaded. Please check your internet connection.');
            return;
        }

        if (!window.jspdf || !window.jspdf.jsPDF) {
            console.error('jsPDF library not loaded');
            alert('Error: PDF library not loaded. Please check your internet connection.');
            return;
        }

        // Event Listeners
        exportPdfBtn.addEventListener('click', exportPDF);
        resetBtn.addEventListener('click', resetForm);
        // Prevent form submission
        labelForm.addEventListener('submit', (e) => {
            e.preventDefault();
        });

        // Time estimate listener
        document.getElementById('numberOfCartons').addEventListener('input', updateTimeEstimate);

        // Initial render
        updateTimeEstimate();
    } catch (error) {
        console.error('Error initializing application:', error);
        alert('Error initializing application: ' + error.message);
    }
});

/**
 * Get form data
 * @returns {Object} Form data object
 */
function getFormData() {
    return {
        freeText: document.getElementById('freeText').value.trim(),
        size: document.getElementById('size').value.trim(),
        cartonQuantity: document.getElementById('cartonQuantity').value.trim(),
        netWeight: document.getElementById('netWeight').value.trim(),
        grossWeight: document.getElementById('grossWeight').value.trim(),
        itemDescription: document.getElementById('itemDescription').value.trim(),
        countryOfOrigin: document.getElementById('countryOfOrigin').value.trim(),
        barcodePrefix: document.getElementById('barcodePrefix').value.trim(),
        startSequence: parseInt(document.getElementById('startSequence').value, 10) || 1
    };
}

/**
 * Validate form data
 * @param {Object} data - Form data object
 * @returns {boolean} True if valid
 */
function validateFormData(data) {
    const requiredFields = ['freeText', 'size', 'cartonQuantity', 'netWeight', 'grossWeight', 'itemDescription', 'countryOfOrigin'];
    for (const field of requiredFields) {
        if (!data[field]) {
            alert(`Please fill in all required fields. Missing: ${field}`);
            return false;
        }
    }
    return true;
}

/**
 * Export PDF with all labels
 */
async function exportPDF() {
    try {
        const data = getFormData();

        if (!validateFormData(data)) {
            return;
        }

        const numberOfCartons = parseInt(document.getElementById('numberOfCartons').value, 10);

        if (numberOfCartons < 1) {
            alert('Number of cartons must be at least 1');
            return;
        }

        exportPdfBtn.disabled = true;
        exportPdfBtn.textContent = 'Generating...';
        startTimer();

        // Store prefix for future use
        if (data.barcodePrefix) {
            barcodeManager.setPrefix(data.barcodePrefix);
        }

        // Generate barcodes for all cartons with prefix and starting sequence
        const barcodes = barcodeManager.generateBarcodes(numberOfCartons, data.barcodePrefix, data.startSequence);

        if (!barcodes || barcodes.length === 0) {
            alert('Error: Could not generate barcodes');
            return;
        }

        if (numberOfCartons === 1) {
            await generateLabelPDF(data, barcodes[0], 0);
        } else {
            await generateMultipleLabelPDFs(data, barcodes);
        }

        alert(`Successfully generated PDF with ${numberOfCartons} label(s)\nBarcodes: ${barcodes[0]}${barcodes.length > 1 ? ' to ' + barcodes[barcodes.length - 1] : ''}`);
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Error generating PDF: ' + (error.message || 'Unknown error. Please check the browser console for details.'));
    } finally {
        stopTimer();
        exportPdfBtn.disabled = false;
        exportPdfBtn.textContent = 'Export PDF';
    }
}

/**
 * Reset form
 */
function resetForm() {
    if (confirm('Are you sure you want to reset the form? This will clear all input fields.')) {
        labelForm.reset();
        document.getElementById('numberOfCartons').value = 1;
        document.getElementById('startSequence').value = 1;
        updateTimeEstimate();
    }
}

// Functions are defined above, event listeners are set in DOMContentLoaded
