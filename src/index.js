var express = require("express");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const { advice, jokes } = require("./data"); 
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
app.use("/docs/swagger-ui", express.static(__dirname + '/../dist/swagger-ui'));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

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
  const randomAdvice = advice[Math.floor(Math.random() * advice.length)];
  res.json({ advice: randomAdvice });
});


/**
 * @swagger
 * /joke:
 *   get:
 *     summary: Get a random joke
 *     description: Returns a random joke from an in‑memory list.
 *     responses:
 *       200:
 *         description: A joke in JSON format.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Joke'
 *       500:
 *         description: Unexpected server error
 *
 * components:
 *   schemas:
 *     Joke:
 *       type: object
 *       required:
 *         - setup
 *         - punchline
 *       properties:
 *         setup:
 *           type: string
 *           example: "Why don't scientists trust atoms?"
 *         punchline:
 *           type: string
 *           example: "Because they make up everything!"
 */
app.get('/joke', (req, res) => {
  try {
    const randomIndex = Math.floor(Math.random() * jokes.length);
    const joke = jokes[randomIndex];
    res.json(joke);
  } catch (err) {
    console.error('Error fetching joke:', err);
    res.status(500).json({ error: 'Something went wrong!' });
  }
});


// ---------------------------------------------------------------------------
// Start server
// ---------------------------------------------------------------------------
const PORT = app.get("port");
app.listen(PORT, "0.0.0.0", function () {
  console.log("Started on port %s", PORT);
  if (process.env.NODE_ENV !== "production") {
    console.log(`📝 Swagger docs available at http://localhost:${app.get("port")}/docs`);

  }
});
