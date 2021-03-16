const lib = require('../lib')
const db = require('../db')
const mail = require('../mail')

//groepeer alle gerelateerde tests in een describe block, om het overzicht te bewaren
describe('absolute', () => {
   //it should... in deschibe kun je it gebruiken voor verschillend tests en verwachtingen
   it('should return a positive number if input is positive', () => {
      const result = lib.absolute(1);
      expect(result).toBe(1);
   });

   it('should return a negative number if input is negative', () => {
      const result = lib.absolute(-1);
      expect(result).toBe(1);
   });

   it('should return a 0 number if input is 0', () => {
      const result = lib.absolute(0);
      expect(result).toBe(0);
   });
})

describe('greet', () => {
   it('Should return the greeting message', () => {
      const result = lib.greet('Geert')
      //Niet te specifiek testen, met toMatch bekijk je of 'Geert' in de string staat
      // expect.toMatch(/Geert/); of
      expect(result).toContain('Geert');
   });
})

describe('getCurrencies', () => {
   it('should return supported currencies', () => {
      const result = lib.getCurrencies();

      expect(result).toEqual(expect.arrayContaining(['USD', 'EUR', 'AUD']));

   })
})

describe('getProduct', () => {
   it('Should return the product with the given id', () => {
      const result = lib.getProduct(1);
      // expect(result).toStrictEqual({id:1, price: 10}); werkt alleen bij alle properties
      expect(result).toMatchObject({ id: 1, price: 10 }); // vergelijkt de keys, aantal properties maakt niet uit
      expect(result).toHaveProperty('id', 1)// type is belangrijk mag geen '1' zijn
   })
})

describe('registerUser', () => {
   it("should throw if username is Falsy(null, undefined, NaN, '', 0, false)", () => {

      const args = [null, undefined, NaN, '', 0, false]

      args.forEach(a => {
         var callb = () => lib.registerUser(a);
         expect(callb).toThrow();
      })

   })

   it('Should return a user object if valid username is passed', () => {
      const result = lib.registerUser('Geert')
      expect(result).toMatchObject({ username: 'Geert' })
      expect(result.id).toBeGreaterThan(0);
   })
})

describe('applyDiscount', () => {
   it('Should apply 10% discount if customer has more than 10 points', () => {
      db.getCustomerSync = function (customerId) {
         console.log('Fake reading customer...');
         return { id: customerId, points: 20 }
      }

      const order = { customerId: 1, totalPrice: 10 }
      lib.applyDiscount(order);
      expect(order.totalPrice).toBe(9)
   })
})

describe('notifyCustomer', () => {
   it('should send an email to the customer', () => {
      //testing interactions with objects, don't use the real mail server for performance..
      db.getCustomerSync = jest.fn().mockReturnValue({ email: 'a' });
      mail.send = jest.fn()

      lib.notifyCustomer({ customerId: 1 })

      expect(mail.send).toHaveBeenCalled();
      expect(mail.send.mock.calls[0][0]).toBe('a')
      expect(mail.send.mock.calls[0][1]).toMatch(/order/)


      // Jest mock functie
      // const mockFunction = jest.fn();
      // //mockFunction.mockReturnValue(1);
      // // mockFunction.mockResolvedValue(1)
      // mockFunction.mockRejectedValue(new Error('...'))
      // const result = await mockFunction();


      //Old way
      //    db.getCustomerSync = function (customerId) {
      //       return { email: 'a' }
      //    }

      //    let mailSent = false;
      //    mail.send = function (email, message) {
      //       mailSent = true
      //    }

      //    lib.notifyCustomer({ customerId: 1 })

      //    expect(mailSent).toBe(true);
   })
})