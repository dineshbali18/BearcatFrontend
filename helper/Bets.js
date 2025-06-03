import { API } from '../backend';

/**
 * Fetch user bets with optional offset.
 * @param {string} token - Auth token
 * @param {number} offset - Pagination offset (default: 0)
 */
export const getUserBets = (token, offset = 0) => {
  return fetch(`${API}/v1/user/bets?offset=${offset}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `${token}`,
    },
  })
    .then((response) => response.json())
    .catch((err) => {
      console.log('Error fetching bets:', err);
    });
};

/**
 * Fetch user withdraw requests with optional offset.
 * @param {string} token - Auth token
 * @param {number} offset - Pagination offset (default: 0)
 */
export const getUserWithdrawRequests = (token, offset = 0) => {
  return fetch(`${API}/v1/user/requests?offset=${offset}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `${token}`,
    },
  })
    .then((response) => response.json())
    .catch((err) => {
      console.log('Error fetching withdraw requests:', err);
    });
};


// import {API} from '../backend';

// export const getUserBets=(token) => {
//   return fetch(`${API}/v1/user/bets`, {
//     mode: 'cors',
//     method: 'GET',
//     headers: {
//       'Accept': 'application/json',
//       'Access-Control-Allow-Origin': '*',
//       'Authorization': `${token}`
//     },
//   }).then((response) => {
//     //console logging response can give a Error in log so try to comment the code that is actually printing response
//     // console.log(response);
//     console.log("000000",response)
//     return response.json();
//   })
//       .catch((err) => {
//         console.log('Error', err);
//       }); ;
// }

// export const getUserWithdrawRequests=(token) => {
//   return fetch(`${API}/v1/user/requests`, {
//     mode: 'cors',
//     method: 'GET',
//     headers: {
//       'Accept': 'application/json',
//       'Access-Control-Allow-Origin': '*',
//       'Authorization': `${token}`
//     },
//   }).then((response) => {
//     //console logging response can give a Error in log so try to comment the code that is actually printing response
//     // console.log(response);
//     console.log("000000",response)
//     return response.json();
//   })
//       .catch((err) => {
//         console.log('Error', err);
//       }); ;
// }