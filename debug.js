function assureType(type, x, dx) {
    var rv = x;
    console.log(rv + " = number");
    if (typeof rv !== type) {
        rv = dx;
    }
    return rv;
}

// Shorthand of assureType for numbers
function assureNum(x, dx) {
    return assureType("number", x, dx);
}


exports.assureType = assureType;
exports.assureNumber = assureNum;