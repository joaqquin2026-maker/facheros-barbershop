require("dotenv").config();

const express = require("express");
const cors = require("cors");
const Replicate = require("replicate");

const app = express();

app.use(cors());
app.use(express.json());

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

app.get("/", (req, res) => {
  res.send("Servidor de Fachero's funcionando.");
});
app.post("/generar", async (req, res) => {
  try {
    const { imagen, prompt } = req.body;

    const output = await replicate.run(
      "black-forest-labs/flux-kontext-pro",
      {
        input: {
          input_image: imagen,
          prompt: prompt
        }
      }
    );

    res.json({
      imagen: Array.isArray(output) ? output[0] : output
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error al generar la imagen."
    });
  }
});
app.listen(3000, () => {
  console.log("Servidor iniciado en http://localhost:3000");
});