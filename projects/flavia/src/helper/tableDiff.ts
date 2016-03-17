
/**
 * Таблица конечных разностей вперёд
 */
export class TableDiff {
    x = [];
    y = [];
    delta: number[][] = [];
    start: number;

    /**
     * Конструктор
     * @param func функция
     * @param start пределы
     * @param h шаг
     * @param n максималный порядок конечн разности
     */
    constructor(func: (x: number) => number, start, h, n) {
        if (h <= 0) {
            throw new Error('h <= 0');
        }
        this.start = start;
        for (let x = start; x <= start + n; x+=h) {
            this.x.push(x);
            this.y.push(func(x));
        }
        let {y} = this;

        for (let i = 0; i < start + n; i++) {
            this.delta.push([]);

            if (i == 0) {
                for (let k = 0, len = y.length - 1; k < len; k++) {
                    this.delta[i].push(y[k + 1] - y[k]);
                }
                continue;
            }

            for (let k = 0, len = y.length - i - 1; k < len; k++) {
                this.delta[i].push(this.delta[i - 1][k + 1] - this.delta[i - 1][k]);
            }
        }
    }

    /**
     * Возвращает значение вида Δ^k*y_p
     * @param k
     * @param p
     * @returns {number}
     */
    getDelta(k, p) {
        return this.delta[-this.start + k][p];
    }

    toString() {
        console.table({
            x: this.x,
            y: this.y,
        });
        console.table(this.delta);
    }
}