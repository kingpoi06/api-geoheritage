import express from "express";
import db from "./config/Database.js";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";

import { errorHandler } from "./middleware/errorHandler.js";
import UserRoute from "./routes/UserRoute.js";
import AuthRoute from "./routes//login/AuthRoute.js";
import TokenRoute from "./routes//login/TokenRoute.js"; // Perbarui import ini

import NewsRoute from "./routes/news/NewsRoute.js"
import GaleripotoRoute from "./routes/galeripoto/GaleripotoRoute.js";
import GalerivideoRoute from "./routes/galerivideo/GalerivideoRoute.js";
import GeoarkeologiRoute from "./routes/geoarkeologi/GeoarkeologiRoute.js";
import SosiokulturalRoute from "./routes/sosiokultural/SosiokulturalRoute.js";
import SitusbudayaRoute from "./routes/situsbudaya/SitusbudayaRoute.js";
import PetabudayaRoute from "./routes/petabudaya/PetabudayaRoute.js";


dotenv.config();

const app = express();
// app.use(express.static("uploads"));

// 1. Enable CORS middleware before defining routes
app.use(
  cors({
    credentials: true,
    // origin: ["http://localhost:5173", "https://isena-fktp.vercel.app"],
    origin: true,
  })
);

// 2. Set up helmet middleware
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

// 3. Use JSON middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(errorHandler);

// 4. Sync database
(async () => {
  await db.sync();
})();

// 5. Define unprotected routes
app.use(AuthRoute);
app.use(TokenRoute);

// 6. Apply middleware verification

// 7. Define protected routes
app.use(UserRoute);

app.use(NewsRoute);
app.use(GaleripotoRoute);
app.use(GalerivideoRoute);
app.use(GeoarkeologiRoute);
app.use(SosiokulturalRoute);
app.use(SitusbudayaRoute);
app.use(PetabudayaRoute);

const PORT = process.env.APP_PORT;
app.listen(PORT, () => {
  console.log(`Server up and running on port ${PORT}`);
});
