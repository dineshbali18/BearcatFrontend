import {API} from '../backend';

const token ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJlbWFpbCI6ImRpbmVzaGJhbGk0NEBnbWFpbC5jb20iLCJleHAiOjE3NDkxMjYyMDZ9.m3D77bX8E0voh3YAIjXMNCsivvdl0-r3RuTVXNZarNQ';

export const getUserBets=() => {
  return fetch(`${API}/v1/user/bets`, {
    mode: 'cors',
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Authorization': `${token}`
    },
  }).then((response) => {
    //console logging response can give a Error in log so try to comment the code that is actually printing response
    // console.log(response);
    console.log("000000",response)
    return response.json();
  })
      .catch((err) => {
        console.log('Error', err);
      }); ;
}