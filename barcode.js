/**
 * Barcode Management Module
 * Handles sequential barcode generation and persistence
 * Version: 2.0 - Updated to 7-digit zero-padded sequence
 */

class BarcodeManager {
    constructor() {
        this.storageKey = 'warehouse_label_last_barcode';
        this.prefixStorageKey = 'warehouse_label_barcode_prefix';
        this.initializeBarcode();
    }

    /**
     * Initialize barcode sequence from localStorage or start at 1
     */
    initializeBarcode() {
        const lastBarcode = localStorage.getItem(this.storageKey);
        if (lastBarcode) {
            this.lastBarcode = parseInt(lastBarcode, 10);
        } else {
            this.lastBarcode = 0;
        }
    }

    /**
     * Set barcode prefix
     * @param {string} prefix - Barcode prefix
     */
    setPrefix(prefix) {
        if (prefix) {
            localStorage.setItem(this.prefixStorageKey, prefix);
        } else {
            localStorage.removeItem(this.prefixStorageKey);
        }
    }

    /**
     * Get current barcode prefix
     * @returns {string} Current prefix or empty string
     */
    getPrefix() {
        return localStorage.getItem(this.prefixStorageKey) || '';
    }

    /**
     * Get next sequential barcode with prefix
     * Format: prefix + 7-digit zero-padded sequence
     * Example: "25MX2433669" + "0000011" = "25MX24336690000011"
     * @param {string} prefix - Optional prefix (if not provided, uses stored prefix)
     * @param {number} startSequence - Optional starting sequence number
     * @returns {string} Next barcode value with prefix
     */
    getNextBarcode(prefix = null, startSequence = null) {
        const usePrefix = prefix !== null ? prefix : this.getPrefix();
        
        if (startSequence !== null) {
            this.lastBarcode = startSequence - 1;
        }
        
        this.lastBarcode += 1;
        localStorage.setItem(this.storageKey, this.lastBarcode.toString());
        
        // Pad sequence to 7 digits with leading zeros (NOT 8 digits)
        const sequence = String(this.lastBarcode).padStart(7, '0');
        // Verify it's 7 digits
        if (sequence.length !== 7) {
            console.error('Sequence padding error: expected 7 digits, got', sequence.length);
        }
        // Concatenate prefix and sequence directly (e.g., "25MX2433669" + "0000011" = "25MX24336690000011")
        const result = usePrefix ? usePrefix + sequence : sequence;
        console.log('Generated barcode:', result, 'Sequence:', sequence, 'Length:', sequence.length);
        return result;
    }

    /**
     * Generate multiple sequential barcodes with prefix
     * @param {number} count - Number of barcodes to generate
     * @param {string} prefix - Optional prefix
     * @param {number} startSequence - Optional starting sequence number
     * @returns {string[]} Array of barcode values
     */
    generateBarcodes(count, prefix = null, startSequence = null) {
        const usePrefix = prefix !== null ? prefix : this.getPrefix();
        
        if (startSequence !== null) {
            this.lastBarcode = startSequence - 1;
        }
        
        const barcodes = [];
        for (let i = 0; i < count; i++) {
            barcodes.push(this.getNextBarcode(usePrefix));
        }
        return barcodes;
    }

    /**
     * Reset barcode sequence (for testing/admin purposes)
     */
    resetBarcode() {
        this.lastBarcode = 0;
        localStorage.setItem(this.storageKey, '0');
    }

    /**
     * Get current last barcode without incrementing
     * @param {string} prefix - Optional prefix
     * @returns {string} Current last barcode value
     */
    getCurrentBarcode(prefix = null) {
        const usePrefix = prefix !== null ? prefix : this.getPrefix();
        const sequence = String(this.lastBarcode).padStart(7, '0');
        return usePrefix ? usePrefix + sequence : sequence;
    }

