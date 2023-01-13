require('dotenv').config();

const express = require('express');

// Security
const helmet = require('helmet');
const cors = require('cors');
const whitelist = require('./config/whiteList')
const xss = require('xss-clean');

// Swagger UI
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
// const swaggerJsDocs = YAML.load("./api.yaml");

const nodemailer = require("nodemailer")
const app = express();
const path = require('path');
const sendEmail = require("./utils/sendEmail");
const { logger, logEvents } = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");


const corsOptions = require('./config/corsOptions');
const connectDB = require('./config/dbConn.js');
const mongoose = require('mongoose');
const PORT = process.env.PORT || PORT

// Route Import

const authRoutes = require("./routes/authRoutes");
const contactRoutes = require("./routes/contactRoutes");
const errorHandlerr = require("./middleware/errorMiddleware");


// Connecting to Database Environments

console.log(process.env.NODE_ENV)

connectDB()

// Middlewares

app.use(logger)

// Cross Origin Resource Sharing
app.use(cors(whitelist))

app.use(express.json({ limit: "30mb", extended: true}))
app.use(helmet());
app.use(xss());
app.use(cookieParser())
app.use(express.urlencoded({ limit: "30mb", extended: false}))
app.use(bodyParser.json())

app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// Routes Middleware
// app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerJsDocs));
app.use("/api/v1", authRoutes);
app.use("/api/v1", contactRoutes);


// Routes

app.use('/', express.static(path.join(__dirname, 'public')))
app.use('/', require('./routes/root'))
app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({ message: '404 Not Found' })
    } else {
        res.type('txt').send('404 Not Found')
    }
})
// Error Middleware
app.use(errorHandler)
app.use(errorHandlerr)

// Connect to MongoDB
mongoose.set("strictQuery", true);
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}...`))
})

mongoose.connection.on('error', err => {
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})