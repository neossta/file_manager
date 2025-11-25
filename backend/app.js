const express = require("express");
const cors = require('cors');
const app = express();
const port = 8000;

app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

require("./routes")(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
