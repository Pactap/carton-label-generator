# Warehouse Carton Label System - Specifications

## LABEL SPECIFICATIONS

### Physical Dimensions
- **Width**: 6 inches (152.4 mm)
- **Height**: 4 inches (101.6 mm)
- **Orientation**: Landscape
- **Rendering**: Exact physical dimensions, no scaling allowed

### Layout
- **Alignment**: All elements horizontally center-aligned
- **Border**: Solid black rectangular border (2px/0.5mm) around entire label
- **Padding**: 8px margin from border to content
- **Layout Type**: Fixed layout (no responsive behavior)
- **Measurements**: Absolute units only (mm or pt)

---

## FIELD SPECIFICATIONS

### Field A: Free Text
- **Format**: No header, plain text
- **Font**: Arial (fallback: Helvetica, sans-serif)
- **Size**: 16pt
- **Weight**: Bold
- **Color**: Black (#000)
- **Alignment**: Center
- **Type**: User input, static

### Field B: SIZE
- **Format**: "SIZE: <value>"
- **Font**: Arial (fallback: Helvetica, sans-serif)
- **Size**: 16pt
- **Weight**: Bold
- **Color**: Black (#000)
- **Alignment**: Center
- **Type**: User input, static

### Field C: CARTON QUANTITY
- **Format**: "CARTON QUANTITY: <value>"
- **Font**: Arial (fallback: Helvetica, sans-serif)
- **Size**: 16pt
- **Weight**: Bold
- **Color**: Black (#000)
- **Alignment**: Center
- **Type**: User input, static

### Field D: BARCODE
- **Format**: Code 128 symbology
- **Compliance**: ISO/IEC 15417 (structure), ISO/IEC 15416 (print quality, minimum grade 2.5)
- **Symbol Area**: 87 mm × 37 mm (per image specification)
- **Quiet Zone**: 6.5 mm minimum on left and right (24.57px at 96 DPI)
- **Total Width**: 100 mm (87mm symbol + 13mm quiet zones)
- **HRI (Human Readable Interpretation)**:
  - Font: Calibri, Bold, 24pt (per image specification)
  - Position: Below barcode
  - Alignment: Center
  - Gap from barcode: 3-6px
  - Must exactly match barcode value
- **Type**: System generated, dynamic, sequential
- **Position**: Second half of label (below text fields)

### Field E: NET WEIGHT
- **Format**: "Net Weight: <value>" (Title Case)
- **Font**: Arial (fallback: Helvetica, sans-serif)
- **Size**: 16pt
- **Weight**: Bold
- **Color**: Black (#000)
- **Alignment**: Center
- **Type**: User input, static

### Field F: GROSS WEIGHT
- **Format**: "Gross Weight: <value>" (Title Case)
- **Font**: Arial (fallback: Helvetica, sans-serif)
- **Size**: 16pt
- **Weight**: Bold
- **Color**: Black (#000)
- **Alignment**: Center
- **Type**: User input, static

### Field G: ITEM DESCRIPTION
- **Format**: "Item Description: <value>" (Title Case)
- **Font**: Arial (fallback: Helvetica, sans-serif)
- **Size**: 16pt
- **Weight**: Bold
- **Color**: Black (#000)
- **Alignment**: Center
- **Type**: User input, static

### Field H: COUNTRY OF ORIGIN
- **Format**: "Country Of Origin: <value>" (Title Case)
- **Font**: Arial (fallback: Helvetica, sans-serif)
- **Size**: 16pt
- **Weight**: Bold
- **Color**: Black (#000)
- **Alignment**: Center
- **Type**: User input, static

---

## BARCODE SPECIFICATIONS

### Format
- **Symbology**: Code 128
- **Standard Compliance**: 
  - ISO/IEC 15417 (structure and encoding)
  - ISO/IEC 15416 (print quality, minimum grade 2.5)

### Structure
- **Prefix**: User-defined alphanumeric prefix (e.g., "25MX2433669")
- **Sequence**: 7-digit zero-padded numeric sequence
- **Format**: `<prefix><7-digit-sequence>`
- **Example**: 
  - Prefix: `25MX2433669`
  - Sequence: `11` → padded to `0000011`
  - Full barcode: `25MX24336690000011`
  - Next: `25MX24336690000012`
  - And so on...

### Generation Rules
- **Sequential**: Auto-incrementing
- **Unique**: No duplicates allowed
- **Persistent**: Last used value stored in localStorage
- **Starting Sequence**: Configurable (default: 1)
- **Padding**: Always 7 digits with leading zeros

### Physical Dimensions
- **Outer Block**: 100 mm × 60 mm
- **Symbol Area**: 87 mm × 32 mm (reduced to fit HRI)
- **Quiet Zone**: 6.5 mm minimum on each side
- **Bar Width**: 2px multiplier
- **Rendering**: SVG or Canvas (no CSS scaling/transform)

### HRI (Human Readable Interpretation)
- **Font**: Arial, Bold, 12pt
- **Position**: Directly below barcode symbol
- **Alignment**: Center
- **Content**: Exact match of barcode value
- **Gap**: 3-6px vertical spacing from barcode

---

## LAYOUT STRUCTURE

### Field Order (Top to Bottom)
1. Free Text (Field A)
2. SIZE (Field B)
3. CARTON QUANTITY (Field C)
4. NET WEIGHT (Field E)
5. GROSS WEIGHT (Field F)
6. ITEM DESCRIPTION (Field G)
7. COUNTRY OF ORIGIN (Field H)
8. BARCODE (Field D) - Second half of label
9. BARCODE HRI - Below barcode

### Spacing
- **Between Fields**: 6px margin-bottom
- **Line Height**: 1.4
- **Text Fields Container**: First 50% of label height
- **Barcode Container**: Second 50% of label height

---

## FONT SPECIFICATIONS

### Universal Font Settings
- **Family**: Arial (fallback: Helvetica, sans-serif)
- **Weight**: Bold only
- **Color**: Black (#000) only
- **Size**: 16pt (uniform across all text fields)
- **HRI Size**: 12pt (reduced to fit within label)
- **Alignment**: Center (all fields)

---

## PDF OUTPUT SPECIFICATIONS

### Page Settings
- **Size**: 152.4 mm × 101.6 mm (6 × 4 inches)
- **Orientation**: Landscape
- **Unit**: Millimeters
- **Scaling**: None (exact dimensions)

### Content
- **One label per page**
- **Border**: 2mm margin, 0.5mm line width
- **Font**: Helvetica Bold (PDF equivalent of Arial)
- **Text Spacing**: 8mm between lines
- **Barcode**: PNG image embedded at exact dimensions

---

## TECHNICAL IMPLEMENTATION

### Barcode Generation
- **Library**: JsBarcode 3.11.5
- **Format**: CODE128
- **Validation**: Code 128 compliance checking
- **Storage**: localStorage for sequence persistence

### PDF Generation
- **Library**: jsPDF 2.5.1
- **Format**: PDF/A compatible
- **Output**: Print-ready PDF files

### Browser Requirements
- Modern browser with ES6+ support
- localStorage support required
- Canvas/SVG support required

---

## FIELD RESTRICTIONS

### Allowed Fields (Only These)
- A. Free Text
- B. SIZE
- C. CARTON QUANTITY
- D. BARCODE (system generated)
- E. NET WEIGHT
- F. GROSS WEIGHT
- G. ITEM DESCRIPTION
- H. COUNTRY OF ORIGIN

### Restrictions
- No additional fields may be added
- No fields may be renamed
- No field may be removed
- Format strings must match exactly as specified

---

## BARCODE PREFIX AND SEQUENCE

### Prefix Format
- **Type**: Alphanumeric
- **Length**: Up to 20 characters
- **Example**: `25MX2433669`
- **Storage**: Persisted in localStorage

### Sequence Format
- **Type**: Numeric
- **Padding**: 7 digits with leading zeros
- **Example**: `11` → `0000011`
- **Increment**: +1 for each label
- **Storage**: Persisted in localStorage

### Full Barcode Format
- **Pattern**: `<prefix><7-digit-sequence>`
- **Example**: `25MX2433669` + `0000011` = `25MX24336690000011`
- **Next**: `25MX2433669` + `0000012` = `25MX24336690000012`

---

## COMPLIANCE NOTES

- All specifications are strictly enforced
- No scaling, transformation, or responsive behavior
- Exact dimensions must be maintained
- Code 128 barcode must meet ISO/IEC standards
- Print quality must meet minimum grade 2.5 (ISO/IEC 15416)
