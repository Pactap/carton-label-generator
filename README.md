# Carton Label Generator

v1.1.1

Warehouse carton label generator for suppliers, distribution centers, and logistics operations.

**Live Site**: [https://umendra-singh.github.io/carton-label-generator/](https://umendra-singh.github.io/carton-label-generator/)

## Specifications

### Label Dimensions
- **Physical Size**: 6 inches × 4 inches (152.4 mm × 101.6 mm)
- **Orientation**: Landscape
- **Rendering**: Exact physical dimensions, no scaling

### Layout Requirements
- All elements horizontally center-aligned
- Solid black rectangular border around full label
- Content does not touch border
- Fixed layout (no responsive behavior)
- All measurements in absolute units (mm or pt)

### Fields (Exact Format)

1. **Free Text (Field A)**
   - No header
   - Font: 36pt, Bold, Arial
   - User input
   - Example: "MAX"

2. **SIZE (Field B)**
   - Format: "SIZE: <value>"
   - Font: 28pt, Bold, Arial
   - User input
   - Example: "SIZE: LARGE"

3. **CARTON QUANTITY (Field C)**
   - Format: "CARTON QUANTITY: <value>"
   - Font: 28pt, Bold, Arial
   - User input
   - Example: "CARTON QUANTITY: 200 Pcs"

4. **BARCODE (Field D)**
   - Code 128 symbology
   - ISO/IEC 15417 compliant
   - Outer block: 100 mm × 60 mm
   - Symbol area: 87 mm × 37 mm
   - Quiet zone: 6.5 mm minimum on left and right (ISO/IEC 15417 requirement)
   - HRI: 20pt, Bold, Arial, below barcode, center-aligned
   - System generated, sequential, unique
   - Supports prefix (e.g., "17MX173057" + sequential number)

5. **NET WEIGHT (Field E)**
   - Format: "Net Weight: <value>" (Title Case)
   - Font: 24pt, Bold, Arial
   - User input
   - Example: "Net Weight: 16.9 Kg"

6. **GROSS WEIGHT (Field F)**
   - Format: "Gross Weight: <value>" (Title Case)
   - Font: 24pt, Bold, Arial
   - User input
   - Example: "Gross Weight: 17.9 Kg"

7. **ITEM DESCRIPTION (Field G)**
   - Format: "Item Description: <value>" (Title Case)
   - Font: 22pt, Bold, Arial
   - User input
   - Example: "Item Description: Paper Bag"

8. **COUNTRY OF ORIGIN (Field H)**
   - Format: "Country Of Origin: <value>" (Title Case)
   - Font: 22pt, Bold, Arial
   - User input
   - Example: "Country Of Origin: India"

### Barcode Specifications
- **Symbology**: Code 128 (ISO/IEC 15417 compliant)
- **Compliance**: 
  - ISO/IEC 15417 (structure and encoding)
  - ISO/IEC 15416 (print quality, minimum grade 2.5)
  - Quiet zone: Minimum 6.35mm (implementation uses 6.5mm)
- **Sequencing**: Auto-incrementing, unique, persistent (localStorage)
- **Format**: 
  - With prefix: `<prefix><8-digit-sequence>` (e.g., "17MX1730570000101")
  - Without prefix: `<8-digit-sequence>` (e.g., "00000001")
- **Prefix Support**: Optional alphanumeric prefix (max 20 characters)
- **Starting Sequence**: Configurable starting number for sequential generation

### Output
- Print-ready PDF
- Exact 6 × 4 inch page size
- One label per page
- No scaling during export
- Suitable for thermal and standard printers

## Usage

1. Open `index.html` in a modern web browser
2. Fill in all required fields:
   - Free Text
   - Size
   - Carton Quantity
   - Net Weight
   - Gross Weight
   - Item Description
   - Country of Origin
   - **Barcode Prefix** (optional): e.g., "17MX173057"
   - **Starting Sequence Number** (optional): Starting number for sequential barcodes (default: 1)
   - Number of Cartons
3. Click "Preview Label" to see the label before printing
4. Click "Export PDF" to generate PDF file(s) with sequential barcodes

### Barcode Prefix and Series Generation

- **Prefix**: Enter an alphanumeric prefix (e.g., "17MX173057") that will be prepended to all barcodes
- **Starting Sequence**: Set the starting number for sequential generation (e.g., 1, 100, 1000)
- **Series Generation**: When generating multiple labels, barcodes will increment sequentially
  - Example with prefix "17MX173057" and start 1:
    - Label 1: 17MX17305700000001
    - Label 2: 17MX17305700000002
    - Label 3: 17MX17305700000003

## Technical Details

### Dependencies
- jsPDF 2.5.1 (PDF generation)
- JsBarcode 3.11.5 (Code 128 barcode generation)

### File Structure
- `index.html` - Main application interface
- `styles.css` - Label styling and layout
- `app.js` - Application controller and form handling
- `barcode.js` - Barcode generation and sequence management
- `label.js` - Label rendering and PDF generation

### Browser Compatibility
- Modern browsers with ES6+ support
- localStorage support required for barcode persistence

## Notes

- Barcode sequence persists across browser sessions using localStorage
- Preview shows the next barcode without incrementing the sequence
- PDF export generates sequential barcodes for the specified number of cartons
- All text is rendered exactly as entered (no auto-formatting)

## Deployment

This application is hosted on **GitHub Pages** and deploys automatically from the `main` branch.

**Live URL**: [https://umendra-singh.github.io/carton-label-generator/](https://umendra-singh.github.io/carton-label-generator/)

To run locally, open `index.html` directly or use any static file server.