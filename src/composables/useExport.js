import * as XLSX from 'xlsx'

export function useExport() {
  /**
   * @param {Array} data Array of objects to export
   * @param {String} filename Filename without extension
   */
  function exportToExcel(data, filename = 'dados') {
    if (!data || data.length === 0) return

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(data)

    // Calculate column widths
    const colWidths = Object.keys(data[0]).map(key => {
      const maxLen = Math.max(
        key.length,
        ...data.map(row => String(row[key] ?? '').length)
      )
      return { wch: Math.min(maxLen + 4, 50) }
    })
    ws['!cols'] = colWidths

    // Create workbook and append sheet
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Aurea Finance')

    // Generate binary array and trigger download manually via Blob
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([wbout], { type: 'application/octet-stream' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}.xlsx`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return { exportToExcel }
}
