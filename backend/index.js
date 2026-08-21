// Compatibility shim: newer Node (24/26+) removed the deprecated `SlowBuffer`
// API, which an old transitive dependency (buffer-equal-constant-time, via
// jsonwebtoken → jwa) still references at load time. Point it at Buffer so the
// module loads instead of crashing. Must run before requiring anything that
// pulls in jsonwebtoken.
const nodeBuffer = require("buffer");
if (!nodeBuffer.SlowBuffer) {
  nodeBuffer.SlowBuffer = nodeBuffer.Buffer;
}

const dotenv = require("dotenv");
const connectDB = require("./src/db/config.db.js");
const app = require("./src/app");
const { errorHandler } = require("./src/middelware/errorHandler.middelware.js");

// Load environment variables from .env file
dotenv.config({ path: "./.env" });

console.log(`PORT from .env: ${process.env.PORT}`);

// app.use(errorHandler);


const startServer = async () => {
  try {
    await connectDB();
    app.listen(process.env.PORT, () => {
      console.log(`✅ Server is running on port ${process.env.PORT}`);
    });

    // 🔥 Test response at the root endpoint
    app.get("/", (req, res) => {
      res.status(200).json({ message: "Server is up and running!" });
    });
  } catch (err) {
    console.error("❌ Server failed to start", err);
  }
};

startServer();