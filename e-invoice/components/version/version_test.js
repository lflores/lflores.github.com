'use strict';

describe('e-invoice.version module', function() {
  beforeEach(module('e-invoice.version'));

  describe('version service', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});
