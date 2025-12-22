import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/api/ratings", async (req, res) => {
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
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