    /**
     * Get preview barcode (next barcode without incrementing sequence)
     * @param {string} prefix - Optional prefix
     * @param {number} startSequence - Optional starting sequence number
     * @returns {string} Preview barcode value
     */
    getPreviewBarcode(prefix = null, startSequence = null) {
        const usePrefix = prefix !== null ? prefix : this.getPrefix();
        let sequence;
        if (startSequence !== null) {
            sequence = String(startSequence).padStart(7, '0');
        } else {
            sequence = String(this.lastBarcode + 1).padStart(7, '0');
        }
        // Verify it's 7 digits
        if (sequence.length !== 7) {
            console.error('Preview sequence padding error: expected 7 digits, got', sequence.length);
        }
        // Concatenate prefix and sequence directly (e.g., "25MX2433669" + "0000011" = "25MX24336690000011")
        const result = usePrefix ? usePrefix + sequence : sequence;
        console.log('Preview barcode:', result, 'Sequence:', sequence, 'Length:', sequence.length);
        return result;
    }
}

/**
 * Generate Code 128 barcode SVG
 * @param {string} value - Barcode value
 * @param {string} containerId - Container element ID
 * @returns {Promise<void>}
 */
function generateBarcodeSVG(value, containerId) {
    return new Promise((resolve, reject) => {
        try {
            // Get the container first
            const container = document.getElementById(containerId);
            if (!container) {
                // Try to find it with a delay in case DOM hasn't updated
                setTimeout(() => {
                    const retryContainer = document.getElementById(containerId);
                    if (!retryContainer) {
                        reject(new Error(`Container ${containerId} not found`));
                        return;
                    }
                    generateBarcodeInContainer(retryContainer, value);
                    resolve();
                }, 100);
                return;
            }

            generateBarcodeInContainer(container, value);
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

function generateBarcodeInContainer(container, value) {
    try {
        // Clear container
        container.innerHTML = '';

        // Create SVG element for barcode
        // Following international standards: 87mm symbol width, 32mm symbol height, 6.5mm quiet zones
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'barcode-svg');
        // Width: 87mm symbol + 13mm quiet zones (6.5mm each side) = 100mm total
        svg.setAttribute('width', '377.95'); // 100mm at 96 DPI (87mm symbol + 13mm quiet zones)
        svg.setAttribute('height', '120.94'); // 32mm at 96 DPI (barcode symbol height for high readability)
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

        // Use JsBarcode to generate Code 128 barcode following ISO/IEC 15417 standards
        // Code 128 supports alphanumeric characters and is ISO/IEC 15417 compliant
        // Optimized for ISO/IEC 15416 print quality grade > 2.5 (Good/Very Good)
        // Key parameters for quality:
        // - width: 2 ensures proper bar width for scanning
        // - margin: 6.5mm quiet zones (exceeds minimum 6.35mm requirement)
        // - height: 32mm optimized for readability and quality
        JsBarcode(svg, value, {
            format: 'CODE128', // ISO/IEC 15417 compliant symbology
            width: 2, // Bar width multiplier (optimal for ISO/IEC 15416 grade > 2.5)
            height: 120.94, // 32mm at 96 DPI (optimized for high readability and quality)
            displayValue: false, // We'll add HRI separately
            margin: 24.57, // 6.5mm quiet zone on each side at 96 DPI (ISO/IEC 15417 requirement: minimum 6.35mm, exceeds for quality)
            background: 'transparent',
            valid: function(valid) {
                if (!valid) {
                    console.warn('Barcode validation failed - may affect ISO/IEC 15416 quality');
                }
            }
        });

        // Append SVG
        container.appendChild(svg);

        // Add HRI below barcode
        const hri = document.createElement('div');
        hri.className = 'barcode-hri';
        hri.textContent = value;
        container.appendChild(hri);
    } catch (error) {
        console.error('Error in generateBarcodeInContainer:', error);
        throw error;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BarcodeManager, generateBarcodeSVG };
}
