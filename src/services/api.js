// Professional Client API Service SDK for CropCare
// Centralized HTTP client communicating with backend /api endpoints
// Returns ONLY required filtered data on-demand per route

const API_BASE = '/api';

class ApiClient {
  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    // Attach session token if available
    try {
      const session = JSON.parse(localStorage.getItem('cropcare_auth_session') || '{}');
      if (session?.token) {
        headers['Authorization'] = `Bearer ${session.token}`;
      }
    } catch (_) {}

    const config = {
      ...options,
      headers
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const res = await fetch(url, config);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || `Request failed with status ${res.status}`);
      }
      return data;
    } catch (err) {
      console.warn(`API [${config.method || 'GET'} ${endpoint}] notice:`, err.message);
      throw err;
    }
  }

  get(endpoint, params = {}) {
    const search = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        search.append(key, val);
      }
    });
    const qs = search.toString();
    return this.request(qs ? `${endpoint}?${qs}` : endpoint, { method: 'GET' });
  }

  post(endpoint, body = {}) {
    return this.request(endpoint, { method: 'POST', body });
  }

  patch(endpoint, body = {}) {
    return this.request(endpoint, { method: 'PATCH', body });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

const client = new ApiClient();

export const api = {
  // Issues API (Fetch only farmer's issues, or by status / department)
  issues: {
    getAll: async (filter = {}) => {
      const res = await client.get('/issues', filter);
      return res.data;
    },
    getById: async (id) => {
      const res = await client.get(`/issues/${id}`);
      return res.data;
    },
    create: async (issueData) => {
      const res = await client.post('/issues', issueData);
      return res.data;
    },
    addUpdate: async (issueId, updateData) => {
      const res = await client.post(`/issues/${issueId}/updates`, updateData);
      return res.data;
    },
    update: async (issueId, fields) => {
      const res = await client.patch(`/issues/${issueId}`, fields);
      return res.data;
    }
  },

  // Expert Diagnoses API
  expert: {
    getAll: async (filter = {}) => {
      const res = await client.get('/expert-responses', filter);
      return res.data;
    },
    create: async (responseData) => {
      const res = await client.post('/expert-responses', responseData);
      return res.data;
    }
  },

  // Research Cases API
  research: {
    getAll: async (filter = {}) => {
      const res = await client.get('/research-cases', filter);
      return res.data;
    },
    getById: async (id) => {
      const res = await client.get(`/research-cases/${id}`);
      return res.data;
    },
    create: async (caseData) => {
      const res = await client.post('/research-cases', caseData);
      return res.data;
    },
    update: async (id, fields) => {
      const res = await client.patch(`/research-cases/${id}`, fields);
      return res.data;
    }
  },

  // Departments API
  departments: {
    getAll: async () => {
      const res = await client.get('/departments');
      return res.data;
    },
    create: async (deptData) => {
      const res = await client.post('/departments', deptData);
      return res.data;
    },
    delete: async (id) => {
      const res = await client.delete(`/departments/${id}`);
      return res.success;
    }
  },

  // Knowledge Base Articles API
  knowledge: {
    getAll: async (filter = {}) => {
      const res = await client.get('/knowledge-base', filter);
      return res.data;
    },
    getById: async (id) => {
      const res = await client.get(`/knowledge-base/${id}`);
      return res.data;
    },
    vote: async (id, isHelpful) => {
      const res = await client.post(`/knowledge-base/${id}/vote`, { isHelpful });
      return res.data;
    }
  },

  // Notifications API (Fetches ONLY user-specific notifications)
  notifications: {
    getAll: async (filter = {}) => {
      const res = await client.get('/notifications', filter);
      return res.data;
    },
    markRead: async (id) => {
      const res = await client.patch(`/notifications/${id}/read`);
      return res.data;
    }
  },

  // Dashboards API (Dedicated KPI calculation per role)
  dashboard: {
    getFarmer: async (farmerId) => {
      const res = await client.get('/dashboard/farmer', { farmerId });
      return res.data;
    },
    getExpert: async (expertId) => {
      const res = await client.get('/dashboard/expert', { expertId });
      return res.data;
    },
    getAdmin: async () => {
      const res = await client.get('/dashboard/admin');
      return res.data;
    }
  },

  // Users & Scientific Panel Directory API
  users: {
    getAll: async (filter = {}) => {
      const res = await client.get('/users', filter);
      return res.data;
    },
    updateStatus: async (id, status) => {
      const res = await client.patch(`/users/${id}/status`, { status });
      return res.data;
    },
    delete: async (id) => {
      const res = await client.delete(`/users/${id}`);
      return res.success;
    }
  }
};
