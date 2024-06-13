const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const adminRouter = require("./routes/admin");
const indexRouter = require("./routes/index");

const app = express();

const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use("/admin", adminRouter);
app.use("/", indexRouter);

/* Error handler middleware */
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(err.message, err.stack);
    res.status(statusCode).json({ message: err.message });
});

// Defaultni endpoint
app.get("/", (req, res) => {
    res.json({message: "Dobrodosli v Plohl app."});
});

// Nastavi port, cakaj na zahteve
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
