import { buildApiUrl, API_CONFIG } from '../config/api'

// Helper to get auth headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

class InstallmentService {
    async createInstallmentOrder(orderData) {
        try {
            const response = await fetch(buildApiUrl('/api/v1/installments/create'), {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(orderData)
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to create installment order');
            }
            return { success: true, data };
        } catch (error) {
            // Check if response is 403 (Forbidden)
            if (error.response && error.response.status === 403) {
                throw new Error('You are not authorized to create installment plans.');
            }
            throw error;
        }
    }

    async getPlans() {
        try {
            const response = await fetch(buildApiUrl('/api/v1/installments'), {
                method: 'GET',
                headers: getAuthHeaders()
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch plans');
            }
            return data;
        } catch (error) {
            throw error;
        }
    }

    async getPlanById(planId) {
        try {
            const response = await fetch(buildApiUrl(`/api/v1/installments/${planId}`), {
                method: 'GET',
                headers: getAuthHeaders()
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch plan detail');
            }
            return data;
        } catch (error) {
            throw error;
        }
    }

    async updateReleaseStatus(data) {
        try {
            const response = await fetch(buildApiUrl('/api/v1/installments/status/update'), {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(data)
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Failed to update status');
            }
            return result;
        } catch (error) {
            throw error;
        }
    }

    async getUpcomingSummary() {
        try {
            const response = await fetch(buildApiUrl('/api/v1/installments/upcoming-summary'), {
                headers: getAuthHeaders()
            });
            const result = await response.json();
            return result;
        } catch (error) {
            throw error;
        }
    }

    async payRemainingBalance(planId) {
        try {
            const response = await fetch(buildApiUrl('/api/v1/installments/pay-remaining'), {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ planId })
            });
            const result = await response.json();
            return result;
        } catch (error) {
            throw error;
        }
    }

    async recordPayment(paymentData) {
        try {
            const response = await fetch(buildApiUrl('/api/v1/installments/record-payment'), {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(paymentData)
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to record payment');
            }
            return { success: true, data };
        } catch (error) {
            throw error;
        }
    }
}

export const installmentService = new InstallmentService();
