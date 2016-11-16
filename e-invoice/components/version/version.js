'use strict';

angular.module('e-invoice.version', [
  'e-invoice.version.interpolate-filter',
  'e-invoice.version.version-directive'
])

.value('version', '0.1');
