// access-token.js

let accessToken = null;

const setAccessToken = (token) => {
  accessToken = token;
  console.log("SE HA SETEADO TOKEN EN setAccessToken");  
};

const getAccessToken = () => {
  return accessToken;
};

export { setAccessToken, getAccessToken}