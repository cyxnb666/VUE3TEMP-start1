import request from '@/request/index'


// Get verification code
export const getVerifyCode = (jsessionid: string) => {
  return request.get('/web/auth/getVerifyCode', {
    responseType: 'blob',
    headers: {
      jsessionid: jsessionid
    }
  })
}

// Login
export const login = (data: any) => {
  return request.post('/web/auth/login', data)
}