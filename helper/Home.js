import { useSelector } from "react-redux";
import { API } from "../backend";
import { apiRequest } from "../utils/apiClient";
// import { useSelector } from "react-redux";
// ✅ Custom hook to get the token from Redux
// const token = useSelector((state)=>state.user.token)

// 🧩 WINNER
export const getWinner = async (lotteryId, token) => {
  return apiRequest(`${API}/v1/lottery/winner`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: token,
    },
    body: JSON.stringify({ lottery_id: lotteryId }),
  });
};

// 🧩 LAST LOTTERY ID
export const getLotteryID = async () => {
  return apiRequest(`${API}/v1/last/lottery/id`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });
};

// 🧩 ADD MONEY
export const addMoneyAPICall = async (amount, token) => {
  return apiRequest(`${API}/v1/user/add/money/transaction`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: token,
    },
    body: JSON.stringify({
      amount_deposited: amount,
      amount_withdrawl: 0,
    }),
  });
};

// 🧩 USER BETS
export const getUserBets = async (token) => {
  return apiRequest(`${API}/v1/user/bets`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: token,
    },
  });
};

// 🧩 PLACE BET
export const placeBet = async (bidData, token) => {
  console.log("999999999", bidData);
  return apiRequest(`${API}/v1/place/bet`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: token,
    },
    body: JSON.stringify(bidData),
  });
};

// 🧩 WALLET BALANCE
export const getWalletAmount = async (token) => {
  return apiRequest(`${API}/v1/user/wallet/balance`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: token,
    },
  });
};

// 🧩 HOME DATA
export const getHomeData = async (token) => {
  return apiRequest(`${API}/v1/user/home-data`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: token,
    },
  });
};
