import express from "express";
import cors from "cors";
import { universalFilter } from "./src/controllers/search.controller.js";
import "./src/db/database.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.get("/search", universalFilter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
