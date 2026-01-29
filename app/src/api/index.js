import apiClient from './client';

export const authApi = {
    // GET /user/sign/nonce
    getNonce: (address) => apiClient.get('/user/sign/nonce', { params: { address } }),

    // POST /user/login
    login: (data) => apiClient.post('/user/login', data),

    // POST /user/refresh-token
    refreshToken: () => apiClient.post('/user/refresh-token'),
};

export const userApi = {
    // GET /user/balance
    getBalance: () => apiClient.get('/user/balance'),

    // GET /user/txn/list
    getTransactions: (params) => apiClient.get('/user/txn/list', { params }),
};

export const kycApi = {
    // GET /fields/kyc
    getKycFields: (fiatType) => apiClient.get('/fields/kyc', { params: { fiatType } }),

    // POST /files/kyc
    uploadKycFile: (formData) => apiClient.post('/files/kyc', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),

    // POST /user/kyc/fiat
    setUserKyc: (data) => apiClient.post('/user/kyc/fiat', data),

    // GET /user/kyc/fiat/completed
    getKycStatus: (fiatType) => apiClient.get('/user/kyc/fiat/completed', { params: { fiatType } }),
};

export const remitApi = {
    // GET /card/orders/exchange/supported
    getSupportedExchange: (bankType) => apiClient.get('/card/orders/exchange/supported', { params: { bankType } }),

    // GET /oracle/price
    getPrice: (params) => apiClient.get('/oracle/price', { params }),

    // POST /card/orders/exchange/fiat
    createExchangeOrder: (data) => apiClient.post('/card/orders/exchange/fiat', data),

    // GET /card/limit
    getExchangeLimit: (params) => apiClient.get('/card/limit', { params }),
};
