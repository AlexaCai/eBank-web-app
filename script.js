'use strict';

// Data
const account1 = {
  owner: 'Jake Bonn',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jay Lito',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Eva Willy',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Kyle Cho',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
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
const loginError = document.querySelector('.login-error-hidden');
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


const displayMovements = function (movements) {
  containerMovements.innerHTML = '';

  movements.forEach(function (movements, index) {
    const type = movements > 0 ? 'deposit' : 'withdrawal'
    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${index + 1} ${type}</div>
          <div class="movements__value">${movements}$</div>
        </div>
        `
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};


const calcAndDisplayBalance = function (movements) {
  const balance = movements.reduce(function (accumulator, movement) {
    return accumulator + movement
  }, 0)
  labelBalance.textContent = `${balance} USD`
};


const calcDisplaySummary = function (account) {
  const incomes = account.movements.filter(function (movement) {
    return movement > 0
  }).reduce(function (accumulator, movement) {
    return accumulator + movement
  }, 0)
  labelSumIn.textContent = `${incomes}$`

  const outcomes = account.movements.filter(function (movement) {
    return movement < 0
  }).reduce(function (accumulator, movement) {
    return accumulator + movement
  }, 0)
  labelSumOut.innerHTML = `${outcomes}$`

  const interest = account.movements.filter(function (movement) {
    return movement > 0
  }).map(function (deposit) {
    return deposit * account.interestRate / 100
  }).filter(function (interest, index, array) {
    return interest >= 1
  }).reduce(function (accumulator, interest) {
    return accumulator + interest
  }, 0)
  labelSumInterest.innerHTML = `${interest}$`
}


// Target and take the first letter of each users' first name and last name.
const createUsernames = function (accounts) {
  accounts.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

// currentAccount is equal to the logged-in user
let currentAccount;

btnLogin.addEventListener('click', function (event) {
  // Prevent form from submitting when users log in
  event.preventDefault();
  currentAccount = accounts.find(function (account) {
    return account.username === inputLoginUsername.value
  })
  console.log(currentAccount)

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display welcome message and the whole UI elements
    labelWelcome.textContent = `Welcome back ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    inputLoginPin.blur();
    displayMovements(currentAccount.movements);
    calcAndDisplayBalance(currentAccount.movements);
    calcDisplaySummary(currentAccount)
    if (loginError.classList.contains('login-error')) {
      loginError.classList.remove('login-error');
      loginError.classList.add('login-error-hidden');
    }
  } else {
    loginError.innerHTML = '<h1>An error occurred during authentication. Please ensure you have the right username and PIN.</h1>';
    loginError.classList.remove('login-error-hidden');
    loginError.classList.add('login-error');
  }
});



// Backtick: `
// Curly braces: {}
// Square brackets: []
// Greater than sign: >
// Less than sign: <












