const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require("ejs-mate");
const mongoose = require('mongoose');
const multer = require("multer");
const asyncWrap = require("./utils/asyncWrap.js");

const Contact = require("./models/contact.js");
const Student = require("./models/resume");
const port = process.env.PORT || 3000;


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//routes
const frox = require("./routes/frox.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));
app.engine("ejs", ejsMate);



require('dotenv').config();
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch(err => console.error("MongoDB Connection Error:", err));

//bimfrox route
app.use("/frox", frox)



app.post("/students", upload.single("resume"), async (req, res) => {
    try {
        const { name, email, phone } = req.body;

        const newStudent = new Student({
            name: name,
            email: email,
            phone: phone,
            resume: {
                data: req.file.buffer, // Resume ka actual data
                contentType: req.file.mimetype, // File ka type (PDF/DOCX)
            }
        });

        await newStudent.save();
        res.redirect("/frox");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error submitting form");
    }
});





app.listen(port, () => {
    console.log(`Server is now listening on port ${port}`);
})