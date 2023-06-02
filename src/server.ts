import express, { Request, Response, NextFunction } from "express";
import { json, urlencoded } from "body-parser";
import vendorRoutes from "./routes/vendorRoute";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Application } from "express-serve-static-core";

dotenv.config();

const port = process.env.PORT;
const url: any = process.env.URL;
const app = express();
app.use(express.json());
app.use(urlencoded({ extended: true }));

app.use("/api/vendor", vendorRoutes);

mongoose
  .connect(url)
  .then(() => {
    console.log("successfully connected the database");

    app.listen(port, () => {
      console.log(`app running on Port ${port}`);
    });
  })
  .catch((err) => console.log(err));

//database connection
