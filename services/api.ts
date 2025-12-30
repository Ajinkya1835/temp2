
const API_BASE = '/api';

// Detect if we are in a standalone preview/frontend-only environment
const isPreviewMode = !window.location.origin.includes(':5000') && !window.location.origin.includes(':80');

const getAuthHeader = () => {
  const saved = localStorage.getItem('pvms_auth');
  if (!saved) return {};
  try {
    const { token } = JSON.parse(saved);
    return { 'Authorization': `Bearer ${token}` };
  } catch {
    return {};
  }
};

// Internal Mock Storage for Preview Mode (Simulating MongoDB in LocalStorage)
const getMockData = (key: string) => {
  const data = localStorage.getItem(`mock_${key}`);
  if (!data && key === 'violations') {
    const initial = [
      {
        _id: 'VIO-7721',
        title: 'Unauthorized Floor Addition',
        description: 'Building 4th floor on a 3-floor permit. Visible structure deviation.',
        status: 'REPORTED',
        evidenceUrls: ['https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&w=800&q=80'],
        location: { lat: 28.6139, lng: 77.2090, address: 'Connaught Place, Delhi' },
        createdAt: new Date().toISOString()
      },
      {
        _id: 'VIO-8832',
        title: 'Sidewalk Encroachment',
        description: 'Commercial shop extended onto public path by 5 feet.',
        status: 'VERIFIED',
        fineAmount: 25000,
        evidenceUrls: ['https://images.unsplash.com/photo-1590079015191-f7f5a8a36222?auto=format&fit=crop&w=800&q=80'],
        location: { lat: 28.5355, lng: 77.2410, address: 'Nehru Place, Delhi' },
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ];
    localStorage.setItem(`mock_${key}`, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(data || '[]');
};

const setMockData = (key: string, data: any) => localStorage.setItem(`mock_${key}`, JSON.stringify(data));

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  get: async (endpoint: string) => {
    if (isPreviewMode) {
      await delay(300);
      if (endpoint === '/violations' || endpoint === '/violations/stats') return getMockData('violations');
      return [];
    }

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, { headers: getAuthHeader() });
      if (!res.ok) throw new Error('API Error');
      return res.json();
    } catch (err) {
      return getMockData('violations'); // Final fallback
    }
  },

  post: async (endpoint: string, data: any, isMultipart = false) => {
    if (isPreviewMode) {
      await delay(500);
      if (endpoint === '/auth/login') {
        const roles: any = {
          'admin@pvms.gov.in': 'Super_Admin',
          'meera@ulb.gov.in': 'Municipal_Officer',
          'rajesh@citizen.in': 'Citizen'
        };
        const email = data.email || 'citizen@demo.in';
        return {
          _id: 'mock_u_' + Date.now(),
          name: email.split('@')[0].toUpperCase(),
          email: email,
          role: roles[email] || 'Citizen',
          token: 'mock_jwt_token_' + Date.now()
        };
      }
      
      if (endpoint === '/upload/evidence') {
        const violations = getMockData('violations');
        const newV = {
          _id: 'VIO-' + Math.floor(Math.random() * 9000 + 1000),
          title: data.get ? data.get('title') : data.title,
          description: data.get ? data.get('description') : data.description,
          status: 'REPORTED',
          evidenceUrls: ['https://images.unsplash.com/photo-1503387762-592dea58ef23?auto=format&fit=crop&w=800&q=80'],
          createdAt: new Date().toISOString(),
          location: { lat: 28.6139, lng: 77.2090, address: 'Detected Location' }
        };
        violations.unshift(newV);
        setMockData('violations', violations);
        return { violation: newV };
      }
      return { success: true };
    }

    const headers: any = getAuthHeader();
    if (!isMultipart) headers['Content-Type'] = 'application/json';

    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers,
      body: isMultipart ? data : JSON.stringify(data)
    });
    return res.json();
  },

  patch: async (endpoint: string, data: any) => {
    if (isPreviewMode) {
      const id = endpoint.split('/').filter(Boolean).pop();
      const violations = getMockData('violations');
      const idx = violations.findIndex((v: any) => v._id === id);
      if (idx !== -1) {
        violations[idx] = { ...violations[idx], ...data };
        setMockData('violations', violations);
        return violations[idx];
      }
      return { success: true };
    }

    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'PATCH',
      headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  }
};
