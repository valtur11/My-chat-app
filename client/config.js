const configs = {
  base_api_url: process.env.NEXT_PUBLIC_base_api_url || 'http://192.168.1.10:8081/api',//It was 1.17
  APP_SERVER_KEY: process.env.NEXT_PUBLIC_APP_SERVER_KEY
};

export default configs;
