import axios from "axios";

export default async function handler(req, res) {
  const { imdbId } = req.query;

  if (!imdbId) {
    return res.status(400).json({ error: "IMDb ID is required" });
  }

  try {
    const response = await axios.get(`https://www.omdbapi.com/`, {
      params: {
        apikey: process.env.OMDB_API_KEY,
        i: imdbId,
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error("OMDb API error:", error);
    res.status(500).json({ error: "Failed to fetch ratings" });
  }
}
