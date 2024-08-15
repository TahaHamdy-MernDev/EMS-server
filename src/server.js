require("dotenv").config();
const connectDB = require("./config/database");

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION! Shutting down...");
  console.error(err.name, err.message, err.stack);
  process.exit(1);
}); 
const app = require('./config/app');
const PORT = process.env.PORT || 3000;
connectDB();
const server = app.listen(PORT, () => {
  console.info(`[server]: Running at http://localhost:${PORT}`);
});    

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION! Shutting down...");
  console.error(err.name, err.message, err.stack);
  server.close(() => {
    process.exit(1);  
  });
});
