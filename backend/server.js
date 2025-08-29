const express = require('express');
require('dotenv').config();
const app = express();
const cors = require('cors');

const PORT = process.env.PORT || 3000;


// database connectn
const dbConnect = require('./config/dbcon');
dbConnect();

// middleware
app.use(express.json());
app.use(cors());
app.use(express.static("public"))
// app.use('/uploads', express.static('uploads')); 


// import routes for todos API
const recipe = require("./routes/recipe");

// mount the todos API routes
app.use("/food/v1",recipe);


app.get('/', (req, res) => {
    res.send("<h1>This is the Home Page</h1>");
});



app.listen(PORT, (err) => {
    console.log(`Server is running on port ${PORT}`);
});