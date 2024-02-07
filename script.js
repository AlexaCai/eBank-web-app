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
    '2024-02-01T17:01:17.194Z',
    '2024-02-05T23:36:17.929Z',
    '2024-02-06T10:51:36.790Z',
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



// Elements selected
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



// Target and take the first letter of each users' first name and last name (used in log in)
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



// Format the dates shown beside each transaction (display the date in the format of the user's location)
const formatMovementDate = function (date, locale) {
  // Calculates the number of days between two dates (current day and the day the operation was done)
  const calcDaysPassed = function (date1, date2) {
    return Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24))
  };

  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) {
    return 'Today'
  };
  if (daysPassed === 1) {
    return 'Yesterday'
  };
  if (daysPassed <= 7) {
    return `${daysPassed} days ago`
  }
  else {
    return new Intl.DateTimeFormat(locale).format(date)
  };
};



// Format the currency displayed on each user UI (display the money in the currency of the user's location)
const formatCurrencies = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};



// Function create to keep track of users last activity, and log them out after a certain moment for security
const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    // Ensure the timer shown on UI is updated every second
    labelTimer.textContent = `${min}:${sec}`;

    // When timer reaches 0 due to inactivity, log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }
    time = time - 1;
  };

  // Set initial timer to 5 minutes
  let time = 300;

  // Call the tick function every second, which update the timer
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};



// Display each transaction (money in, money out and loans) in each users UI
const displayMovements = function (account, sort = false) {
  containerMovements.innerHTML = '';

  const moneyMovements = sort ? account.movements.slice().sort(function (a, b) {
    return a - b;
  }) : account.movements;

  moneyMovements.forEach(function (movements, index) {
    const type = movements > 0 ? 'deposit' : 'withdrawal';

    // Display the date associated with each transaction by calling the function created for that
    const date = new Date(account.movementsDates[index]);
    const displayDate = formatMovementDate(date, account.locale);

    // Display the money in the currency of the user's location by calling the function created for that
    const formattedMovement = formatCurrencies(movements, account.locale, account.currency);

    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${index + 1} ${type}</div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${formattedMovement}</div>
        </div>
        `
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};



// Display the overall balance of the user account
const calcAndDisplayBalance = function (account) {
  account.balance = account.movements.reduce(function (accumulator, movement) {
    return accumulator + movement;
  }, 0);
  labelBalance.textContent = formatCurrencies(account.balance, account.locale, account.currency);
};



// Display users' total money in, total money out and total interest at the bottom of the UI
const calcDisplaySummary = function (account) {
  const incomes = account.movements.filter(function (movement) {
    return movement > 0;
  }).reduce(function (accumulator, movement) {
    return accumulator + movement;
  }, 0);
  labelSumIn.textContent = formatCurrencies(incomes, account.locale, account.currency);

  const outcomes = account.movements.filter(function (movement) {
    return movement < 0;
  }).reduce(function (accumulator, movement) {
    return accumulator + movement;
  }, 0);
  labelSumOut.innerHTML = formatCurrencies(Math.abs(outcomes), account.locale, account.currency);

  const interest = account.movements.filter(function (movement) {
    return movement > 0;
  }).map(function (deposit) {
    return deposit * account.interestRate / 100;
  }).filter(function (interest, index, array) {
    return interest >= 1;
  }).reduce(function (accumulator, interest) {
    return accumulator + interest;
  }, 0);
  labelSumInterest.innerHTML = formatCurrencies(interest, account.locale, account.currency);
}



// Used to update users UI everytime an action is completed
const updateUI = function (currentAccount) {
  displayMovements(currentAccount);
  calcAndDisplayBalance(currentAccount);
  calcDisplaySummary(currentAccount);
}



// currentAccount is equal to the current logged-in user
let currentAccount;
// timer variable is defined here because we need the variable to persit between different logins
let timer;



btnLogin.addEventListener('click', function (event) {
  event.preventDefault();
  currentAccount = accounts.find(function (account) {
    return account.username === inputLoginUsername.value
  });

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display welcome message and the whole UI elements upon successful login
    labelWelcome.textContent = `Welcome back ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    inputLoginPin.blur();
    // Display current date on UI
    const now = new Date();
    const time = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    };

    labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, time).format(now);

    // If a timer already exist when someone log in (ex: from another past user session), the timer is cleared and set back to zero for the new logged-in user
    if (timer) {
      clearInterval(timer);
    };
    // Start timer to logout by default after X amount of time
    timer = startLogOutTimer();

    updateUI(currentAccount);
    if (loginError.classList.contains('login-error')) {
      loginError.classList.remove('login-error');
      loginError.classList.add('login-error-hidden');
    };
  } else {
    loginError.innerHTML = '<h1>An error occurred during authentication. Please ensure you have the right username and PIN.</h1>';
    loginError.classList.remove('login-error-hidden');
    loginError.classList.add('login-error');
  };
});



// Logic to transfer money between users
btnTransfer.addEventListener('click', function (event) {
  event.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAccount = accounts.find(function (account) {
    return account.username === inputTransferTo.value;
  });

  // Clear the transfer input field after a transfer
  inputTransferAmount.value = inputTransferTo.value = '';

  // Ensure that transfers can only happen (1) if user sends more than 0$, (2) if the receiver account exist, (3) if the amount to be transfered is equal or less than the user's total balance, (4) and if its sent to someone else than the user itself (user cannot transfer money to himself)
  if (amount > 0 && receiverAccount && currentAccount.balance >= amount && receiverAccount?.username !== currentAccount.username) {
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAccount.movementsDates.push(new Date().toISOString());

    updateUI(currentAccount);

    // Reset timer (everytime users make an action, the timer is reset to original time - because the timer keeps track of inactivity)
    clearInterval(timer);
    timer = startLogOutTimer();
  };
});



// Logic for loans
btnLoan.addEventListener('click', function (event) {
  event.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(function (movement) {
    return movement >= amount * 0.10;
  })) {

    // Timeout method used so that it takes 3 secondes for the loan to be approved
    setTimeout(function () {
      currentAccount.movements.push(amount);

      // Add transfer date
      currentAccount.movementsDates.push(new Date().toISOString());

      updateUI(currentAccount);

      // Reset timer (everytime users make an action, the timer is reset to original time - because the timer keeps track of inactivity)
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 3000);
    inputLoanAmount.value = '';
  };
});



// Logic to close account
btnClose.addEventListener('click', function (event) {
  event.preventDefault();
  if (currentAccount.username === inputCloseUsername.value && currentAccount.pin === Number(inputClosePin.value)) {
    const index = accounts.findIndex(function (account) {
      return account.username === currentAccount.username;
    });

    accounts.splice(index, 1);

    // Logout by hiding UI and clearing the close account fields
    containerApp.style.opacity = 0;
  };
  inputCloseUsername.value = inputClosePin.value = '';
});



// Logic for the transcations sorted option
let sorted = false;
btnSort.addEventListener('click', function (event) {
  event.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
  // Reset timer (everytime users make an action, the timer is reset to original time - because the timer keeps track of inactivity)
  clearInterval(timer);
  timer = startLogOutTimer();
});