require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { GoogleGenAI } = require("@google/genai");

const app = express();

app.use(cors());

app.use(express.json({ limit: "50mb" }));


const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.get("/", (req, res) => {
  res.send("Servidor Gemini funcionando.");
});

app.post("/generar", async (req, res) => {
  try {
    const { imagen, prompt } = req.body;

    if (!imagen) {
      return res.status(400).json({
        error: "No se recibió ninguna imagen.",
      });
    }

    const base64 = imagen.split(",")[1];

    const respuesta = await ai.models.generateContent({
      model: "gemini-3.1-flash-image",
      contents: [
        {
          text: prompt,
        },
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64,
          },
        },
      ],
    });

    for (const part of respuesta.parts) {
      if (part.inlineData) {
        return res.json({
          imagen: `data:$
          {part.inlineData.mimeType};base64,$ {part.inlineData.data}`,
        });
      }
    }

    res.status(500).json({
      error: "Gemini no devolvió ninguna imagen.",
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: err.message,
    });
  }
});

app.listen(3000, () => {
  console.log("Servidor iniciado en http://localhost:3000");
});