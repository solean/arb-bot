'use strict';
const ccxt = require('ccxt');

class Exchange {
  constructor(exchangeName, apiKey, secret) {
    let exchangeType;
    try {
      exchangeType = ccxt[exchangeName];
    } catch(e) {
        throw new Error('Unsupported exchange...');
    }

    let options = {};
    if (apiKey && secret) {
      options.apiKey = apiKey;
      options.secret = secret;
    }

    this.exchange = new exchangeType(options);
  }

  async getMarkets() {
    return await this.exchange.loadMarkets();
  }

  async getOrderBook(pair) {
    return await this.exchange.fetchOrderBook(pair);
  }

  async getBids(pair) {
    const orderBook = await this.getOrderBook(pair);
    return orderBook.bids;
  }

  async getAsks(pair) {
    const orderBook = await this.getOrderBook(pair);
    return orderBook.asks;
  }

  async getTicker(pair) {
    if (pair) {
      return await this.exchange.fetchTicker(pair);
    } else {
      return await this.exchange.fetchTickers();
    }
  }

  async getBalance(coin) {
    const balance = await this.exchange.fetchBalance();
    return coin ? balance[coin] : balance;
  }

  async createMarketBuyOrder(pair, amount) {
    // return await this.exchange.createMarketBuyOrder(pair, amount);
  }

  async createLimitBuyOrder(pair, amount, price) {
    // return await this.exchange.createLimitBuyOrder(pair, amount, price);
  }

  async createMarketSellOrder(pair, amount) {
    // return await this.exchange.createMarketSellOrder(pair, amount);
  }

  async createLimitSellOrder(pair, amount, price) {
    // return await this.exchange.createLimitSellOrder(pair, amount, price);
  }

  async getOrder(id, symbol) {
    return await this.exchange.fetchOrder(id, symbol);
  }

  async getOrders(pair, type) {
    if (type === 'open') {
      return await this.exchange.fetchOpenOrders(pair);
    } else if (type === 'closed') {
      return await this.exchange.fetchClosedOrders(pair);
    } else {
      return await this.exchange.fetchOrders(pair);
    }
  }

  async cancelOrder(id, symbol) {
    return await this.exchange.cancelOrder(id, symbol);
  }

  async getCurrentPrice(pair) {
    const orderBook = await this.getOrderBook(pair);
    const bid = orderBook.bids.length ? orderBook.bids[0][0] : undefined;
    const ask = orderBook.asks.length ? orderBook.asks[0][0] : undefined;
    const spread = (bid && ask) ? ask - bid : undefined;
    return {
      bid,
      ask,
      spread
    };
  }

  async getCandles(pair, timeFrame) {
    if (!this.exchange.has.fetchOHLCV) {
      throw new Error('Sorry, this exchange doesn\'t have support for OHLCV candlestick chart data.');
    }

    return await this.exchange.fetchOHLCV(pair, timeFrame);
  }
}

module.exports = Exchange;

