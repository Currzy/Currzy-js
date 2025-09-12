import { describe, it, expect } from 'vitest';
import { Currenzy } from '../dist';

describe('Currenzy', () => {
    it('должен корректно конвертировать валюты', async () => {
        const currenzy = new Currenzy('cbrf');
        await currenzy.updateRates();
        const result = currenzy.convert(100, 'USD', 'EUR');
        expect(result).toBeGreaterThan(0);
    });
});