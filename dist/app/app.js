//=========================================================
// Accounts

class Account {
  constructor(accountName, movements) {
    this.accountName = accountName;
    this.movements = movements;
  }
  movementAmounts() {
    return this.movements.map((mov) => mov.amount);
  }
  movementDates() {
    return this.movements.map((mov) => mov.date);
  }
  balance() {
    return this.movementAmounts().reduce((accum, cur) => accum + cur, 0);
  }
}

const account1 = new Account('Personal', [
  { date: '2021-09-09T17:01:17.194Z', name: 'Wallet Loaded', amount: 1000 },
  { date: '2021-09-11T23:36:17.929Z', name: 'Restaurant', amount: -100 },
  { date: '2021-09-13T10:51:36.790Z', name: 'Grocery', amount: -500 },
]);

const account2 = new Account('Business', [
  { date: '2021-09-09T17:01:17.194Z', name: 'Wallet Loaded', amount: 1000 },
  { date: '2021-09-11T23:36:17.929Z', name: 'Restaurant', amount: -100 },
  { date: '2021-09-13T10:51:36.790Z', name: 'Grocery', amount: -500 },
]);

const accountsArr = [account1, account2];

// Elements

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__total-load-amount');
const labelSumOut = document.querySelector('.summary__total-spend-amount');
const labelDate = document.querySelector('.date');

const btnExpense = document.querySelector('.form__btn--spending');
const btnDeposit = document.querySelector('.form__btn--load-amount');
const btnSortDate = document.querySelector('.btn--sort--date');
const btnSortName = document.querySelector('.btn--sort--name');
const btnSortAmount = document.querySelector('.btn--sort--amount');

const inputExpenseAmount = document.querySelector('.form__input--spend-amount');
const inputExpenseName = document.querySelector('.form__input--spend-name');

const inputDepositAmount = document.querySelector('.form__input--load-amount');

//=========================================================
//Functions

let sortDateToggler = true;
let sortNameToggler = true;
let sortAmountToggler = true;

const formattedCurrency = function (amount) {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
  }).format(amount);
};

const formatMovementDate = function (date) {
  const locale = 'en-US';
  const options = {
    // year: 'numeric',
    month: 'short',
    day: '2-digit',
  };
  return new Intl.DateTimeFormat(locale, options).format(date);
};

const displayMovements = function (
  acc,
  sortDate = false,
  sortName = false,
  sortAmount = false
) {
  containerMovements.innerHTML = '';
  let movs = acc.movements;

  if (sortDate) {
    movs = acc.movements
      .slice()
      .sort((a, b) =>
        sortDateToggler
          ? new Date(b.date) - new Date(a.date)
          : new Date(a.date) - new Date(b.date)
      );
    sortDateToggler = !sortDateToggler;
  }
  if (sortName) {
    movs = sortNameToggler
      ? acc.movements.slice().reverse()
      : acc.movements.slice().sort();
    sortNameToggler = !sortNameToggler;
  }

  if (sortAmount) {
    movs = acc.movements
      .slice()
      .sort((a, b) =>
        sortAmountToggler ? a.amount - b.amount : b.amount - a.amount
      );
    sortAmountToggler = !sortAmountToggler;
  }

  movs.forEach(function (mov, i) {
    const type = mov.amount > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(mov.date);
    const name = mov.name;
    const displayDate = formatMovementDate(date);
    const formattedMov = new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
    }).format(mov.amount);

    const html = `
      <div class="row grid-container movements__row">
        <div class="movements__date">${displayDate}</div>
        <div class="movements__type--${type}">${name}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//=========================================================
// Display Summary
const calcDisplaySummary = function (acc) {
  const incomes = acc
    .movementAmounts()
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${formattedCurrency(incomes)}`;

  const outs = acc
    .movementAmounts()
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${formattedCurrency(outs)}`;
};

//=========================================================
// Total Balance

const calcDisplayBalance = function (acc) {
  labelBalance.textContent = `${formattedCurrency(acc.balance())}`;
};

//=========================================================
// Update function

const updateUI = function (accs) {
  // Display Movements
  displayMovements(accs);

  // Display balance
  calcDisplayBalance(accs);

  // Display summary
  calcDisplaySummary(accs);
};

// Init

let currentAccount;
function init() {
  currentAccount = accountsArr[0];
  // const now = new Date();
  // const options = {
  //   hour: 'numeric',
  //   minute: 'numeric',
  //   day: 'numeric',
  //   month: 'long',
  //   year: 'numeric',
  // };
  // const locale = navigator.language;
  // labelDate.textContent = new Intl.DateTimeFormat(locale, options).format(now);

  //Update UI
  updateUI(currentAccount);
}

init();

//=========================================================
// Event Handlers: Spending

btnExpense.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputExpenseAmount.value);
  const name = inputExpenseName.value;
  const date = new Date().toISOString();
  inputExpenseAmount.value = inputExpenseName.value = '';

  if (amount > 0 && currentAccount.balance() >= amount) {
    currentAccount.movements.push({ date, name, amount });
    //Update UI
    setTimeout(() => {
      updateUI(currentAccount);
    }, 1000);
  }
});

//=========================================================
// Event Handlers: Deposit

btnDeposit.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputDepositAmount.value);
  const date = new Date().toISOString();
  currentAccount.movements.push({ date, name: 'Wallet Loaded', amount });
  setTimeout(() => {
    updateUI(currentAccount);
  }, 1000);

  inputDepositAmount.value = '';
});

//=========================================================
// Event Handlers: Button Sort

btnSortAmount.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, 0, 0, true);
});
btnSortName.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, 0, true, 0);
});

btnSortDate.addEventListener('click', (e) => {
  e.preventDefault();
  displayMovements(currentAccount, true, 0, 0);
});
