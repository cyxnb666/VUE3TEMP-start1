import request from '@/request/index'

// Get file preview (for video, images, etc.)
export function getFilePreview(fileId: string) {
    return request({
        url: '/web/file/preview',
        method: 'post',
        responseType: 'blob',
        data: {
            condition: {
                primaryKey: fileId
            }
        }
    });
}