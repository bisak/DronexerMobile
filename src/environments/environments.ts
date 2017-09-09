
const env = 'dev';

export function getEnv() {
  if (env === 'dev') {
    return {
      production: false,
      development: true,
      apiUrl: 'http://192.168.0.103:8080/api'
    };
  } else if (env === 'prod') {
    return {
      production: true,
      development: false,
      apiUrl: 'https://dronexer.com/api'
    };
  }
}
