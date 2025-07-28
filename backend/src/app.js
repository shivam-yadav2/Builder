const express = require("express");
const cors = require("cors");
const { errorHandler } = require("./middelware/errorHandler.middelware.js");

const app = express();
const corsOptions = {
    origin: ["http://localhost:5173", "http://localhost:5174", "https://samadhaangroups.co.in", "https://www.samadhaangroups.co.in"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
// Register error-handling middleware (must be last)

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

// // Import routes (CommonJS format)
const adminRouter = require("./routes/admin.routes.js");
// const enquiryRouter = require("./routes/enquiry.routes.js");
// const categoryRouter = require("./routes/category.routes.js");
const userRouter = require("./routes/user.routes.js");
const landRouter = require("./routes/land.routes.js");
const homeRouter = require("./routes/home.routes.js");
// // Use Routes
app.use("/api/v1/admin/", adminRouter);
// app.use("/api/v1/enquiry/", enquiryRouter);
// app.use("/api/v1/category/", categoryRouter);
// app.use("/api/v1/course/", courseRouter);
app.use("/api/v1/users/", userRouter);
app.use("/api/v1/land/", landRouter);
app.use("/api/v1/home/", homeRouter);

module.exports = app;
