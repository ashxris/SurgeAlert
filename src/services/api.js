const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Helper to handle API responses and throw errors cleanly
 */
async function handleResponse(response) {
  if (!response.ok) {
    let errorMessage = `API Error: ${response.status} ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData.detail) {
        // Handle FastAPI validation errors (array) or custom error details
        errorMessage = Array.isArray(errorData.detail) 
          ? errorData.detail.map(e => e.msg).join(', ') 
          : errorData.detail;
      } else if (errorData.message) {
        errorMessage = errorData.message;
      }
    } catch (e) {
      // Ignore if response is not JSON
    }
    throw new Error(errorMessage);
  }
  return response.json();
}

export const api = {
  /**
   * Submit a new emergency report
   * @param {Object} data - The report data
   * @param {string} data.user_id
   * @param {string} data.type - 'TRAFFIC' or 'ACCIDENT'
   * @param {string} data.description
   * @param {number} data.latitude
   * @param {number} data.longitude
   * @param {string} data.address
   * @param {File[]} [data.images] - Array of image files
   * @returns {Promise<Object>} The created report confirmation
   */
  async submitReport(data) {
    const formData = new FormData();
    formData.append('user_id', data.user_id || `user_${Math.random().toString(36).substring(7)}`); // Mock user ID for now
    formData.append('type', data.type);
    formData.append('description', data.description);
    formData.append('latitude', data.latitude.toString());
    formData.append('longitude', data.longitude.toString());
    formData.append('address', data.address);

    if (data.images && data.images.length > 0) {
      data.images.forEach(image => {
        formData.append('images', image);
      });
    }

    const response = await fetch(`${API_BASE_URL}/reports`, {
      method: 'POST',
      body: formData, // fetch automatically sets the correct multipart boundary header
    });

    return handleResponse(response);
  },

  /**
   * Fetch recent reports, optionally filtered by type and location
   * @param {Object} [filters]
   * @param {string} [filters.type]
   * @param {number} [filters.latitude]
   * @param {number} [filters.longitude]
   * @returns {Promise<Array>} List of reports
   */
  async getReports(filters = {}) {
    const url = new URL(`${API_BASE_URL}/reports`);
    if (filters.type) url.searchParams.append('type', filters.type);
    if (filters.latitude) url.searchParams.append('latitude', filters.latitude.toString());
    if (filters.longitude) url.searchParams.append('longitude', filters.longitude.toString());

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    return handleResponse(response);
  },

  /**
   * Check if the API and Firestore are healthy
   * @returns {Promise<Object>}
   */
  async checkHealth() {
    const response = await fetch(`${API_BASE_URL}/health/firestore`, {
      method: 'GET',
    });
    return handleResponse(response);
  }
};
