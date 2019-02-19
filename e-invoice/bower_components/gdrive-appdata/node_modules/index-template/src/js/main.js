module.exports = function indexTemplate(templStr, values) {
  if (!Array.isArray(values)) {
    values = [].slice.call(arguments, 1);
  }
  return (templStr || '').replace(/\{(\d+)\}/g, function (match, index) {
    var value = values[index];
    return (value === null || value === undefined) ? '' : String(value);
  });
};
