import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * SPREADSHEET CONVERTER
 * ──────────────────────────────────────────────────────────
 * Handles: XLSX, XLS, CSV, ODS
 *
 * Strategy:
 *  - SheetJS parses the file and extracts all sheets as JSON rows/cols
 *  - jsPDF + jspdf-autotable renders each sheet as a styled table in the PDF
 *  - Multi-sheet workbooks get one section per sheet with a heading
 */

const MARGIN = 14;

export async function convertSpreadsheet(files: File[]): Promise<Blob> {
  const doc = new jsPDF('l', 'mm', 'a4'); // landscape for wide tables
  let firstSheet = true;

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });

    for (const sheetName of workbook.SheetNames) {
      if (!firstSheet) {
        doc.addPage();
      }
      firstSheet = false;

      const worksheet = workbook.Sheets[sheetName];
      const json: string[][] = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: '',
      }) as string[][];

      if (json.length === 0) continue;

      // Title
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 30, 30);
      doc.text(`${file.name}  ›  ${sheetName}`, MARGIN, 18);

      const [headerRow, ...dataRows] = json;

      autoTable(doc, {
        head: [headerRow.map(String)],
        body: dataRows.map((row) => row.map(String)),
        startY: 24,
        margin: { left: MARGIN, right: MARGIN },
        styles: {
          fontSize: 8,
          cellPadding: 3,
          overflow: 'linebreak',
          valign: 'top',
        },
        headStyles: {
          fillColor: [79, 70, 229], // indigo
          textColor: 255,
          fontStyle: 'bold',
          fontSize: 8,
        },
        alternateRowStyles: {
          fillColor: [249, 250, 251],
        },
        tableWidth: 'auto',
      });
    }
  }

  const arrayBuffer = doc.output('arraybuffer');
  return new Blob([arrayBuffer], { type: 'application/pdf' });
}
