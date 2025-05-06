import { API } from "../backend";

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJlbWFpbCI6ImRpbmVzaGJhbGk0NEBnbWFpbC5jb20iLCJleHAiOjE3NDkxMjYyMDZ9.m3D77bX8E0voh3YAIjXMNCsivvdl0-r3RuTVXNZarNQ";

export const getPaginatedLotteries = async (page = 1, limit = 20) => {
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
