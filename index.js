const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const routes = require("./src/routes");
const connectDB = require("./src/config/db.config");
const PORT = process.env.PORT || 3000;

// Connect to database
connectDB();

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/uploads", express.static("uploads"));

// Swagger documentation setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "SeatWaves Project API",
      version: "1.0.0",
      description: "API documentation for the Node.js project",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
      {
        url: `https://seatwaves.onrender.com`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/routes/*.js"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// API routes
app.use("/api", routes);


app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📚 API documentation available at http://localhost:${PORT}/api-docs`);
});

module.exports = app; 