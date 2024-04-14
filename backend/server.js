const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const adminRouter = require("./routes/admin");
const indexRouter = require("./routes/index");

const app = express();

const PORT = process.env.PORT || 8080;

// const corsOptions = {
//     origin: "http://localhost:4200",
// };

// app.options('*', cors());
// app.use(cors(corsOptions));
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

app.get("/", (req, res) => {
    res.json({message: "Dobrodosli v Plohl app."});
});

// set port, listen for requests
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
