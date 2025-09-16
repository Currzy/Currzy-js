// tests/providers/cbrf.test.ts
import { describe, it, expect } from 'vitest'
import { Currenzy } from '../../src'

describe('CBRF Provider', () => {
    it('fetches rates, checks individual rates and performs conversions', async () => {
        const api = new Currenzy('cbrf');

        // ===== Все курсы относительно USD =====
        console.log("\n===== Все курсы относительно USD =====");
        const ratesToUSD = await api.getAllRatesTo('USD');
        console.table(ratesToUSD);

        // ===== Все курсы относительно RUB =====
        console.log("\n===== Все курсы относительно RUB =====");
        const ratesToRUB = await api.getAllRatesTo("RUB");
        console.table(ratesToRUB);

        // ===== Проверка отдельных курсов =====
        console.log("===== Проверка отдельных курсов =====");
        const testCurrencies = ["USD", "EUR", "RUB", "AMD", "GBP", "JPY"];

        for (const code of testCurrencies) {
            const rate = await api.getRate(code);
            console.log(`${code} ->`, rate.toFixed(4));
            expect(rate).toBeTypeOf('number');
        }

        // ===== Проверка конверсий =====
        console.log('\n===== Проверка конверсий =====');
        const conversionTests: [number, string, string][] = [
            [100, 'USD', 'RUB'],
            [1000, 'RUB', 'USD'],
            [50, 'EUR', 'USD'],
            [1, 'RUB', 'AMD'],
            [123, 'GBP', 'JPY'],
            [100, 'USD', 'EUR'],
            [1, 'AMD', 'RUB'],
            [8000, 'RUB', 'USD']
        ];

        for (const [amount, from, to] of conversionTests) {
            const converted = await api.convert(amount, from, to);
            const back = await api.convert(converted, to, from);

            console.log(
                `${amount} ${from} -> ${to} = ${converted.toFixed(4)} | обратная конверсия: ${back.toFixed(4)}`
            );

            expect(converted).toBeTypeOf('number');
            expect(back).toBeTypeOf('number');
        }

        // ===== Последнее обновление =====
        console.log('\n===== Последнее обновление =====');
        console.log(api.getLastUpdate());
    });
});
