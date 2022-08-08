'use strict';

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-07-26T17:01:17.194Z",
    "2022-08-05T23:36:17.929Z",
    "2022-08-06T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "en-DE", // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-07-26T17:01:17.194Z",
    "2020-07-28T23:36:17.929Z",
    "2020-08-01T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

inputLoanAmount.value = '';

const formatDate = function(date, locale){
  const calsDaysPassed = (date1, date2) => Math.round(Math.abs(date2 - date1)/(1000 * 60 * 60 * 24));
  const daysPassed = calsDaysPassed(new Date, date);

  if(daysPassed === 0) return 'Today';
  if(daysPassed === 1) return 'Yesterday';
  if(daysPassed  <= 7) return `${daysPassed} days ago`;

    // const day = `${date.getDate()}`.padStart(2, 0);
    // const month = `${date.getMonth()+1}`.padStart(2, 0);
    // const year = date.getFullYear();
    // return `${day}/${month}/${year}`;
    return new Intl.DateTimeFormat(locale).format(date);
}

const formatCur = function(value, locale, currency){
  return new Intl.NumberFormat(locale, {style: 'currency', currency: currency}).format(value);
}

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
      ? acc.movements.slice().sort((a, b) => a - b)
      : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatDate(date, acc.locale);
    const formattedMov = formatCur(mov, acc.locale, acc.currency);
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
      `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const createUserName = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLocaleLowerCase()
      .split(' ')
      .map(word => word[0])
      .join('');
  });
};

createUserName(accounts);
function updateUI(acc) {
  displayMovements(acc);
  calcDisplayBalance(acc);
  calcDiplaySummery(acc);
}
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, curr) => acc + curr, 0);
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

const calcDiplaySummery = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent =formatCur(incomes, acc.locale, acc.currency)
  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

//Login Event Handler
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === parseInt(inputLoginPin.value)) {

    //Current date

    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'long',
    };

    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth()+1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hours = `${now.getHours()}`.padStart(2, 0);
    // const minutes =`${now.getMinutes()}`.padStart(2, 0);
    labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, options).format(now);
    //Display UI Message
    labelWelcome.textContent = `Welcome ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 1;
    //Clear InputFields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    //Display Movements
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = parseInt(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    //Transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    //Add Movement Date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());
    updateUI(currentAccount);
  }
});
//Request Loan
btnLoan.addEventListener('click', function(e){
    e.preventDefault();
    const amount = Number(inputLoanAmount.value);
    if(amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)){
    setTimeout(function(){
    // Add movement
    currentAccount.movements.push(amount);
    // Add Movemnent Date
    currentAccount.movementsDates.push(new Date().toISOString());
      //Update UI
    updateUI(currentAccount);
    inputLoanAmount.value = '';
  },3000)
    }
});

btnClose.addEventListener('click', function(e){
  e.preventDefault();

  if(inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin){
    const index = accounts.findIndex(acc => acc.username === currentAccount.username);
    //Delete Account
    accounts.splice(index, 1);
    //Hide UI
    containerApp.style.opacity = 0;
  }
    inputCloseUsername.value = inputClosePin.value = '';
});
//Sort Movements

let sorted = false;
btnSort.addEventListener('click', function(e){
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
})

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const anyDeposit = movements.some(mov => mov > 700);
// console.log(anyDeposit);
// const deposit = movements.filter(function (mov) {
//   return mov > 0;
// });
// console.log(deposit);
// const balance = movements.reduce(function (acc, curr, i, arr) {
//   return acc + curr;
// }, 0);
// console.log(balance);
// const eurToUsd = 1.12;
// const movementToUsd = movements.map(mov => eurToUsd * mov);
// console.log(movementToUsd);
// let movementsToUsdFor = [];
// for (const mov of movements) movementsToUsdFor.push(mov * eurToUsd);
// console.log(movementsToUsdFor);
//
//
// movements.forEach(function(move, index,array){
//
// if(move > 0){
//   console.log(`${index+1} : You deopsited: ${move}`)
// }else{
//   console.log(`${index+1} : You widthdrew: ${Math.round(move)}`)
// }
//
// })

// let arr = ['a', 'b','c','d','e'];
// console.log(arr.slice(2));
// console.log(arr.slice(2,4));
// console.log(arr.slice(-2));
// console.log(arr.slice(-1));
// console.log(arr.slice(1,-3));
// console.log(arr.slice());
// console.log([...arr]);
//
// //Splice
// console.log(arr.splice(2));
// console.log(arr);
