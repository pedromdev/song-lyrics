const {stringToRegexp, parseDateQuery} = require('../../helpers');

describe('Helpers', () => {

  describe('stringToRegexp', () => {

    it('should transform props in RegExp instance', () => {
      const obj = {
        prop1: 'value1',
        prop2: 'value2',
      };

      const parsedObj = stringToRegexp(obj, [
        'prop2'
      ]);

      expect(parsedObj.prop1).toEqual('value1');
      expect(parsedObj.prop2).toBeInstanceOf(RegExp);
    });

  });

  describe('parseDateQuery', () => {

    it('should add $gte and/or $lte properties on query', () => {
      let query = {
        start: new Date(),
        end: new Date(),
      };

      parseDateQuery(query, 'date');

      expect(query.date.$gte).toBeInstanceOf(Date);
      expect(query.date.$lte).toBeInstanceOf(Date);
      expect(query.start).toBeUndefined();
      expect(query.end).toBeUndefined();
    });

  });

});