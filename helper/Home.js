import {API} from '../backend';

const token ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJlbWFpbCI6ImRpbmVzaGJhbGk0NEBnbWFpbC5jb20iLCJleHAiOjE3NDkxMjYyMDZ9.m3D77bX8E0voh3YAIjXMNCsivvdl0-r3RuTVXNZarNQ';

export const getwinner=(lotteryId)=>{
  return fetch(`${API}/v1/lottery/winner`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `${token}`,
    },
    body: JSON.stringify({lottery_id: lotteryId}),
  }).then((response) => {
    // console.log(response);
    return response.json();
  })
      .catch((err) => {
        console.log(err);
      }); ;
};

export const getLotteryID = () => {
  return fetch(`${API}/v1/last/lottery/id`, {
    mode: 'cors',
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  }).then((response) => {
    //console logging response can give a Error in log so try to comment the code that is actually printing response
    // console.log(response);
    return response.json();
  })
      .catch((err) => {
        console.log('Error', err);
      }); ;
};

export const addMoneyAPICall=(userID, amount)=>{
  // user id gets automatically fetched from backend
  // usign the token we are passing update the token
  // as needed ...

  console.log('Token:0', token);
  console.log('UserID', userID);
  console.log('Amount', amount);
  return fetch(`${API}/v1/user/add/money/transaction`, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      Authorization: `${token}`,
    },
    body: JSON.stringify({'amount_deposited': amount, 'amount_withdrawl': 0}),
  }).then((res)=>{
    return res.json();
  }).catch((err)=> {
    console.log(err);
  });
};

export const getUserBets=(token) => {
  return fetch(`${API}/v1/user/bets`, {
    method: 'get',
    headers: {
      Accept: 'application/json',
      Authorization: `${token}`,
    },
    body: JSON.stringify(token),
  });
};

export const placeBet=(bidData) => {
  return fetch(`${API}/v1/place/bet`, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      Authorization: `${token}`,
    },
    body: JSON.stringify(bidData),
  }).then((res)=>{
    return res.json();
  }).catch((err)=> {
    console.log(err);
  });
}

export const getWalletAmount=() => {
  return fetch(`${API}/v1/user/wallet/balance`, {
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


export const getHomeData = async () => {
  try {
    const response = await fetch(`${API}/v1/user/home-data`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `${token}`,
      },
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.log('Error fetching home data:', err);
    return null;
  }
};


// const response = await fetch(`${API}/v1/user/home-data`, {
//   method: 'GET',
//   headers: {
//     'Authorization': `${token}`,
//   },
// }).then((response) => {
//   //console logging response can give a Error in log so try to comment the code that is actually printing response
//   // console.log(response);
//   console.log("000000",response)
//   return response.json();
// })
//     .catch((err) => {
//       console.log('Error', err);
//     }); ;
