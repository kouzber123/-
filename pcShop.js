const pcDescription = document.querySelector("#pcDescription");
//! individual data when user clicks the title create html based on it
export const showPcDetails = (selectedLaptop, images) => {
  const { title, description, price, specs } = selectedLaptop;
  pcDescription.innerHTML = `
    <h1> ${title} <span>$${price}</span></h1>
    <img class="productImage" width="100px" height="100px" src="${images}"/>
    <h3>${description}.</h3>
    <h3>Features: </h3>
    <ul> 
    ${specs.map(spec => (`<p class="pcList">${spec}</p>`)).join("")}</ul> 
      <br>
    <button  id="buyBtn" class="buyBtn"> Buy now </button>
`;
  pcDescription.classList.add("pcDescription");
};
//! when pressing buy pc this will be invoked try to extract from bank
export const handlePurchase = (price, bankBalance, title) => {
  if (bankBalance >= price) {
    alert(`new owner of the laptop -${title}`);
    return bankBalance - price;
  } else {
    alert("Cannot afford it...");
    return bankBalance;
  }
};
