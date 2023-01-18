import fetchApiData from "./api.js";
import { showPcDetails } from "./pcShop.js";
import { handlePurchase } from "./pcShop.js";
//! to create shorthand elements
const element = {
  create: element => document.createElement(element)
};
//! creates shortcut for these
const create = {
  option: () => element.create("option")
};
//! WORK ELEMENTS
const showUserMoney = document.querySelector("#paidMoney");
const depositMoneyButton = document.querySelector("#deposit");
const payMoneyButton = document.querySelector("#paybtn");
const payLoanButton = document.querySelector("#payLoanBtn");
//! BANK ELEMENTS
const showBankBalance = document.querySelector("#bankBalance");
const showBankDept = document.querySelector("#bankDept");
const takeLoanButton = document.querySelector("#takeLoanBtn");
//! SHOP ELEMENTS
const select = document.querySelector("#select");
//! Variables
let totalPay = 0;
let bankBalance = 0;
let currentLoan = 0;
//! Event listeners
payMoneyButton.addEventListener("click", addMoney);
depositMoneyButton.addEventListener("click", handleDeposit);
//! Show user balances
//shows bank balance
const displayBalance = () => {
  showBankBalance.innerText = `Balance : $${bankBalance}`;
  showBankDept.innerText = `Dept : $${currentLoan}`;
  showUserMoney.innerText = `Pay : $${totalPay}`;
};

//! deposit button will disabled at the beginning
depositMoneyButton.disabled = true;
//! ---------------------------- WORK AREA
//adds money from work > when money deposit can happen
function addMoney() {
  totalPay += 100;
  depositMoneyButton.disabled = false;
  displayBalance();
}
//! function for 10% rate
const createOutStandingLoan = () => {
  const get10percent = totalPay / 10;
  totalPay = totalPay - get10percent;
  currentLoan -= get10percent;
};
//! add to bank / deposit btn if there is loan then we call createOutStandingLoan()
function handleDeposit() {
  if (currentLoan > 0) {
    // loan then take 10%
    createOutStandingLoan();
  } //then deposit deposit total pay will be 0 after putting money in
  bankBalance += totalPay;
  totalPay = 0;
  depositMoneyButton.disabled = true;
  displayBalance();
  handleBtnStatus(false);
  if (currentLoan == 0) {
    payLoanButton.classList.add("hideBtn");
    takeLoanButton.classList.remove("hideBtn");
  } else {
    payLoanButton.classList.remove("hideBtn");
  }
}

//!  func attached to btn will check alert if user tries to pay dept with 0
payLoanButton.addEventListener("click", () => {
  if (totalPay == 0) {
    alert("You have to work first to pay loan...");
  }
  const deptLeft = totalPay - currentLoan;
  currentLoan -= totalPay;
  if (currentLoan <= 0) {
    //extra money will be transferred to bank
    bankBalance += deptLeft;
    totalPay = 0;
    currentLoan = 0;
  }
  displayBalance();
});

//!------------------------------ BANK AREA

//! 1. disable buttons only take loan when bankbalance has value > 0
//hide first
payLoanButton.classList.add("hideBtn");
takeLoanButton.addEventListener("click", handleLoan);

//! disable the button so user cant press initially
handleBtnStatus(true);
function handleBtnStatus(bool) {
  takeLoanButton.disabled = bool;
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
    //! max loan is the same as bank balance   //if loan is higher than balance
    if (currentLoan > bankBalance) {
      alert("We cannot give that high a loan to you...");
    } else {
      bankBalance += currentLoan;
      displayBalance();
      //! hide buttons if loan exists
      if (currentLoan > 0) {
        payLoanButton.classList.remove("hideBtn");
        takeLoanButton.classList.add("hideBtn");
      }
    }
  } else {
    console.log("your funds arent sufficient.");
  }
  displayBalance();
}
//! ----------------------------- PC SHOP AREA

//! 1. first get api data then create option list with map add titles
//! 2. get event of corresponding value and get detailed details
//Setup Dom manipulation and fetch
let laptops = [];

//! start fetching data into option list
async function getFetchData() {
  laptops = await fetchApiData.fetchApi();
  createLaptopList();
}
//! start fetching
getFetchData();

//creates list with api data, create non static 1st option
const createLaptopList = () => {
  //list options
  let option = create.option();
  option.text = "Select laptop";
  option.value = "none";
  select.appendChild(option);
  //more options
  createOptions(laptops);

  //when the mapping is done create onchange event and pass the event.target.value to the function
  select.addEventListener("change", e => loadSelectedLaptop(e.target.value));
};

const createOptions = laptops => {
  laptops.map(laptop => {
    let option = create.option();
    option.text = laptop.title;
    option.value = laptop.id;
    select.appendChild(option);
  });
};

//! function e = target.value, ignore first option
async function loadSelectedLaptop(e) {
  //find where laptop id mathches the event.target.value
  if (e != "none") {
    const selectedLaptop = laptops.find(laptop => laptop.id == e);
    const { image, price, title } = selectedLaptop;
    //! second fetch for the images
    const images = await fetchApiData.fetchImages(image);
    //call pcdetails from pcShop.js
    showPcDetails(selectedLaptop, images);
    //we create buyBtn button in pcShop.js and now we add functionality balance will returned
    buyBtn.addEventListener("click", () => {
      bankBalance = handlePurchase(price, bankBalance, title);
      displayBalance();
    });
  }
}
