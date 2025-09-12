// eslint-disable-next-line import/no-relative-parent-imports
import { Currenzy } from "../../src/index.ts";
import chalk from 'chalk';

export async function testCbrfProvider() {
    const api = new Currenzy('cbrf');
    await api.updateRates();

    console.log(chalk.cyan('\n===== Все курсы относительно USD ====='));
    const ratesToUSD = api.getAllRatesTo('USD');
    console.table(ratesToUSD);

    console.log(chalk.cyan('\n===== Все курсы относительно RUB ====='));
    const ratesToRUB = api.getAllRatesTo('RUB');
    console.table(ratesToRUB);

    console.log(chalk.cyan('===== Проверка отдельных курсов ====='));
    const testCurrencies = ['USD', 'EUR', 'RUB', 'AMD', 'GBP', 'JPY'];
    for (const code of testCurrencies) {
        console.log(`${code} ->`, api.getRate(code).toFixed(4));
    }

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
    }

    console.log(chalk.cyan('\n===== Последнее обновление ====='));
    console.log(api.getLastUpdate());
}
