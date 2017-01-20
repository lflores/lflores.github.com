Array.prototype.sortDate = function (property, asc = true) {
    var sorted = this.sort(function (a, b) {
        if (new Date(a[property]).getTime() > new Date(b[property]).getTime()) {

            return typeof asc === 'undefined' || !asc ? -1 : 1;
        } else if (new Date(a[property]).getTime() < new Date(b[property]).getTime()) {
            return typeof asc === 'undefined' || !asc ? 1 : -1;
        }
        return 0;
    });
    return sorted;
}

Array.prototype.print = function () {
    var ret = "";
    for (var i = 0; i < this.length; i++) {
        if (typeof this[i] === "string") {
            ret = this[i];
        } else if (typeof this[i] === "object" && this[i].key) {
            //es un nested
            ret += this[i].key + "\n";
            for (var j = 0; j < this[i].values.length; j++) {
                ret += " ".repeat(4) + this[i].values[j].name + "\n";
            }
        } else if (typeof this[i] === "object" && this[i].header) {
            ret += this[i].name + "\n";
        } else if (typeof this[i] === "object") {
            ret += "\t" + this[i].name + "\n";
        }
    }
    return ret;
}

Array.prototype.flattened = function () {
    var ret = [];
    for (var i = 0; i < this.length; i++) {
        ret.push({
            name: this[i].key,
            header: true
        });
        ret = ret.concat(this[i].values);
    }
    return ret;
};
