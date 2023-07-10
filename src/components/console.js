/**
 * Turns an array into a table
 * @param {Object[]} array An array of objects containing the data to reform into a table
 * @returns {string} A table string
 */
const Table = array => {
    if (array.length === 0) {return 'No data found';}
    else {
        const widths = [];
        const cells = [];
        for (let i = 0; i <= array.length; i++) {cells.push([]);}
        for (const s in array[0]) {
            let len = s.length;
            cells[0].push(s);
            for (let i = 0; i < array.length; i++) {
                const ss = '' + array[i][s];
                len = Math.max(len, ss.length);
                cells[i + 1].push(ss);
            }
            widths.push(len);
        }
        let s = '   ';
        for (let x = 0; x < cells.length; x++) {
            for (let y = 0; y < widths.length; y++) {s += '^3 | ' + pad(widths[y], cells[x][y]);}
            s += '^3 |\n   ';
        }
        return s;
    }

    function pad(n, s) {
        let res = s;
        for (let i = s.length; i < n; i++) {res += ' ';}
        return res;
    }
};

module.exports = {
    Table
};