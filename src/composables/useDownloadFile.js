import { sanitizeFilename } from '@/helpers/utils'
import { catchError } from '../helpers/catchResp'

export default function useDownloadFile() {
  return {
    downloadFile: (apiURL, data = null) => {
      catchError(async () => {
        const response = await apiURL(data)
        const file = response.data.data
        window.location.href = file
      })
    },

    downloadBlobFile: (apiURL, data = null, filename = null) => {
      catchError(async () => {
        const response = await apiURL(data)
        // Cek header Content-Disposition untuk filename
        const disposition = response.headers['content-disposition']
        let finalFilename = filename

        if (disposition && disposition.includes('filename=')) {
          const filenameMatch = disposition.match(/filename="?([^"]+)"?/)

          if (filenameMatch?.[1]) {
            finalFilename = sanitizeFilename(filenameMatch[1])
          }
        }

        if (!finalFilename) {
          if (typeof apiURL === 'string') {
            const urlParts = apiURL.split('/')
            finalFilename = urlParts[urlParts.length - 1] || 'download'
          } else {
            finalFilename = 'download'
          }
        }

        const blob = new Blob([response.data])
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', finalFilename)
        document.body.appendChild(link)
        link.click()
        link.remove()
      })
    },
  }
}
