import { GoogleAuth } from "google-auth-library";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.get("/token", async (req, res) => {
  try {
    const keyPath = path.join(__dirname, "service-account.json");
    const keyFile = fs.readFileSync(keyPath, "utf8");
    const credentials = JSON.parse(keyFile);

    const auth = new GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"]
    });

    const client = await auth.getClient();
    const token = await client.getAccessToken();

    res.json({
      access_token: token.token || token,
      expires_in: 3600
    });
  } catch (err) {
    console.error("Token error:", err);
    res.status(500).json({ error: err.toString() });
  }
});

const port = 3000;
app.listen(port, () => {
  console.log("Token API running on port", port);
});
