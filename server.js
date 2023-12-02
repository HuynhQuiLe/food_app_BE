const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");

const rootRouter = require("./source/routers/rootRouter");

const app = express();

const PORT = process.env.PORT || 8686;

// middelware
app.use(express.json());
app.use(cors());

app.use(rootRouter);

app.listen(PORT, (req, res) => {
  console.log(`Server is running on PORT ${PORT}`);
});
