const Recipe = require('../model/recipe');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Configure multer to store uploaded files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/images'));
    },
    filename: function (req, file, cb) {
        // Create a unique filename with a timestamp and the original extension
        const filename = Date.now() + '-' + path.parse(file.originalname).name + path.parse(file.originalname).ext;
        cb(null, filename);
    }
});

// The upload middleware instance
const upload = multer({ storage: storage });

// The main function to create a recipe
const createRecipe = async (req, res) => {
    try {
        console.log(req.user);
        
        const { title, ingredients, instructions, time } = req.body;
        const coverImage = req.file;

        if (!title || !ingredients || !instructions) {
            if (coverImage) {
                fs.unlinkSync(coverImage.path);
            }
            return res.status(400).json({ message: "Title, ingredients, and instructions are required." });
        }
        
        const newRecipe = await Recipe.create({
            title,
            ingredients, 
            instructions,
            time,
            // CORRECTED: Store only the filename instead of the full path
            coverImage: coverImage ? coverImage.filename : null,
            createdBy:req.user.id
        });

        res.status(200).json({
            success: true,
            data: newRecipe,
            message: "Entry Created Successfully",
        });

    } catch (error) {
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        console.error("Server Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

module.exports = { createRecipe, upload };
