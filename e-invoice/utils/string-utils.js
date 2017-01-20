String.prototype.cleanSpecialChars = function () {
    var ret = this;
    //BOM
    ret = ret.replace(/\uFEFF/g, "");
    //↵ Char conversion
    ret = ret.replace(/\u21B5/g, "\n");
    //Replace start quotes
    ret = ret.replace(/^"/g, "");
    //Replace end quotes
    ret = ret.replace(/"$/g, "");
    return ret;
}

String.prototype.paddingLeft = function (paddingValue) {
    return String(paddingValue + this).slice(-paddingValue.length);
};

String.prototype.repeat = function (length) {
    return Array(length + 1).join(this);
};
