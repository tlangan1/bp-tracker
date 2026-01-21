#!/usr/bin/env node
/**
 * HTTPS server for the Blood Pressure Tracker app
 * Usage: node https_server.js
 */

const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const PORT = 8443;
const CERTFILE = "192.168.1.79.pem";
const KEYFILE = "192.168.1.79-key.pem";

// MIME types
const mimeTypes = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".txt": "text/plain",
};

// Generate self-signed certificate if it doesn't exist
function generateCertificate() {
  if (!fs.existsSync(CERTFILE) || !fs.existsSync(KEYFILE)) {
    console.log(
      "SSL certificate not found. Generating self-signed certificate..."
    );
    try {
      execSync(
        `openssl req -new -x509 -keyout ${KEYFILE} -out ${CERTFILE} -days 365 -nodes -subj "/CN=localhost"`,
        { stdio: "inherit" }
      );
      console.log(`Certificate generated: ${CERTFILE}`);
    } catch (error) {
      console.error(
        "Error generating certificate. Make sure openssl is installed."
      );
      process.exit(1);
    }
  }
}

// Request handler
function requestHandler(req, res) {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);

  // Parse URL
  let filePath = "." + req.url;
  if (filePath === "./") {
    filePath = "./index.html";
  }

  // Get file extension
  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = mimeTypes[extname] || "application/octet-stream";

  // Read and serve file
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === "ENOENT") {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end("<h1>404 - File Not Found</h1>", "utf-8");
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${error.code}`, "utf-8");
      }
    } else {
      res.writeHead(200, {
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*",
      });
      res.end(content, "utf-8");
    }
  });
}

// Get local IP address
function getLocalIP() {
  const { networkInterfaces } = require("os");
  const nets = networkInterfaces();

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Skip internal and non-IPv4 addresses
      if (net.family === "IPv4" && !net.internal) {
        return net.address;
      }
    }
  }
  return "YOUR_LOCAL_IP";
}

// Main function
function main() {
  // Generate certificate if needed
  generateCertificate();

  // Load SSL credentials
  const options = {
    key: fs.readFileSync(KEYFILE),
    cert: fs.readFileSync(CERTFILE),
  };

  // Create HTTPS server
  const server = https.createServer(options, requestHandler);

  // Start server
  server.listen(PORT, "0.0.0.0", () => {
    const localIP = getLocalIP();

    console.log("\n" + "=".repeat(60));
    console.log("HTTPS Server started successfully!");
    console.log("=".repeat(60));
    console.log(`Local access:     https://localhost:${PORT}`);
    console.log(`Network access:   https://${localIP}:${PORT}`);
    console.log("=".repeat(60));
    console.log("\nNote: You'll see a security warning because this is a");
    console.log("self-signed certificate. Click 'Advanced' and 'Proceed'.");
    console.log("\nPress Ctrl+C to stop the server\n");
  });

  // Handle graceful shutdown
  process.on("SIGINT", () => {
    console.log("\n\nShutting down server...");
    server.close(() => {
      console.log("Server stopped.");
      process.exit(0);
    });
  });
}

// Run the server
main();
