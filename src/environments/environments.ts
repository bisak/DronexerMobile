//let env = 'dev';
let env = 'prod';

export function getEnv() {
  if (env === 'dev') {
    return {
      production: false,
      development: true,
      apiUrl: 'http://192.168.122.241:8080/api'
    };
  } else if (env === 'prod') {
    return {
      production: true,
      development: false,
      apiUrl: 'https://dronexer.com/api'
    };
  }
}
