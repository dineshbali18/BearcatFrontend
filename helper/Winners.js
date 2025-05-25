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
