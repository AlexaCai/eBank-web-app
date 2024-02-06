'use strict';

// Data

const account1 = {
  owner: 'Jake Bonn',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Eva Willy',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

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


const displayMovements = function (account, sort = false) {
  containerMovements.innerHTML = '';

  const moneyMovements = sort ? account.movements.slice().sort(function (a, b) {
    return a - b
  }) : account.movements;

  moneyMovements.forEach(function (movements, index) {
    const type = movements > 0 ? 'deposit' : 'withdrawal'

    const date = new Date(account.movementsDates[index]);
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = date.getFullYear();
    const displayDate = `${day}/${month}/${year}`;

    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${index + 1} ${type}</div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${movements.toFixed(2)}$</div>
        </div>
        `
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};


const calcAndDisplayBalance = function (account) {
  account.balance = account.movements.reduce(function (accumulator, movement) {
    return accumulator + movement
  }, 0)
  labelBalance.textContent = `${account.balance.toFixed(2)} USD`
};


const calcDisplaySummary = function (account) {
  const incomes = account.movements.filter(function (movement) {
    return movement > 0
  }).reduce(function (accumulator, movement) {
    return accumulator + movement
  }, 0)
  labelSumIn.textContent = `${incomes.toFixed(2)}$`

  const outcomes = account.movements.filter(function (movement) {
    return movement < 0
  }).reduce(function (accumulator, movement) {
    return accumulator + movement
  }, 0)
  labelSumOut.innerHTML = `${outcomes.toFixed(2)}$`

  const interest = account.movements.filter(function (movement) {
    return movement > 0
  }).map(function (deposit) {
    return deposit * account.interestRate / 100
  }).filter(function (interest, index, array) {
    return interest >= 1
  }).reduce(function (accumulator, interest) {
    return accumulator + interest
  }, 0)
  labelSumInterest.innerHTML = `${interest.toFixed(2)}$`
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


const updateUI = function (currentAccount) {
  displayMovements(currentAccount);
  calcAndDisplayBalance(currentAccount);
  calcDisplaySummary(currentAccount);
}


// currentAccount is equal to the logged-in user
let currentAccount;


// FAKE always logged-in
currentAccount = account1;
updateUI(currentAccount);
containerApp.style.opacity = 100;


btnLogin.addEventListener('click', function (event) {
  // Prevent form from submitting when users log in
  event.preventDefault();
  currentAccount = accounts.find(function (account) {
    return account.username === inputLoginUsername.value
  })

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display welcome message and the whole UI elements
    labelWelcome.textContent = `Welcome back ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    inputLoginPin.blur();
    // Display current date on UI
    const now = new Date();
    const day = `${now.getDate()}`.padStart(2, 0);
    const month = `${now.getMonth() + 1}`.padStart(2, 0);
    const year = now.getFullYear();
    const hour = `${now.getHours()}`.padStart(2, 0);
    const minute = `${now.getMinutes()}`.padStart(2, 0);
    labelDate.textContent = `${day}/${month}/${year}, ${hour}:${minute}`;
    updateUI(currentAccount);
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


// Code to transfer money between users
btnTransfer.addEventListener('click', function (event) {
  event.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAccount = accounts.find(function (account) {
    return account.username === inputTransferTo.value;
  });

  // Clear the transfer input field after a transfer
  inputTransferAmount.value = inputTransferTo.value = '';

  // Ensure that transfers can only happen (1) if user sends more than 0$, (2) if the receiver account exist, (3) if the amount to be transfered is equal or less than the user's total money, (4) and if its sent to someone else than the user itself (cannot transfer money to himself)
  if (amount > 0 && receiverAccount && currentAccount.balance >= amount && receiverAccount?.username !== currentAccount.username) {
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAccount.movementsDates.push(new Date().toISOString());

    updateUI(currentAccount);
  }
});


btnLoan.addEventListener('click', function (event) {
  event.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  // the 'some' method is used to see if at least one element in the 'movement' array from the user is equal or greater than 10% of the request loan amount.
  if (amount > 0 && currentAccount.movements.some(function (movement) {
    return movement >= amount * 0.10
  })) {

    currentAccount.movements.push(amount);

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());

    // Update the UI to show new deposit
    updateUI(currentAccount);
  }
  inputLoanAmount.value = ''
})


btnClose.addEventListener('click', function (event) {
  event.preventDefault();
  if (currentAccount.username === inputCloseUsername.value && currentAccount.pin === Number(inputClosePin.value)) {
    const index = accounts.findIndex(function (account) {
      return account.username === currentAccount.username
    })
    // Delete account
    accounts.splice(index, 1);

    // Logout by hiding UI and clearing the close account fields
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
})


let sorted = false;
btnSort.addEventListener('click', function (event) {
  event.preventDefault();
  displayMovements(currentAccount, !sorted)
  sorted = !sorted;
});