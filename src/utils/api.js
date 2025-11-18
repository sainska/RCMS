// Prefer configured base; otherwise use current origin to avoid port mismatches
export const API_BASE = import.meta.env.VITE_API_BASE || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5000');

// Store JWT token in localStorage
const getToken = () => {
  return localStorage.getItem('rcms_token');
};

const setToken = (token) => {
  localStorage.setItem('rcms_token', token);
};

const removeToken = () => {
  localStorage.removeItem('rcms_token');
};

// Get current user from token
const getCurrentUser = () => {
  try {
    const token = getToken();
    if (!token) return null;
    
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch (error) {
    console.error('Error parsing token:', error);
    removeToken();
    return null;
  }
};

// Enhanced API fetch with authentication
export async function apiFetch(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const token = getToken();
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }
  
  const config = {
    headers: defaultHeaders,
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  };
  
  try {
    const res = await fetch(url, config);
    
    // Handle unauthorized responses
    if (res.status === 401) {
      removeToken();
      window.location.href = '/login';
      throw new Error('Session expired. Please login again.');
    }
    
    // Handle other error responses
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${res.status}: ${res.statusText}`);
    }
    
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return res.json();
    }
    return res.text();
  } catch (error) {
    console.error('API fetch error:', error);
    throw error;
  }
}

// Authentication functions
export const authAPI = {
  login: async (email, password) => {
    const response = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    setToken(response.token);
    localStorage.setItem('rcms_user', JSON.stringify(response.user));
    return response;
  },
  
  register: async (userData) => {
    const response = await apiFetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    
    setToken(response.token);
    localStorage.setItem('rcms_user', JSON.stringify(response.user));
    return response;
  },
  
  logout: () => {
    removeToken();
    localStorage.removeItem('rcms_user');
  },
  
  getCurrentUser,
  isAuthenticated: () => !!getToken()
};

// Project API functions
export const projectAPI = {
  getAll: () => apiFetch('/api/projects'),
  create: (projectData) => apiFetch('/api/projects/create', {
    method: 'POST',
    body: JSON.stringify(projectData)
  }),
  updateStatus: (id, status) => apiFetch(`/api/projects/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status })
  }),
  getById: (id) => apiFetch(`/api/projects/${id}`)
};

// Milestone API functions
export const milestoneAPI = {
  getByProject: (projectId) => apiFetch(`/api/progress/${projectId}`),
  create: (milestoneData) => apiFetch('/api/milestones', {
    method: 'POST',
    body: JSON.stringify(milestoneData)
  }),
  update: (id, data) => apiFetch(`/api/milestones/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  approve: (id) => apiFetch(`/api/milestones/${id}/approve`, {
    method: 'PUT'
  })
};

// Payment API functions
export const paymentAPI = {
  initiateMpesa: (paymentData) => apiFetch('/api/payments/mpesa/stkpush', {
    method: 'POST',
    body: JSON.stringify(paymentData)
  }),
  getHistory: () => apiFetch('/api/payments'),
  create: (paymentData) => apiFetch('/api/payments', {
    method: 'POST',
    body: JSON.stringify(paymentData)
  })
};

// Material Request API functions
export const materialAPI = {
  createRequest: (requestData) => apiFetch('/api/materials/request', {
    method: 'POST',
    body: JSON.stringify(requestData)
  }),
  getRequests: () => apiFetch('/api/materials/requests'),
  approveRequest: (id) => apiFetch(`/api/materials/requests/${id}/approve`, {
    method: 'PUT'
  })
};

// File Upload API functions
export const fileAPI = {
  uploadPhotos: (formData) => {
    const token = getToken();
    return fetch(`${API_BASE}/api/photos/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    }).then(res => {
      if (!res.ok) throw new Error('Upload failed');
      return res.json();
    });
  },
  
  uploadDocument: (formData) => {
    const token = getToken();
    return fetch(`${API_BASE}/api/documents/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    }).then(res => {
      if (!res.ok) throw new Error('Upload failed');
      return res.json();
    });
  }
};

// Invoice API functions
export const invoiceAPI = {
  getAll: () => apiFetch('/api/invoices'),
  create: (invoiceData) => apiFetch('/api/invoices', {
    method: 'POST',
    body: JSON.stringify(invoiceData)
  }),
  approve: (id) => apiFetch(`/api/invoices/${id}/approve`, {
    method: 'PUT'
  })
};

// Transaction API functions
export const transactionAPI = {
  getAll: () => apiFetch('/api/transactions'),
  getById: (id) => apiFetch(`/api/transactions/${id}`),
  create: (transactionData) => apiFetch('/api/transactions', {
    method: 'POST',
    body: JSON.stringify(transactionData)
  })
};

// Resource API functions
export const resourceAPI = {
  getAll: () => apiFetch('/api/resources'),
  create: (resourceData) => apiFetch('/api/resources', {
    method: 'POST',
    body: JSON.stringify(resourceData)
  }),
  allocate: (id, allocationData) => apiFetch(`/api/resources/${id}/allocate`, {
    method: 'PUT',
    body: JSON.stringify(allocationData)
  }),
  return: (id, notes) => apiFetch(`/api/resources/${id}/return`, {
    method: 'PUT',
    body: JSON.stringify({ notes })
  })
};

// Utility function for handling file uploads
export const createFormData = (data, fileField = 'file') => {
  const formData = new FormData();
  
  Object.keys(data).forEach(key => {
    if (key === fileField && data[key] instanceof File) {
      formData.append(fileField, data[key]);
    } else if (typeof data[key] === 'object' && data[key] !== null) {
      formData.append(key, JSON.stringify(data[key]));
    } else {
      formData.append(key, data[key]);
    }
  });
  
  return formData;
};

// Error handling utility
export const handleApiError = (error) => {
  if (error.message.includes('Session expired')) {
    authAPI.logout();
    window.location.href = '/login';
    return 'Your session has expired. Please login again.';
  }
  
  if (error.message.includes('Failed to fetch')) {
    return 'Unable to connect to the server. Please check your internet connection.';
  }
  
  return error.message || 'An unexpected error occurred. Please try again.';
};
