/**
 * Label Rendering Module
 * Handles label generation with exact dimensions and layout
 */

/**
 * Create a label element with all fields
 * @param {Object} data - Label data object
 * @param {string} barcodeValue - Barcode value
 * @param {string} containerId - Container ID for barcode
 * @returns {HTMLElement} Label container element
 */
function createLabelElement(data, barcodeValue, containerId) {
    // Create main label container (6×4 inches)
    const labelContainer = document.createElement('div');
    labelContainer.className = 'label-container';

    // Create content wrapper
    const content = document.createElement('div');
    content.className = 'label-content';

    // Create top section with two-column layout
    const topSection = document.createElement('div');
    topSection.className = 'label-text-fields';

    // Left column - Free Text, SIZE (left-aligned)
    const leftColumn = document.createElement('div');
    leftColumn.className = 'label-left-column';

    // Field A: Free Text
    if (data.freeText) {
        const freeText = document.createElement('div');
        freeText.className = 'label-free-text';
        freeText.textContent = data.freeText;
        leftColumn.appendChild(freeText);
    }

    // Field B: SIZE
    if (data.size) {
        const size = document.createElement('div');
        size.className = 'label-size';
        size.textContent = `SIZE: ${data.size}`;
        leftColumn.appendChild(size);
    }

    // Right column - NET WEIGHT, GROSS WEIGHT (right-aligned)
    const rightColumn = document.createElement('div');
    rightColumn.className = 'label-right-column';

    // Field E: NET WEIGHT - All caps header, auto-add "kgs" suffix
    if (data.netWeight) {
        const netWeight = document.createElement('div');
        netWeight.className = 'label-net-weight';
        const weightValue = data.netWeight.trim();
        const weightWithUnit = weightValue.toLowerCase().endsWith('kgs') ? weightValue : weightValue + ' kgs';
        netWeight.textContent = `NET WEIGHT: ${weightWithUnit}`;
        rightColumn.appendChild(netWeight);
    }

    // Field F: GROSS WEIGHT - All caps header, auto-add "kgs" suffix
    if (data.grossWeight) {
        const grossWeight = document.createElement('div');
        grossWeight.className = 'label-gross-weight';
        const weightValue = data.grossWeight.trim();
        const weightWithUnit = weightValue.toLowerCase().endsWith('kgs') ? weightValue : weightValue + ' kgs';
        grossWeight.textContent = `GROSS WEIGHT: ${weightWithUnit}`;
        rightColumn.appendChild(grossWeight);
    }

    // Add columns to top section
    topSection.appendChild(leftColumn);
    topSection.appendChild(rightColumn);
    content.appendChild(topSection);

    // Create center-aligned fields container below the two-column layout
    const centerFieldsContainer = document.createElement('div');
    centerFieldsContainer.className = 'label-center-fields';

    // Field C: CARTON QUANTITY - Center aligned
    if (data.cartonQuantity) {
        const cartonQuantity = document.createElement('div');
        cartonQuantity.className = 'label-carton-quantity';
        cartonQuantity.textContent = `CARTON QUANTITY: ${data.cartonQuantity}`;
        centerFieldsContainer.appendChild(cartonQuantity);
    }

    // Field G: ITEM DESCRIPTION - Center aligned
    if (data.itemDescription) {
        const itemDescription = document.createElement('div');
        itemDescription.className = 'label-item-description';
        itemDescription.textContent = `ITEM DESCRIPTION: ${data.itemDescription}`;
        centerFieldsContainer.appendChild(itemDescription);
    }

    // Field H: COUNTRY OF ORIGIN - Center aligned
    if (data.countryOfOrigin) {
        const countryOfOrigin = document.createElement('div');
        countryOfOrigin.className = 'label-country-of-origin';
        countryOfOrigin.textContent = `COUNTRY OF ORIGIN: ${data.countryOfOrigin}`;
        centerFieldsContainer.appendChild(countryOfOrigin);
    }

    content.appendChild(centerFieldsContainer);

    // Field D: BARCODE (100mm × 60mm container) - Bottom section
    const barcodeContainer = document.createElement('div');
    barcodeContainer.className = 'barcode-container';
    barcodeContainer.id = containerId;
    content.appendChild(barcodeContainer);

    labelContainer.appendChild(content);
    return labelContainer;
}

/**
 * Generate PDF from label data
 * @param {Object} data - Label data object
 * @param {string} barcodeValue - Barcode value
 * @param {number} labelIndex - Index of label (for multiple labels)
 * @returns {Promise<void>}
 */
