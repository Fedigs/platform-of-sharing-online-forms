const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");

dotenv.config({ path: "./config.env" });
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
).replace("<DATABASE_NAME>", process.env.DATABASE_NAME);
mongoose
  //connection à atlas mongodb
  //.connect(DB, {
  //connection à bd local
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })

  .then(() => {
    console.log("DB connection successful !");
  });

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`app is running on port ${port}...`);
});
