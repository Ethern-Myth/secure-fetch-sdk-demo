import express from "express";
import cors from "cors";
import {secureProxyMiddleware, configureSecureEnv} from "secure-fetch-sdk";

const app = express();
app.use(cors());

app.use('/secure', express.text({ type: 'text/plain' }), secureProxyMiddleware);

// pass it via .env not add the secret in plain text
configureSecureEnv("try-not-to-laugh", true) 

app.get('/api/greet/:name', (req, res) => {
  res.json({ message: `Hello, ${req.params.name}` });
});

app.post('/api/echo', (req, res) => {
  res.json({ you_sent: req.body });
});

const port = 3000;
app.listen(port, () => console.log(`Example backend listening on port ${port}`));