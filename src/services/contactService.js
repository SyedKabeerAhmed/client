import { buildApiUrl, API_CONFIG } from '../config/api'

const handleResponse = async (response) => {
  const data = await response.json()

  if (!response.ok) {
    if (response.status === 400 && data.errors) {
      const message = data.errors.map((error) => error.msg || error.message).join(', ')
      throw new Error(message)
    }

    throw new Error(data.message || 'Failed to send message')
  }

  return data
}

export const contactService = {
  submit: async (payload) => {
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.CONTACT.SUBMIT), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    return handleResponse(response)
  }
}

export default contactService
