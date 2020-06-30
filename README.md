tBTC Stats Bot
==============

This bot aims to tweet daily supply data and minting activity for the [tBTC Network](https://tbtc.network). You can find the bot on Twitter [@tbtcbot](https://twitter.com/tbtcbot)

This bot is built with the [Nest](https://github.com/nestjs/nest) framework for TypeScript and uses [ethers.js](https://github.com/ethers-io/ethers.js) as the Web3 provider

## Features

* Daily tweet covering
  * Current supply
  * Daily increase
  * Daily max and min
* Automated tweets on minting (todo when testnet is active)

## Installation

Copy the `.env.example` file to `.env` and add required environment variables

## Developing

```
yarn install
yarn start:debug
```

## License

[MIT licensed](LICENSE).
