describe('indexTemplate utility', function () {
  beforeEach(function () {
    this.indexTemplate = require('../src/js/main');
  });

  describe('Providing values as a list of parameters', function () {
    beforeEach(function () {
      this.output = this.indexTemplate('lorem {0} dolor {1}', 'ipsum', 'sit');
    });

    it('should output the correct string', function () {
      expect(this.output).toBe('lorem ipsum dolor sit');
    });
  });

  describe('Providing values as an array', function () {
    beforeEach(function () {
      this.output = this.indexTemplate('lorem {0} dolor {1}', ['ipsum', 'sit']);
    });

    it('should output the correct string', function () {
      expect(this.output).toBe('lorem ipsum dolor sit');
    });
  });

  describe('Providing null/undefined template string', function () {
    beforeEach(function () {
      this.output = this.indexTemplate(null, 'ipsum', 'sit');
    });

    it('should output an empty string', function () {
      expect(this.output).toBe('');
    });
  });

  describe('Providing null/undefined values', function () {
    beforeEach(function () {
      this.output = this.indexTemplate('lorem {0} dolor {1} amet {2}', null, 'sit');
    });

    it('should output null/undefined values as blank', function () {
      expect(this.output).toBe('lorem  dolor sit amet ');
    });
  });

  describe('Providing numeric values', function () {
    beforeEach(function () {
      this.output = this.indexTemplate('lorem {0} dolor {1} amet {2}', 0, 1, 2);
    });

    it('should output numeric values correctly', function () {
      expect(this.output).toBe('lorem 0 dolor 1 amet 2');
    });
  });

  describe('Providing boolean values', function () {
    beforeEach(function () {
      this.output = this.indexTemplate('lorem {0} dolor {1}', true, false);
    });

    it('should output their string equivalent', function () {
      expect(this.output).toBe('lorem true dolor false');
    });
  });

  describe('Providing object values', function () {
    beforeEach(function () {
      this.obj1 = { test: true };
      this.obj2 = ['foo'];
      this.obj1.toString = function () { return 'obj1'; };
      this.obj2.toString = function () { return 'obj2'; };
      this.output = this.indexTemplate('lorem {0} dolor {1}', this.obj1, this.obj2);
    });

    it('should output object values converted to string', function () {
      expect(this.output).toBe('lorem obj1 dolor obj2');
    });
  });
});
