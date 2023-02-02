const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });
require("express-async-errors");
const app = require("./app");
const { sequelize } = require("./models");

const server_port = process.env.PORT || 2999;

app.listen(server_port, () => {
  sequelize
    .sync()
    .then(() => console.log("Mysql database is connected."))
    .catch((err) =>
      console.log(`Server is unreachable.. Error: ${err.message}`)
    ); //{ force: true }

  console.log(`Server running on http://localhost:${server_port}`);
});
