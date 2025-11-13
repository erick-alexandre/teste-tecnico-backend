import * as XLSX from "xlsx"
import path from "path"

export interface XlsxData {
    sessionId: string
    source: string
    campaign: string
    medium: string
    content: string
    created_at: string
}

export function readXlsxFile() {
    const filePath = path.resolve(__dirname, "../assets/[Nemu] Base de dados.xlsx")
    const workbook = XLSX.readFile(filePath)
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    const jsonData = XLSX.utils.sheet_to_json<Record<string, any>>(sheet)

    const normalized: XlsxData[] = jsonData.map((row) => ({
        sessionId: row["sessionId"] ?? "",
        source: row["utm_source"] ?? "",
        campaign: row["utm_campaign"] ?? "",
        medium: row["utm_medium"] ?? "",
        content: row["utm_content"] ?? "",
        created_at: row["createdAt"] ?? ""
    }))

    return normalized
}