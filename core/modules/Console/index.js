/* eslint-disable no-irregular-whitespace */
const { Module } = require('../../modules');

const Printables = [];

module.exports.Module = class Console extends Module {
    constructor(modules) {
        super(modules, {
            name: 'Console',
            description: 'A mere console print module for initial start',
            toggle: true,
            version: '1.0',
            author: 'ItsAmmarB'
        });

        this.coreReady = false;

        this.Ready();
        this.#Exports();

        // eslint-disable-next-line max-statements-per-line
        on('DiscordFramework:Core:Ready', () => {
            this.coreReady = true;
            setTimeout(() => this.Run(), 3000);
        });
    }

    Run() {

        console.log(`^3
        █▀▄ █ █▀ █▀▀ █▀█ █▀█ █▀▄ █▀▀ █▀█ ▄▀█ █▀▄▀█ █▀▀ █ █ █ █▀█ █▀█ █▄▀
        █▄▀ █ ▄█ █▄▄ █▄█ █▀▄ █▄▀ █▀  █▀▄ █▀█ █ ▀ █ ██▄ ▀▄▀▄▀ █▄█ █▀▄ █ █`);
        console.log('^3|==============================================================================|^0');
        Printables.forEach((prnt, index) => {
            if(index !== 0) console.log('      --------------------------------------------------------------------^0');
            console.log(prnt[1] + '^0');

        });
        console.log('^3|==============================================================================|^0');
    }

    AddPrint(module, text) {
        Printables.unshift([module, text]);
    }

    async Error(Err) {
        while (!this.coreReady) {
            await this.Delay(1500);
        }

        await this.Delay(300);

        console.error(Err);
    }

    /**
     * @credits Neil Mitchell
     * @link https://stackoverflow.com/questions/11026475/implement-firebugs-console-table-in-chrome
     */
    Table(xs) {
        if (xs.length === 0) {return 'No data found';} else {
            const widths = [];
            const cells = [];
            for (let i = 0; i <= xs.length; i++) {cells.push([]);}
            for (const s in xs[0]) {
                let len = s.length;
                cells[0].push(s);
                for (let i = 0; i < xs.length; i++) {
                    const ss = '' + xs[i][s];
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
    }

    #Exports() {
        // JS Module Exports
        module.exports.AddPrint = (module, text) => {
            return this.AddPrint(module, text);
        },
        module.exports.PrintError = async (Err) => {
            return await this.PrintError(Err);
        },
        module.exports.Table = (Data) => {
            return this.Table(Data);
        };

        // CFX Export
        emit('DiscordFramework:Export:Create', 'Console', () => {
            return {
                Table:  (Data) => {
                    return this.Table(Data);
                }
            };
        });

    }
};

