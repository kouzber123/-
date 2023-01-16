//! to create shorthand elements
const element = {
  create: element => document.createElement(element)
};

//! creates shortcut for these
const create = {
  option: () => element.create("option")
};

//! WORK ELEMENTS
const giveUserMoney = document.querySelector("#paidMoney");
const depositElement = document.querySelector("#deposit");
const payBtnElement = document.querySelector("#paybtn");
const payBackLoanElement = document.querySelector("#payLoanBtn");

//! BANK ELEMENTS
const bankBalanceElement = document.querySelector("#bankBalance");
const bankDept = document.querySelector("#bankDept");
const takeLoanBtnElement = document.querySelector("#takeLoanBtn");

//! SHOP ELEMENTS
const pcOption = document.querySelector("#pcSelect");
const pcDescription = document.querySelector("#pcDescription");
const select = document.querySelector("#select");

//! Variables
let totalPay = 0;
let bankBalance = 0;
let currentLoan = 0;

//! Event listeners
payBtnElement.addEventListener("click", addMoney);
depositElement.addEventListener("click", handleDeposit);

//! Shoq user balances
//shows bank balance
const displayBalance = () => {
  bankBalanceElement.innerText = `Amount : ${bankBalance}`;
  bankDept.innerText = `Dept : ${currentLoan}`;
  giveUserMoney.innerText = `Money earned : ${totalPay}`;
};

//! deposit button will disabled at the beginning
depositElement.disabled = true;
//! WORK AREA
//adds money from work > when money deposit can happen
function addMoney() {
  totalPay += 100;
  depositElement.disabled = false;
  displayBalance();
}
//! function for 10% rate
const outstandingloan = () => {
  const get10percent = totalPay / 10;
  totalPay = totalPay - get10percent;
  currentLoan -= get10percent;
};
//! deposit btn if there is loan then we call outstandingloan()
function handleDeposit() {
  if (currentLoan > 0) {
    outstandingloan();
  }
  bankBalance += totalPay;
  totalPay = 0;
  depositElement.disabled = true;
  displayBalance();
  handleBtnStatus(false);
}

//! anon func attached to btn
payBackLoanElement.addEventListener("click", () => {
  if (totalPay == 0) {
    alert("You have to work first to pay loan...");
  }
  const temp = totalPay - currentLoan;
  currentLoan -= totalPay;
  if (currentLoan <= 0) {
    bankBalance += temp;
    totalPay = 0;
    currentLoan = 0;

    payBackLoanElement.classList.add("hideBtn");
    takeLoanBtnElement.classList.remove("hideBtn");
  }
  displayBalance();
});

//! BANK AREA
//! 1. disable buttons only take loan when bankbalance has value > 0
//hide first
payBackLoanElement.classList.add("hideBtn");
takeLoanBtnElement.addEventListener("click", handleLoan);

//! disable the button so user cant press initially
handleBtnStatus(true);
function handleBtnStatus(bool) {
  takeLoanBtnElement.disabled = bool;
}
//handles taking a loan. statements for taking loan
function handleLoan() {
  //! create take Loan function > only when no loan prev and has bank balance
  if (currentLoan == 0 && bankBalance > 0) {
    currentLoan = Number(window.prompt("How much loan are you taking? "));
    if (currentLoan < 0 || !parseInt(currentLoan)) {
      alert("Incorrect Value...");
      currentLoan = 0;
    }
    //! max loan is the same as bank balance
    if (currentLoan > bankBalance) {
      //if loan is higher than balance
      alert("We cannot give that high a loan to you...");
    } else {
      bankBalance += currentLoan;
      displayBalance();
      //! hide buttons if loan exists
      if (currentLoan > 0) {
        payBackLoanElement.classList.remove("hideBtn");
        takeLoanBtnElement.classList.add("hideBtn");
      }
    }
  } else {
    console.log("your funds arent sufficient.");
  }
}

//! PC SHOP AREA
//! 1. first get api data then create option list with map add titles
//! 2. get event of corresponding value and get detailed details
//Setup Dom manipulation and fetch
let laptops = [];
let images = "";
const url = "https://hickory-quilled-actress.glitch.me/computers";

const fetchLaptops = async () => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    laptops = data;
    laptops[4].image = "assets/images/5.png"; //theres a bug
  } catch (error) {
    console.log(error);
  }
  //invoke createlaptoplist to add selection in our shop
  createLaptopList();
};
//! start fetching data
fetchLaptops();
//creates list with api data, create non static 1st option
const createLaptopList = () => {
  //list options
  let option = create.option();
  option.text = "Select laptop";
  option.value = "none";
  select.appendChild(option);
  createOptions(laptops);

  //when the mapping is done create onchange event and pass the event.target.value to the function
  select.addEventListener("change", e => loadSelectedLaptop(e.target.value));
};

const createOptions = laptops => {
  laptops.map(laptop => {
    option = create.option();
    option.text = laptop.title;
    option.value = laptop.id;
    select.appendChild(option);
  });
};

//! function e = target.value e.g. 1 2 3 4 so with that will will compare the id
async function loadSelectedLaptop(e) {
  //add condition that avoid first option running this
  if (e != "none") {
    const selectedLaptop = laptops.find(laptop => laptop.id == e);
    const { image } = selectedLaptop;
    //fetch data
    const images = await fetchImage(image);
    pcDetails(selectedLaptop, images);
  }
}
//! second fetch for the images
const fetchImage = async image_Url => {
  try {
    const response = await fetch("https://hickory-quilled-actress.glitch.me/" + image_Url);
    if (response) return response.url;
  } catch (error) {
    console.log(error + " error in fetch...line 210");
  }
};
//! individual data when user clicks the title
const pcDetails = (selectedLaptop, images) => {
  const { title, description, price, specs } = selectedLaptop;
  pcDescription.innerHTML = `
<h1> ${title} </h1>
<img class="productImage" width="100px" height="100px" src="${images}"/>
<h3>Description : ${description}</h3>
<span>Specs: ${specs} </span>
<span>Price: ${price}$</span>
<button id="buyBtn" class="buyBtn"> Buy now </button>
`;
  buyBtn.addEventListener("click", () => buyPc(title, parseInt(price)));
  pcDescription.classList.add("pcDescription");
};

//! when pressing buy pc this will be invoked try to extract from bank
const buyPc = (title, price) => {
  if (bankBalance >= price) {
    bankBalance -= price;
    displayBalance();
    alert(`new owner of the laptop -${title}`);
  } else {
    alert("you cannot afford that!");
  }
};
