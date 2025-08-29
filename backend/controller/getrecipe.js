const Recipe = require("../model/recipe");

exports.getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find();

    res.status(200).json({
      success: true,
      data: recipes,
      Message: "Entire Recipe Data is fetched",
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.getRecipe = async (req, res) => {
  try {
     // extract recipe items basis on id
    const id = req.params.id;
    const recipe = await Recipe.findById({_id: id });

    // data forgiven id not found
    if (!recipe) {
      return res.status(400).json({
        success: false,
        message: "No data found woth Given id",
      });
    }
    // data for given id found
    res.status(200).json({
      success: true,
      data: recipe,
      Message: `Recipe ${id} data successfully fetched`,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
