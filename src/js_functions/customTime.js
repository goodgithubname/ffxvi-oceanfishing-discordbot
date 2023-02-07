Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + (h * 60 * 60 * 1000));
    return this;
}

Date.prototype.setZero = function () {
    this.setTime(this.getTime() - (this.getMinutes() * 60 * 1000));
    return this;
}