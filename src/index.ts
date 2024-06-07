import express, { NextFunction, Request, Response } from "express";
import logger from "morgan";
import dayjs from "dayjs";
import cors from "cors";
// import swaggerUi, { SwaggerUiOptions } from "swagger-ui-express";
import cookieParser from "cookie-parser";
import path from "path";
import router from "./router";
const app = express();
const port = process.env.PORT || 3030;

app.use(cors());
app.use(express.urlencoded({ extended: false }));
const ParseJson = (req: Request, res: Response, next: NextFunction) => {
  const errorHandler = (err: Error | null) => {
    if (err instanceof Error) {
      res.status(400).send({ msg: err.message });
      return;
    }
    next();
  };
  express.json()(req, res, errorHandler);
};
app.use(ParseJson);
app.use(express.static("public"));
app.use(
  logger(function (tokens, req, res) {
    return [
      dayjs().format("MMM DD hh:mm:ss A"),
      tokens.url(req, res),
      tokens.method(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
    ].join(" - ");
  })
);
app.use(cookieParser());
app.use("/",router)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
});


// const options: SwaggerUiOptions = {
//   customSiteTitle: "HospitalityHub",
//   customfavIcon: "/hotel.png",
// };
// app.use("/docs", swaggerUi.serve, swaggerUi.setup(generator, options));

app.listen(port, () => {
  console.log(`I AM RUNNING ON http://localhost:${port}`);
});
export default app;
