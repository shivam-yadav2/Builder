const express = require("express");
const cors = require("cors");
const { errorHandler } = require("./middelware/errorHandler.middelware.js");

const app = express();

// Origins allowed to call this API. Defaults cover local dev + the live sites;
// extra origins can be added via the CORS_ORIGINS env var (comma-separated)
// without touching code.
const defaultOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://samadhaangroups.co.in",
    "https://www.samadhaangroups.co.in",
    "https://rsusb2sbuildersconstructions.com",
    "https://www.rsusb2sbuildersconstructions.com",
];
const envOrigins = (process.env.CORS_ORIGINS || "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);
const allowedOrigins = [...new Set([...defaultOrigins, ...envOrigins])];

const corsOptions = {
    origin: (origin, callback) => {
        // Allow non-browser requests (curl, server-to-server) that send no Origin.
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
// Make sure CORS preflight (OPTIONS) requests are answered for every route.
app.options("*", cors(corsOptions));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

const adminRouter = require("./routes/admin.routes.js");
const enquiryRouter = require("./routes/enquiry.routes.js");
const landRouter = require("./routes/land.routes.js");
const homeRouter = require("./routes/home.routes.js");
const propertyRouter = require("./routes/property.routes.js");
const galleryRouter = require("./routes/gallery.routes.js");
const testimonialRouter = require("./routes/testimonial.routes.js");
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
app.use("/api/v1/testimonial/", testimonialRouter);

app.use(errorHandler);

module.exports = app;
