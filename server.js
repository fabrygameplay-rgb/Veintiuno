const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const express = require("express");

const app = express();

app.use(express.json());
app.use(express.static("public"));

app.get("/api/test", (req, res) => {
    res.json({ message: "Server running" });
});

app.get("/api/search", async (req, res) => {
    try {
        const q = req.query.q;

        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5`;

        const response = await fetch(url, {
            headers: {
                "User-Agent": "PetWatchApp/1.0"
            }
        });

        const data = await response.json();
        res.json(data);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Search failed" });
    }
});

app.get("/api/real-places", async (req, res) => {
    try {
        const { lat, lng } = req.query;

        // fallback si no se manda ubicación
        const latitude = lat || -7.1617;
        const longitude = lng || -78.5128;

        const query = `
        [out:json];
        (
          node["amenity"="veterinary"](around:5000,${latitude},${longitude});
          node["amenity"="animal_shelter"](around:5000,${latitude},${longitude});
          node["amenity"="police"](around:5000,${latitude},${longitude});
          node["amenity"="fire_station"](around:5000,${latitude},${longitude});
          node["amenity"="hospital"](around:5000,${latitude},${longitude});
        );
        out;
        `;

        const response = await fetch("https://overpass-api.de/api/interpreter", {
            method: "POST",
            body: query
        });

        const json = await response.json();

        const places = json.elements.map(el => ({
            name: el.tags?.name || "Sin nombre",
            lat: el.lat,
            lng: el.lon,
            type: el.tags?.amenity
        }));

        res.json(places);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error getting real places" });
    }
});

app.post("/api/report", (req, res) => {
    const { lat, lng, description } = req.body;

    console.log("New Pet:", lat, lng, description);

    res.json({ status: "ok" });
});

app.get("/api/news", async (req, res) => {
    try {
        const response = await fetch("https://gnews.io/api/v4/search?q=animales&lang=es&token=TU_API_KEY");
        const data = await response.json();

        res.json(data.articles);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "News fetch failed" });
    }
});

app.listen(4000, () => {
    console.log("http://localhost:4000");
});