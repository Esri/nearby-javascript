const foodTypes = [
  "African Food",
  "American Food",
  "Argentinean Food",
  "Australian Food",
  "Austrian Food",
  "Bakery",
  "BBQ and Southern Food",
  "Belgian Food",
  "Bistro",
  "Brazilian Food",
  "Breakfast",
  "Brewpub",
  "British Isles Food",
  "Burgers",
  "Cajun and Creole Food",
  "Californian Food",
  "Caribbean Food",
  "Chicken Restaurant",
  "Chilean Food",
  "Chinese Food",
  "Continental Food",
  "Creperie",
  "East European Food",
  "Fast Food",
  "Filipino Food",
  "Fondue",
  "French Food",
  "Fusion Food",
  "German Food",
  "Greek Food",
  "Grill",
  "Hawaiian Food",
  "Ice Cream Shop",
  "Indian Food",
  "Indonesian Food",
  "International Food",
  "Irish Food",
  "Italian Food",
  "Japanese Food",
  "Korean Food",
  "Kosher Food",
  "Latin American Food",
  "Malaysian Food",
  "Mexican Food",
  "Middle Eastern Food",
  "Moroccan Food",
  "Other Restaurant",
  "Pastries",
  "Polish Food",
  "Portuguese Food",
  "Russian Food",
  "Sandwich Shop",
  "Scandinavian Food",
  "Seafood",
  "Snacks",
  "South American Food",
  "Southeast Asian Food",
  "Southwestern Food",
  "Spanish Food",
  "Steak House",
  "Sushi",
  "Swiss Food",
  "Tapas",
  "Thai Food",
  "Turkish Food",
  "Vegetarian Food",
  "Vietnamese Food",
  "Winery"
];

const categoryForFoodType =
  (type: string) => foodTypes.indexOf(type) > -1 ? "Food" : type;

export const iconType = (type: string = "") => {
  let icon = "help";

  const category = categoryForFoodType(type);

  switch(category) {
    case "Pizza":
      icon = "local_pizza";
      break;
    case "Hotel":
      icon = "hotel";
      break;
    case "Food":
      icon = "local_dining";
      break;
    case "Coffee Shop":
      icon = "local_cafe";
      break;
  } 

  return icon;
};
