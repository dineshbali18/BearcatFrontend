import {API} from '../backend';

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