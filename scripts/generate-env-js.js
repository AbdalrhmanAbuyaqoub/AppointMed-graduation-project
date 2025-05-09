const fs = require("fs");
const path = require("path");

// Read the .env file
require("dotenv").config();

// Create the content for env.js
const envContent = `window.env = {
  REACT_APP_API_URL: "${
    process.env.REACT_APP_API_URL || "http://localhost:3000/api"
  }"
};`;

// Write to public/env.js
fs.writeFileSync(path.join(__dirname, "../public/env.js"), envContent);
