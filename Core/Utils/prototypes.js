// Credit: https://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format
if (!String.prototype.format) {
    String.prototype.format = function format() {
        const args = arguments[0];
        let text = this;
        for (const elm in args) {
            text = text.replace(`{${elm}}`, match => args[elm] != 'undefined' ? args[elm] : match);
        }
        return text;
    };
}