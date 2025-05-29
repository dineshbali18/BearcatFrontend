import { useSelector } from "react-redux";
import { API } from "../backend";
// import { useSelector } from "react-redux";
// ✅ Custom hook to get the token from Redux
// const token = useSelector((state)=>state.user.token)

// 🧩 WINNER
export const getWinner = async (lotteryId, token) => {
  try {
    const res = await fetch(`${API}/v1/lottery/winner`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ lottery_id: lotteryId }),
    });
    return await res.json();
  } catch (err) {
    console.log("getWinner error:", err);
  }
};

// 🧩 LAST LOTTERY ID
export const getLotteryID = async () => {
  try {
    const res = await fetch(`${API}/v1/last/lottery/id`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });
    return await res.json();
  } catch (err) {
    console.log("getLotteryID error:", err);
  }
};

// 🧩 ADD MONEY
export const addMoneyAPICall = async (amount, token) => {
  try {
    const res = await fetch(`${API}/v1/user/add/money/transaction`, {
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
    return await res.json();
  } catch (err) {
    console.log("addMoneyAPICall error:", err);
  }
};

// 🧩 USER BETS
export const getUserBets = async (token) => {
  try {
    const res = await fetch(`${API}/v1/user/bets`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: token,
      },
    });
    return await res.json();
  } catch (err) {
    console.log("getUserBets error:", err);
  }
};

// 🧩 PLACE BET
export const placeBet = async (bidData, token) => {
  console.log("999999999",bidData)
  try {
    const res = await fetch(`${API}/v1/place/bet`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: token,
      },
      body: JSON.stringify(bidData),
    });
    return await res.json();
  } catch (err) {
    console.log("placeBet error:", err);
  }
};

// 🧩 WALLET BALANCE
export const getWalletAmount = async (token) => {
  try {
    const res = await fetch(`${API}/v1/user/wallet/balance`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: token,
      },
    });
    console.log("TQQQQQQ",token)
    console.log("XXXXXXX",res)
    return await res.json();
  } catch (err) {
    console.log("getWalletAmount error:", err);
  }
};

// 🧩 HOME DATA
export const getHomeData = async (token) => {
  try {
    const res = await fetch(`${API}/v1/user/home-data`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: token,
      },
    });
    return await res.json();
  } catch (err) {
    console.log("getHomeData error:", err);
    return null;
  }
};
