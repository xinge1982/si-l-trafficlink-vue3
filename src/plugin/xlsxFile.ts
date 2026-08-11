type CellValue = string | number | boolean | Date | null | undefined
type SheetRows = CellValue[][]

interface WorkBook {}

interface WorkSheet {}

interface XlsxLibrary {
    utils: {
        book_new: () => WorkBook
        aoa_to_sheet: (rows: SheetRows) => WorkSheet
        book_append_sheet: (
            workbook: WorkBook,
            worksheet: WorkSheet,
            sheetName: string,
        ) => void
    }
    writeFile: (workbook: WorkBook, filename: string) => void
}

type WorkbookData = Record<string, SheetRows>

function normalizeSheetName(name: string, index: number): string {
    const normalized = name.replace(/[\\/?*\[\]:]/g, '_').trim()
    return (normalized || `Sheet${index + 1}`).slice(0, 31)
}

function normalizeFileName(fileName: string): string {
    const normalized = fileName.trim() || 'export'
    return normalized.toLowerCase().endsWith('.xlsx')
        ? normalized
        : `${normalized}.xlsx`
}

function xlsxFile(
    XLSX: XlsxLibrary,
    fileName: string,
    workbookData: WorkbookData,
): void {
    const workbook = XLSX.utils.book_new()
    const entries = Object.entries(workbookData)

    entries.forEach(([sheetName, rows], index) => {
        const worksheet = XLSX.utils.aoa_to_sheet(rows)
        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            normalizeSheetName(sheetName, index),
        )
    })

    XLSX.writeFile(workbook, normalizeFileName(fileName))
}

export default {
    xlsxFile,
}
