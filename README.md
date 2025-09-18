<div align="center">
  <h1>Currzy — currency library</h1>
</div>

💱 **Free, open-source library** for fetching, managing, and converting up-to-date currency rates from multiple reliable sources, with the ability to easily choose your provider.

> 📚 For more detailed documentation and advanced usage, visit [Currenzy Docs](https://your-docs-link-here.com).

## Features

- Get current exchange rates for supported currencies.
- Convert amounts between different currencies.
- Cache rates locally to reduce API calls (cache expires after 1 hour).
- Clear the cache manually when needed.
- Easily switch between providers (e.g., `CBRF`).

## Installation
```bash
npm i currenzy-lib
```

## Usage
```javascript
import { Currenzy } from "currenzy-lib";

async function main() {
  // Initialize with a provider
  const currenzy = new Currenzy("cbrf");

  // Get the rate of EUR to USD
  const rate = await currenzy.getRate("EUR", "USD");
  console.log(`1 USD = ${rate.toFixed(4)} EUR`);

  // Convert 100 USD to EUR
  const converted = await currenzy.convert(100, "USD", "EUR");
  console.log(`100 USD = ${converted.toFixed(2)} EUR`);

  // Get all rates relative to USD
  const allRates = await currenzy.getAllRatesTo("USD");
  console.log(allRates);

  // Get last update date
  console.log("Last update:", currenzy.getLastUpdate());

  // Clear cache manually
  await currenzy.clearCache();
  console.log("Cache cleared.");
}

main();
```

## Notes
- Each provider may have its own methods
- Rates are cached locally for <strong>1 hour</strong> to minimize API requests.
- Cache can be cleared manually via ```currenzy.clearCache()```

## Supported Currencies (CbrfProvider)
| AUD | AZN | DZD | GBP | AMD | BHD | BYN | BGN | BOB | BRL |
|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| HUF | VND | HKD | GEL | DKK | AED | USD | EUR | EGP | INR |
| IDR | IRR | KZT | CAD | QAR | KGS | CNY | CUP | MDL | MNT |
| NGN | NZD | NOK | OMR | PLN | SAR | RON | XDR | SGD | TJS |
| THB | BDT | TRY | TMT | UZS | UAH | CZK | SEK | CHF | ETB |
| RSD | ZAR | KRW | JPY | MMK | RUB |     |     |     |     |

