module.exports = function () {
    if (this.direction === 'custom') {
        if (!areDefinedAndNumbers([
            this.customDirection.x0,
            this.customDirection.x1,
            this.customDirection.y0,
            this.customDirection.y1
        ])) {
            throw new Error('When using a custom direction, the custom object is required with it\'s attributes: x0, x1, y0, y1 of type number');
        }
    }
}

function areDefinedAndNumbers(array) {
    var definedAndNumber = true, i = 0;
    while (definedAndNumber && i < array.length) {
        if (typeof array[i] !== 'number') {
            definedAndNumber = false;
        }
        i++;
    }
    return definedAndNumber;
}