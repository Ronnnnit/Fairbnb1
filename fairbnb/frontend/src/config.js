const config = {
  apiUrl: process.env.NODE_ENV === 'production'
    ? 'https://your-vercel-domain.vercel.app/api'
    : process.env.REACT_APP_NGROK_URL || 'http://localhost:5001/api'
};

export default config; 