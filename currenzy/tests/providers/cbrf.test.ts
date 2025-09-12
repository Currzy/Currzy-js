// tests/providers/cbrf.test.ts
import { describe, it, expect } from 'vitest';
import { Currenzy } from '@src/index';
import chalk from 'chalk';

describe('CBRF Provider', () => {
    it('fetches rates, checks individual rates and performs conversions', async () => {
        const api = new Currenzy('cbrf');
        await api.updateRates();

        // ===== Все курсы относительно USD =====
        console.log(chalk.cyan('\n===== Все курсы относительно USD ====='));
        const ratesToUSD = api.getAllRatesTo('USD');
        console.table(ratesToUSD);

        // ===== Все курсы относительно RUB =====
        console.log(chalk.cyan('\n===== Все курсы относительно RUB ====='));
        const ratesToRUB = api.getAllRatesTo('RUB');
        console.table(ratesToRUB);

        // ===== Проверка отдельных курсов =====
        console.log(chalk.cyan('===== Проверка отдельных курсов ====='));
        const testCurrencies = ['USD', 'EUR', 'RUB', 'AMD', 'GBP', 'JPY'];
        for (const code of testCurrencies) {
            const rate = api.getRate(code);
            console.log(`${code} ->`, rate.toFixed(4));
            expect(rate).toBeTypeOf('number'); // проверка типа
        }

        // ===== Проверка конверсий =====
        console.log(chalk.cyan('\n===== Проверка конверсий ====='));
        const conversionTests: [number, string, string][] = [
            [100, 'USD', 'RUB'],
            [1000, 'RUB', 'USD'],
            [50, 'EUR', 'USD'],
            [1, 'RUB', 'AMD'],
            [123, 'GBP', 'JPY'],
            [100, 'USD', 'EUR'],
            [1, 'AMD', 'RUB']
        ];

        for (const [amount, from, to] of conversionTests) {
            const converted = api.convert(amount, from, to);
            const back = api.convert(converted, to, from);
            console.log(
                `${amount} ${from} -> ${to} = ${converted.toFixed(4)} | обратная конверсия: ${back.toFixed(4)}`
            );
            expect(converted).toBeTypeOf('number');
            expect(back).toBeTypeOf('number');
        }

        // ===== Последнее обновление =====
        console.log(chalk.cyan('\n===== Последнее обновление ====='));
        console.log(api.getLastUpdate());
    });
});
