import express, { Request, Response, NextFunction } from "express";
import { json, urlencoded } from "body-parser";
import vendorRoutes from "./routes/vendorRoute";
import mongoose from "mongoose";

const port = 3000;
const url = "mongodb://localhost:27017/Mpa_Cash";
const app = express();

app.use(express.json());
app.use(urlencoded({ extended: true }));

app.use("/api/vendor", vendorRoutes);

// app.post("/vendor/create", (req: Request, res: Response) => {
//   res.send("sure");
//   console.log(req.body);
// });
// app.get("/vendor/create", (req: Request, res: Response) => {
//   res.send("sure");
//   //   console.log(req.body);
// });

mongoose
  .connect(url)
  .then(() => {
    console.log("successfully connected the database");

    app.listen(3000, () => {
      console.log("app running on Port 3000");
    });
  })
  .catch((err) => console.log(err));

//database connection