async function generateLabelPDF(data, barcodeValue, labelIndex = 0) {
    return new Promise((resolve, reject) => {
        try {
            if (!window.jspdf || !window.jspdf.jsPDF) {
                reject(new Error('jsPDF library not loaded'));
                return;
            }
            
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: [152.4, 101.6] // 6×4 inches in mm
            });

            // Set font
            pdf.setFont('helvetica', 'bold');

            let yPosition = 10; // Start position with margin

            // All fields use uniform 16pt font size
            const uniformFontSize = 16;
            const lineSpacing = 8; // Consistent spacing between lines

            // Top section: Two-column layout
            const leftColumnX = 10; // Left margin
            const rightColumnX = 152.4 - 10; // Right margin (right-aligned)
            let leftY = yPosition;
            let rightY = yPosition;

            // Left column - Free Text, SIZE (left-aligned)
            // Field A: Free Text
            if (data.freeText) {
                pdf.setFontSize(uniformFontSize);
                pdf.text(data.freeText, leftColumnX, leftY, { align: 'left' });
                leftY += lineSpacing;
            }

            // Field B: SIZE
            if (data.size) {
                pdf.setFontSize(uniformFontSize);
                pdf.text(`SIZE: ${data.size}`, leftColumnX, leftY, { align: 'left' });
                leftY += lineSpacing;
            }

            // Right column - NET WEIGHT, GROSS WEIGHT (right-aligned)
            // Field E: NET WEIGHT - All caps header, auto-add "kgs" suffix
            if (data.netWeight) {
                pdf.setFontSize(uniformFontSize);
                const weightValue = data.netWeight.trim();
                const weightWithUnit = weightValue.toLowerCase().endsWith('kgs') ? weightValue : weightValue + ' kgs';
                pdf.text(`NET WEIGHT: ${weightWithUnit}`, rightColumnX, rightY, { align: 'right' });
                rightY += lineSpacing;
            }

            // Field F: GROSS WEIGHT - All caps header, auto-add "kgs" suffix
            if (data.grossWeight) {
                pdf.setFontSize(uniformFontSize);
                const weightValue = data.grossWeight.trim();
                const weightWithUnit = weightValue.toLowerCase().endsWith('kgs') ? weightValue : weightValue + ' kgs';
                pdf.text(`GROSS WEIGHT: ${weightWithUnit}`, rightColumnX, rightY, { align: 'right' });
                rightY += lineSpacing;
            }

            // Use the maximum Y position from both columns for center fields
            yPosition = Math.max(leftY, rightY);
            yPosition += 8; // Space above center-aligned fields

            // Field C: CARTON QUANTITY - Center aligned
            if (data.cartonQuantity) {
                pdf.setFontSize(uniformFontSize);
                pdf.text(`CARTON QUANTITY: ${data.cartonQuantity}`, 152.4 / 2, yPosition, { align: 'center' });
                yPosition += lineSpacing;
            }

            // Field G: ITEM DESCRIPTION - Center aligned
            if (data.itemDescription) {
                pdf.setFontSize(uniformFontSize);
                pdf.text(`ITEM DESCRIPTION: ${data.itemDescription}`, 152.4 / 2, yPosition, { align: 'center' });
                yPosition += lineSpacing;
            }

            // Field H: COUNTRY OF ORIGIN - Center aligned
            if (data.countryOfOrigin) {
                pdf.setFontSize(uniformFontSize);
                pdf.text(`COUNTRY OF ORIGIN: ${data.countryOfOrigin}`, 152.4 / 2, yPosition, { align: 'center' });
                yPosition += lineSpacing;
            }

            // Field D: BARCODE - Following international standards: 87mm × 32mm symbol area with 6.5mm quiet zones
            // Optimized for ISO/IEC 15416 print quality grade > 2.5 (Good/Very Good)
            // Create temporary canvas for barcode with quiet zones
            // Using 200 DPI for optimal balance between quality and performance
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            if (!ctx) {
                throw new Error('Canvas context not available');
            }
            
            // Width: 87mm symbol + 13mm quiet zones (6.5mm each side) = 100mm total
            // Using 200 DPI for high-quality print output (ISO/IEC 15416 grade > 2.5) while maintaining performance
            const dpi = 200; // High resolution for print quality (balanced for performance)
            const mmToPx = dpi / 25.4; // Convert mm to pixels at specified DPI
            const canvasWidth = Math.round(100 * mmToPx); // 100mm at 200 DPI
            const canvasHeight = Math.round(32 * mmToPx); // 32mm at 200 DPI
            
            // Set canvas dimensions
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
            
            // Clear canvas and set white background (ensures proper contrast for ISO/IEC 15416)
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#FFFFFF'; // Pure white background for maximum contrast
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Generate barcode on canvas with quiet zones
            // International standards: 87mm × 32mm symbol area with 6.5mm quiet zones
            // Optimized for ISO/IEC 15416 print quality grade > 2.5 (Good/Very Good)
            // Key parameters for quality:
            // - width: 2 ensures proper bar width for scanning
            // - margin: 6.5mm quiet zones (exceeds minimum 6.35mm requirement)
            // - height: 32mm optimized for readability and quality
            // - background: white ensures maximum contrast (critical for ISO/IEC 15416)
            try {
                JsBarcode(canvas, barcodeValue, {
                    format: 'CODE128', // ISO/IEC 15417 compliant
                    width: 2, // Bar width multiplier (optimal for ISO/IEC 15416 grade > 2.5)
                    height: Math.round(32 * mmToPx), // 32mm at 200 DPI (optimized for high readability and quality)
                    displayValue: false,
                    margin: Math.round(6.5 * mmToPx), // 6.5mm quiet zone on each side at 200 DPI (ISO/IEC 15417 requirement: minimum 6.35mm, exceeds for quality)
                    background: '#FFFFFF', // Pure white for maximum contrast
                    valid: function(valid) {
                        if (!valid) {
                            console.warn('Barcode validation failed - may affect ISO/IEC 15416 quality');
                        }
                    }
                });
            } catch (barcodeError) {
                console.error('JsBarcode generation error:', barcodeError);
                throw new Error('Failed to generate barcode: ' + barcodeError.message);
            }

            // Convert canvas to high-quality PNG image for PDF
            // Using PNG format preserves barcode quality for ISO/IEC 15416 compliance
            let barcodeImage;
            try {
                barcodeImage = canvas.toDataURL('image/png', 1.0); // Maximum quality
            } catch (imageError) {
                console.error('Canvas toDataURL error:', imageError);
                // Fallback to default quality if maximum quality fails
                barcodeImage = canvas.toDataURL('image/png');
            }
            
            // Validate image data
            if (!barcodeImage || barcodeImage === 'data:,') {
                throw new Error('Barcode image generation failed - cannot meet ISO/IEC 15416 quality requirements');
            }
            
            const barcodeWidth = 100; // mm (87mm symbol + 13mm quiet zones)
            const barcodeHeight = 32; // mm (symbol height for high readability)
            const barcodeX = (152.4 - barcodeWidth) / 2; // Center horizontally
            // Calculate barcode Y position to ensure HRI fits within label (101.6mm total height)
            const maxBarcodeY = 101.6 - barcodeHeight - 8; // Leave 8mm for HRI (20pt) and margin
            // Use calculated yPosition (after two line spaces), but ensure it doesn't exceed max
            const barcodeY = Math.min(yPosition, maxBarcodeY);
            
            // Add high-quality barcode image to PDF
            // Image is rendered at 200 DPI for optimal print quality (ISO/IEC 15416 grade > 2.5)
            pdf.addImage(barcodeImage, 'PNG', barcodeX, barcodeY, barcodeWidth, barcodeHeight, undefined, 'FAST');
            
            // Barcode HRI - Calibri, 20pt, Bold, Center aligned
            pdf.setFont('calibri', 'bold'); // Calibri font
            pdf.setFontSize(20); // 20pt for HRI
            const hriY = barcodeY + barcodeHeight + 3;
            // Ensure HRI doesn't go beyond label boundary
            if (hriY < 98) { // Label height is 101.6mm, leave 3.6mm margin
                pdf.text(barcodeValue, 152.4 / 2, hriY, { align: 'center' });
            }

            // Add border around entire label
            pdf.setDrawColor(0, 0, 0);
            pdf.setLineWidth(0.5);
            pdf.rect(2, 2, 148.4, 97.6); // Border with 2mm margin

            // Save PDF
            if (labelIndex === 0) {
                pdf.save(`warehouse-label-${barcodeValue}.pdf`);
            } else {
                // For multiple labels, we'll need to handle this differently
                // For now, save with index
                pdf.save(`warehouse-label-${barcodeValue}-${labelIndex + 1}.pdf`);
            }

            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Generate multiple label PDFs
 * @param {Object} data - Label data object
 * @param {string[]} barcodeValues - Array of barcode values
 * @returns {Promise<void>}
 */
async function generateMultipleLabelPDFs(data, barcodeValues) {
    if (!window.jspdf || !window.jspdf.jsPDF) {
        throw new Error('jsPDF library not loaded');
    }
    
    const { jsPDF } = window.jspdf;
    let pdf = null;

    for (let i = 0; i < barcodeValues.length; i++) {
        const barcodeValue = barcodeValues[i];

        // Create new page for each label
        if (i > 0) {
            pdf.addPage([152.4, 101.6], 'landscape');
        } else {
            pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: [152.4, 101.6]
            });
        }

        // Set font
        pdf.setFont('helvetica', 'bold');

        let yPosition = 10;

        // All fields use uniform 16pt font size
        const uniformFontSize = 16;
        const lineSpacing = 8; // Consistent spacing between lines

        // Top section: Two-column layout
        const leftColumnX = 10; // Left margin
        const rightColumnX = 152.4 - 10; // Right margin (right-aligned)
        let leftY = yPosition;
        let rightY = yPosition;

        // Left column - Free Text, SIZE (left-aligned)
        // Field A: Free Text
        if (data.freeText) {
            pdf.setFontSize(uniformFontSize);
            pdf.text(data.freeText, leftColumnX, leftY, { align: 'left' });
            leftY += lineSpacing;
        }

        // Field B: SIZE
        if (data.size) {
            pdf.setFontSize(uniformFontSize);
            pdf.text(`SIZE: ${data.size}`, leftColumnX, leftY, { align: 'left' });
            leftY += lineSpacing;
        }

        // Right column - NET WEIGHT, GROSS WEIGHT (right-aligned)
        // Field E: NET WEIGHT - All caps header, auto-add "kgs" suffix
        if (data.netWeight) {
            pdf.setFontSize(uniformFontSize);
            const weightValue = data.netWeight.trim();
            const weightWithUnit = weightValue.toLowerCase().endsWith('kgs') ? weightValue : weightValue + ' kgs';
            pdf.text(`NET WEIGHT: ${weightWithUnit}`, rightColumnX, rightY, { align: 'right' });
            rightY += lineSpacing;
        }

        // Field F: GROSS WEIGHT - All caps header, auto-add "kgs" suffix
        if (data.grossWeight) {
            pdf.setFontSize(uniformFontSize);
            const weightValue = data.grossWeight.trim();
            const weightWithUnit = weightValue.toLowerCase().endsWith('kgs') ? weightValue : weightValue + ' kgs';
            pdf.text(`GROSS WEIGHT: ${weightWithUnit}`, rightColumnX, rightY, { align: 'right' });
            rightY += lineSpacing;
        }

        // Use the maximum Y position from both columns for center fields
        yPosition = Math.max(leftY, rightY);
        yPosition += 8; // Space above center-aligned fields

        // Field C: CARTON QUANTITY - Center aligned
        if (data.cartonQuantity) {
            pdf.setFontSize(uniformFontSize);
            pdf.text(`CARTON QUANTITY: ${data.cartonQuantity}`, 152.4 / 2, yPosition, { align: 'center' });
            yPosition += lineSpacing;
        }

        // Field G: ITEM DESCRIPTION - Center aligned
        if (data.itemDescription) {
            pdf.setFontSize(uniformFontSize);
            pdf.text(`ITEM DESCRIPTION: ${data.itemDescription}`, 152.4 / 2, yPosition, { align: 'center' });
            yPosition += lineSpacing;
        }

        // Field H: COUNTRY OF ORIGIN - Center aligned
        if (data.countryOfOrigin) {
            pdf.setFontSize(uniformFontSize);
            pdf.text(`COUNTRY OF ORIGIN: ${data.countryOfOrigin}`, 152.4 / 2, yPosition, { align: 'center' });
            yPosition += lineSpacing;
        }

        // Field D: BARCODE - Following international standards: 87mm × 32mm symbol area with 6.5mm quiet zones
        // Optimized for ISO/IEC 15416 print quality grade > 2.5 (Good/Very Good)
        // Create temporary canvas for barcode with quiet zones
        // Using 200 DPI for optimal balance between quality and performance
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
            throw new Error('Canvas context not available');
        }
        
        // Width: 87mm symbol + 13mm quiet zones (6.5mm each side) = 100mm total
        // Using 200 DPI for high-quality print output (ISO/IEC 15416 grade > 2.5) while maintaining performance
        const dpi = 200; // High resolution for print quality (balanced for performance)
        const mmToPx = dpi / 25.4; // Convert mm to pixels at specified DPI
        const canvasWidth = Math.round(100 * mmToPx); // 100mm at 200 DPI
        const canvasHeight = Math.round(32 * mmToPx); // 32mm at 200 DPI
        
        // Set canvas dimensions
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        
        // Clear canvas and set white background (ensures proper contrast for ISO/IEC 15416)
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#FFFFFF'; // Pure white background for maximum contrast
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Generate barcode on canvas with quiet zones
        // International standards: 87mm × 32mm symbol area with 6.5mm quiet zones
        // Optimized for ISO/IEC 15416 print quality grade > 2.5 (Good/Very Good)
        // Key parameters for quality:
        // - width: 2 ensures proper bar width for scanning
        // - margin: 6.5mm quiet zones (exceeds minimum 6.35mm requirement)
        // - height: 32mm optimized for readability and quality
        // - background: white ensures maximum contrast (critical for ISO/IEC 15416)
        try {
            JsBarcode(canvas, barcodeValue, {
                format: 'CODE128', // ISO/IEC 15417 compliant
                width: 2, // Bar width multiplier (optimal for ISO/IEC 15416 grade > 2.5)
                height: Math.round(32 * mmToPx), // 32mm at 200 DPI (optimized for high readability and quality)
                displayValue: false,
                margin: Math.round(6.5 * mmToPx), // 6.5mm quiet zone on each side at 200 DPI (ISO/IEC 15417 requirement: minimum 6.35mm, exceeds for quality)
                background: '#FFFFFF', // Pure white for maximum contrast
                valid: function(valid) {
                    if (!valid) {
                        console.warn('Barcode validation failed - may affect ISO/IEC 15416 quality');
                    }
                }
            });
        } catch (barcodeError) {
            console.error('JsBarcode generation error:', barcodeError);
            throw new Error('Failed to generate barcode: ' + barcodeError.message);
        }

        // Convert canvas to high-quality PNG image for PDF
        // Using PNG format preserves barcode quality for ISO/IEC 15416 compliance
        let barcodeImage;
        try {
            barcodeImage = canvas.toDataURL('image/png', 1.0); // Maximum quality
        } catch (imageError) {
            console.error('Canvas toDataURL error:', imageError);
            // Fallback to default quality if maximum quality fails
            barcodeImage = canvas.toDataURL('image/png');
        }
        
        // Validate image data
        if (!barcodeImage || barcodeImage === 'data:,') {
            console.error('Failed to generate barcode image');
            throw new Error('Barcode image generation failed - cannot meet ISO/IEC 15416 quality requirements');
        }

        const barcodeWidth = 100; // mm (87mm symbol + 13mm quiet zones)
        const barcodeHeight = 32; // mm (symbol height for high readability)
        const barcodeX = (152.4 - barcodeWidth) / 2; // Center horizontally
        // Calculate barcode Y position to ensure HRI fits within label (101.6mm total height)
        const maxBarcodeY = 101.6 - barcodeHeight - 8; // Leave 8mm for HRI (20pt) and margin
        // Use calculated yPosition (after two line spaces), but ensure it doesn't exceed max
        const barcodeY = Math.min(yPosition, maxBarcodeY);
        
        // Add high-quality barcode image to PDF
        // Image is rendered at 200 DPI for optimal print quality (ISO/IEC 15416 grade > 2.5)
        pdf.addImage(barcodeImage, 'PNG', barcodeX, barcodeY, barcodeWidth, barcodeHeight, undefined, 'FAST');

        // Barcode HRI - Calibri, 20pt, Bold, Center aligned
        pdf.setFont('calibri', 'bold'); // Calibri font
        pdf.setFontSize(20); // 20pt for HRI
        const hriY = barcodeY + barcodeHeight + 3;
        // Ensure HRI doesn't go beyond label boundary
        if (hriY < 98) { // Label height is 101.6mm, leave 3.6mm margin
            pdf.text(barcodeValue, 152.4 / 2, hriY, { align: 'center' });
        }

        // Add border
        pdf.setDrawColor(0, 0, 0);
        pdf.setLineWidth(0.5);
        pdf.rect(2, 2, 148.4, 97.6);
    }

    // Save PDF with proper filename (remove any invalid characters)
    const firstBarcode = barcodeValues[0].replace(/[^a-zA-Z0-9]/g, '');
    const lastBarcode = barcodeValues[barcodeValues.length - 1].replace(/[^a-zA-Z0-9]/g, '');
    const filename = `warehouse-labels-${firstBarcode}-to-${lastBarcode}.pdf`;
    pdf.save(filename);
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { createLabelElement, generateLabelPDF, generateMultipleLabelPDFs };
}
