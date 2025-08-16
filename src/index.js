var express = require("express");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
var app = express();
app.set("port", process.env.PORT || 1024);

app.use(express.json());

const asteroidUrl = "https://mnstrr.uber.space";
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "mnstrr API",
      version: "1.0.0",
      description:
        "A simple Express playground server for experimentation and testing. Runs on Uberspace.",
    },
    servers: [
      {
        url: asteroidUrl + "/api",
        description: "Live server",
      },
      {
        url: "http://localhost:" + (process.env.PORT || 1024),
        description: "Local Server",
      },
    ],
  },
  apis: ["src/index.js"],
};

const specs = swaggerJsdoc(swaggerOptions);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));

/**
 * @swagger
 * /advice:
 *   get:
 *     summary: Life advice endpoint
 *     description: Returns delightfully questionable life advice
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 advice:
 *                   type: string
 *                   example: "Always trust a computer program"
 */
app.get("/advice", function (req, res) {
  const advice = [
    "Always trust a computer program",
    "When in doubt, restart the server",
    "Coffee is a vegetable",
    "The best code is no code",
    "Error messages are just suggestions",
  ];
  const randomAdvice = advice[Math.floor(Math.random() * advice.length)];
  res.json({ advice: randomAdvice });
});

app.listen(app.get("port"), "0.0.0.0", function () {
  console.log("Started on port %s", app.get("port"));
});
