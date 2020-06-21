const path = require("path");
const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const QuestionnaireRouter = require("./routes/QuestionnaireRouter");
const QuestionRouter = require("./routes/QuestionRouter");
const RéponseRouter = require("./routes/RéponseRouter");
const UserRouter = require("./routes/UserRouter");
const ViewRouter = require("./routes/ViewRouter");
const cookieParser = require("cookie-parser");

const app = express();
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
//1)Global Middlewars
//middleware

//security http headers
app.use(helmet());

//serving static files
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(__dirname + "/node_modules/bootstrap/dist"));

//development logging
if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}
//limit requests from some api
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this Ip , please try again in an hour!",
});
app.use("/api", limiter);

//body parser ,reading data from body into req.body
app.use(express.json(/*{ limit: "10kb" }*/));

app.use(cookieParser());

//Data sanitization against NoSQL query injection
app.use(mongoSanitize());

//Data sanitization against xss
app.use(xss());

//prevent parameter pollution
app.use(hpp());

//test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString;
  //console.log(req.cookies.jwt);
  next();
});

//3)routes
app.use("/", ViewRouter);
app.use("/api/v1/forms/questionnaires", QuestionnaireRouter);
app.use("/api/v1/forms/questions", QuestionRouter);
app.use("/api/v1/forms/reponses", RéponseRouter);
app.use("/api/v1/forms/users", UserRouter);

//4)start server
module.exports = app;
