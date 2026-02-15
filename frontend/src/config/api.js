// API configuration - handles both localhost and network access
export const getAPIBaseURL = () => {
  const hostname = window.location.hostname;
  const port = 5000;
  
  // If running on localhost, use localhost:5000
  // If running on an IP address, use that IP with port 5000
  return `http://${hostname}:${port}`;
};

export const API_BASE_URL = getAPIBaseURL();
