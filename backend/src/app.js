const express = require("express");
const cors = require("cors");
const { errorHandler } = require("./middelware/errorHandler.middelware.js");

const app = express();
const corsOptions = {
    origin: ["http://localhost:5173", "http://localhost:5174", "https://samadhaangroups.co.in", "https://www.samadhaangroups.co.in"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

const adminRouter = require("./routes/admin.routes.js");
const enquiryRouter = require("./routes/enquiry.routes.js");
const landRouter = require("./routes/land.routes.js");
const homeRouter = require("./routes/home.routes.js");
const propertyRouter = require("./routes/property.routes.js");
const galleryRouter = require("./routes/gallery.routes.js");
const constructionFilterRouter = require("./routes/constructionFilter.routes.js");
const rentFilterRouter = require("./routes/rentFilter.routes.js");
const sellFilterRouter = require("./routes/sellFilter.routes.js");

app.use("/api/v1/admin/", adminRouter);
app.use("/api/v1/enquiry/", enquiryRouter);
app.use("/api/v1/constructionFilter/", constructionFilterRouter);
app.use("/api/v1/rentFilter/", rentFilterRouter);
app.use("/api/v1/sellFilter/", sellFilterRouter);
app.use("/api/v1/land/", landRouter);
app.use("/api/v1/home/", homeRouter);
app.use("/api/v1/property/", propertyRouter);
app.use("/api/v1/gallery/", galleryRouter);

app.use(errorHandler);

module.exports = app;
