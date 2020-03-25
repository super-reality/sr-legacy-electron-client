require("dotenv").config();

const app = require("express")();

app.get("/", (request, response) => response.send("Hello, Express!"));

app.listen(process.env.PORT, () => console.log(`Server listening on port ${process.env.PORT}`));
