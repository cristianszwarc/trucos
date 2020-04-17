
let baseUrl = process.env.API_URL;
const getBaseUrl = () => {
  if (!baseUrl) {
    const scripts= document.getElementsByTagName('script');
    const path= scripts[scripts.length-1].src.split('?')[0];
    baseUrl = path.split('/').slice(0, -1).join('/');
  }
  return baseUrl;
};

export default {
  getBaseUrl
};
