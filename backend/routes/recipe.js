const express = require('express');
const route = express.Router();


// import controller 
const {getRecipes} = require('../controller/getrecipe')
const {getRecipe} = require('../controller/getrecipe')
const {createRecipe,upload} = require('../controller/createrecipe')
const { editRecipe, updateUpload } = require('../controller/updaterecipe')
const {deleteRecipe} = require('../controller/deleterecipe');
const verifyToken = require('../middleware/auth');
// const { userSingup } = require('../controller/usersingup');
const { userLogin } = require('../controller/userlogin');
const { userProfile } = require('../controller/userprofile');

//define routes
route.get('/getrecipes',getRecipes)
route.get('/getrecipe/:id',getRecipe)
route.post('/createrecipe',upload.single('coverImage'),verifyToken,createRecipe)
route.put('/updaterecipe/:id', updateUpload.single('coverImage'), editRecipe);

route.delete('/deleterecipe/:id',deleteRecipe)
// route.post('/usersingup', userSingup);
route.post('/userlogin', userLogin);
route.get('/userprofile/:id', userProfile);

module.exports = route;