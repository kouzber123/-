let laptops = [];
let images = "";
const url = "https://hickory-quilled-actress.glitch.me/computers";

//create object and add function then export it as whole 1. gets all, 2. gets by specific url
const fetchApiData = {
  fetchApi: () => fetchapi(),
  fetchImages: url => fetchImage(url)
};
const fetchapi = async () => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    laptops = data;
    laptops[4].image = "assets/images/5.png"; //theres a bug
    return laptops;
  } catch (error) {
    return console.log(error);
  }
  //invoke createlaptoplist to add selection in our shop
};

export const fetchImage = async image_Url => {
  try {
    const response = await fetch("https://hickory-quilled-actress.glitch.me/" + image_Url);
    if (response) return response.url;
  } catch (error) {
    return console.log(error + " error in fetch...line 210");
  }
};
//! start fetching data into option list
export default fetchApiData;
