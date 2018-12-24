'use strict';
const Exchange = require('./exchange');
const constants = require('./constants');

const binance = new Exchange('binance', constants.BINANCE_KEY, constants.BINANCE_SECRET);
const kucoin = new Exchange('kucoin', constants.KUCOIN_KEY, constants.KUCOIN_SECRET);


class Arby {
  constructor(exchange1, exchange2) {
    this.exchange1 = exchange1;
    this.exchange2 = exchange2;
  }

  getCommonPairs(ex1Tickers, ex2Tickers) {
    let commonPairs = [];
    Object.keys(ex1Tickers).forEach(pair1 => {
      Object.keys(ex2Tickers).forEach(pair2 => {
        if (pair1 === pair2) {
          commonPairs.push(pair1);
        }
      })
    });
    return commonPairs;
  }

  async getPrices(pair) {
    return [ await this.exchange1.getCurrentPrice(pair), await this.exchange2.getCurrentPrice(pair) ];
  }

  async lookForOpps() {
    let results = {};
    const [ ex1Tickers, ex2Tickers] = await Promise.all([ this.exchange1.getTicker(), this.exchange2.getTicker() ]);

    const commonPairs = this.getCommonPairs(ex1Tickers, ex2Tickers);
    debugger;
    commonPairs.forEach(p => {
      const { bid: ex1Bid, ask: ex1Ask } = ex1Tickers[p];
      const { bid: ex2Bid, ask: ex2Ask } = ex2Tickers[p];
      let spread = null;
      if (ex1Bid > ex2Ask) {
        spread = ex1Bid - ex2Ask;
        results[p] = spread;
      } else if (ex2Bid > ex1Ask) {
        spread = ex2Bid - ex1Ask;
        results[p] = spread;
      }
    });
    return results;
  }

}

const arb = new Arby(binance, kucoin);


//arb.getPrices('BCD/BTC').then(console.log);
arb.lookForOpps().then(console.log);

// Kucoin trading fee: 0.1%
// Binance trading fee: 0.05% (with 50% discount from using BNB to pay for fees)
