const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const categoryRoute = require("./routes/categories");
const multer = require("multer");
const path = require("path");
const PORT = process.env.PORT || 5000


// Load environment variables from a .env file
dotenv.config();
app.use(express.json());
app.use("/images", express.static(path.join(__dirname,"/images")));




// connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
    // useUnifiedTopology: true,
    // useFindAndModify: true,
})


.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.log("Error connecting to MongoDB",err.message));



// Upload the images
const storage = multer.diskStorage({
    destination:(req, file, cb) => {
        cb(null, path.join(__dirname, "images"));
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name);
    },
});

const upload = multer({ storage: storage });
app.post("/server/upload", upload.single("file"), (req, res) => {
    res.status(200).json("File has been uploaded");
});


// JSON requests
// app.use(express.json());


// use Route
app.use("/server/auth", authRoute);
app.use("/server/users", userRoute);
app.use("/server/posts", postRoute);
app.use("/server/categories", categoryRoute);


// start the server
app.listen(PORT, () => {
    console.log(`Backend is running on port ${PORT}`);
}); 