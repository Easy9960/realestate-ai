
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { OpenAI } = require("openai");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));

const Property = mongoose.model("Property", {
  builder: String,
  name: String,
  location: String,
  type: String,
  price: Number,
  size: String,
  roi: String
});

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/compare", async (req, res) => {
  const { budget, location, type } = req.body;

  const properties = await Property.find({
    location,
    type,
    price: { $lte: budget }
  });

  const aiResponse = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a real estate advisor." },
      { role: "user", content: `Compare these properties and suggest best option: ${JSON.stringify(properties)}` }
    ]
  });

  res.json({
    properties,
    recommendation: aiResponse.choices[0].message.content
  });
});

app.listen(5000, () => console.log("Server running on port 5000"));
