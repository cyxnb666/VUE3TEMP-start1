import request from '@/request/index'

// Get file preview (for video, images, etc.)
export const getFilePreview = (primaryKey: string) => {
  return request.post('/file/preview', {
    condition: {
      primaryKey: primaryKey
    }
  }, {
    responseType: 'blob'
  })
}