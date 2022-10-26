// Credit: https://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format
String.prototype.format = function() {
    let formatted = this;
    for (const arg in arguments) {
        formatted = formatted.replace('{' + arg + '}', arguments[arg]);
    }
    return formatted;
};