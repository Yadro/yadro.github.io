
import {TableDiff} from "./tableDiff";

/**
 * Bessel polynomial interpolation
 */
export class Bessel {
    n: number;
    table: TableDiff;
    delta: (k) => number;

    constructor(func: (x) => number, h: number, n: number) {
        this.n = n;
        this.table = new TableDiff(func, 0, h, 2 * n + 2);
        //this.table.toString();
        this.delta = (k) => (this.table.getDelta(k, 0) + this.table.getDelta(k, 1)) / 2;
    }

    bessel(x: number): number {
        let result = 0;
        for (var i = 0; i < this.n; i++) {
            result += this.bessel_step(x, i, this.delta);
        }
        return result;
    }

    /**
     *
     * @param t
     * @param n узел интерполяции
     * @param delta функция, возвращающая нужный элемент из таблицы разностей
     * @returns {number}
     */
    bessel_step(t: number, n: number, delta: (k) => number): number {
        let qMul = Bessel.calc_t(t, n);
        return (
            (            qMul / Bessel.factorial(2 * n)      * (delta(2 * n)     + delta(2 * n)) / 2) +
            ((t - 1/2) * qMul / Bessel.factorial(2 * n + 1)) * (delta(2 * n + 1) + delta(2 * n + 1)) / 2
        );
    }

    /**
     * Return t(t-1)(t+1)...(t-n-1)(t+n-1)(t-n)(t + n - 1)
     * @param t
     * @param n
     * @returns number
     */
    static calc_t(t: number, n: number) {
        let c = t;
        for (let i = 1; i < n; i++) {
            c *= t - i;
            c *= t + i;
        }
        return c * (t - n) * (t + n - 1);
    }

    static factorial(n: number) {
        let c = 1;
        for (let i = 1; i <= n; i++) {
            c *= i;
        }
        return c;
    }
}