const db = require('./db');
const mail = require('./mail');

// Testing numbers 
module.exports.absolute = function (number) {
  //refactoring, (Unit tests help te refactor your code with confindence)
  return (number >= 0) ? number : -number
  // if (number >= 0) return number;
  // return -number;
}

// Testing strings 
module.exports.greet = function (name) {
  return 'Welcome ' + name;
}

// Testing arrays 
module.exports.getCurrencies = function () {
  return ['USD', 'AUD', 'EUR'];
}

// Testing objects 
module.exports.getProduct = function (productId) {
  return { id: productId, price: 10, categorie: 's' };
}

// Testing exceptions 
module.exports.registerUser = function (username) {
  if (!username) throw new Error('Username is required.');

  return { id: new Date().getTime(), username: username }
}

// Mock functions 
module.exports.applyDiscount = function (order) {
  //mocks a call to a fake db
  const customer = db.getCustomerSync(order.customerId);

  if (customer.points > 10)
    order.totalPrice *= 0.9;
}

// Mock functions 
module.exports.notifyCustomer = function (order) {
  const customer = db.getCustomerSync(order.customerId);

  mail.send(customer.email, 'Your order was placed successfully.');
}