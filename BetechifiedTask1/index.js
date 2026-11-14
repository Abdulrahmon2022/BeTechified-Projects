const express = require("express");
const app = express();

app.use(express.json());

const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT;



app.get("/", (req, res) => {
  res.json({ message: "My Week 2 API!" });
});

app.post("/user", (req, res) => {
    const { name, email } = req.body || {};
    if (!name || !email) {
        return res.status(400).json({ error: "Name and email are required."});
    }
    return res.status(201).json({ message: `Hello, ${name}! Your email is ${email}.` });
});

app.get("/user/:id", (req, res) => {
    const { id } = req.params;
    res.json({ message: `User ID is ${id}.` });
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
