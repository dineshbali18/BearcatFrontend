import { API } from "../backend";

export const getPaginatedLotteries = async (page = 1, limit = 20,token) => {
  const res = await fetch(`${API}/v1/previous/lotteries?page=${page}&limit=${limit}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `${token}`, // ✅ Always prefix with Bearer
    },
  });

  if (!res.ok) {
    console.error("API Error:", res.status);
    throw new Error("Failed to fetch");
  }

  return res.json();
};

export const getActiveUPIIds = async (token) => {
  // console.log("00000000",token)
  const res = await fetch(`${API}/v1/user/upi-ids`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `${token}`, // if auth is required
    },
  });
// console.log("AAAAA",res.data)
  if (!res.ok) {
    throw new Error("Failed to fetch UPI IDs");
  }

  return res.json(); // returns string[]
};
