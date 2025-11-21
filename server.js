const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 5000;
const API_BASE = "https://fakestoreapi.com";  // FIXED ✔

app.use(cors());
app.use(express.json());

const axiosConfig = {
  headers: { "User-Agent": "Mozilla/5.0" }
};

// Products list
app.get('/api/products', async (req, res) => {
    try {
      const { category, sort } = req.query;
  
      // Fetch all products
      const response = await axios.get(`${API_BASE}/products`, axiosConfig);
      let products = response.data;
  
      // 1. FILTER BY CATEGORY
      if (category) {
        const cats = category.split(',');
        products = products.filter(p => cats.includes(p.category));
      }
  
      // 2. SORTING
      if (sort === "price_asc") {
        products.sort((a, b) => a.price - b.price);
      }
      if (sort === "price_desc") {
        products.sort((a, b) => b.price - a.price);
      }
  
      return res.json(products);
  
    } catch (err) {
      console.error("API ERROR:", err.message);
      return res.status(500).json({ error: "Server failed" });
    }
  });
  

// Single product
app.get("/api/products/:id", async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE}/products/${req.params.id}`, axiosConfig);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Error fetching product" });
  }
});

// Categories
app.get("/api/categories", async (req, res) => {
    try {
      const response = await axios.get(`${API_BASE}/products/categories`, axiosConfig);
      res.json(response.data);  // returns ["electronics","jewelery","mens clothing","womens clothing"]
    } catch (err) {
      console.error("CATEGORY ERROR:", err.message);
      res.status(500).json([]);
    }
  });
  

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
