"use strict";

var assign = require("lodash.assign");
var immutableDelete = require("immutable-delete");
var speedomatic = require("speedomatic");
var getMarketCreationCost = require("./get-market-creation-cost");
var api = require("../api");
var encodeTag = require("../format/tag/encode-tag");

/**
 * @param {Object} p Parameters object.
 * @param {string} p.universe Universe on which to create this market.
 * @param {number} p._endTime Market expiration timestamp, in seconds.
 * @param {string=} p._feePerEthInWei Amount of wei per ether settled that goes to the market creator, as a base-10 string.
 * @param {string} p._denominationToken Ethereum address of the token used as this market's currency.
 * @param {string} p._designatedReporterAddress Ethereum address of this market's designated reporter.
 * @param {number} p._numOutcomes Number of outcomes this market has, as an integer on [2, 8].
 * @param {string} p._topic The topic (category) to which this market belongs, as a UTF8 string.
 * @param {string} p._description Description of the market, as a UTF8 string.
 * @param {Object=} p._extraInfo Extra info which will be converted to JSON and logged to the chain in the CreateMarket event.
 * @param {{signer: buffer|function, accountType: string}=} p.meta Authentication metadata for raw transactions.
 * @param {function} p.onSent Called if/when the createCategoricalMarket transaction is broadcast to the network.
 * @param {function} p.onSuccess Called if/when the createCategoricalMarket transaction is sealed and confirmed.
 * @param {function} p.onFailed Called if/when the createCategoricalMarket transaction fails.
 */
function createCategoricalMarket(p) {
  // createCategoricalMarket(uint256 _endTime, uint256 _feePerEthInWei, ICash _denominationToken, address _designatedReporterAddress, uint8 _numOutcomes, bytes32 _topic, string _description, string _extraInfo)
  getMarketCreationCost({ universe: p.universe }, function (err, marketCreationCost) {
    if (err) return p.onFailed(err);
    var createCategoricalMarketParams = assign({}, immutableDelete(p, ["universe"]), {
      tx: {
        to: p.universe,
        value: speedomatic.fix(marketCreationCost.etherRequiredToCreateMarket, "hex"),
        gas: "0x632ea0",
      },
      _minPrice: speedomatic.fix(p._minPrice, "hex"),
      _maxPrice: speedomatic.fix(p._maxPrice, "hex"),
      _topic: encodeTag(p._topic),
      _extraInfo: JSON.stringify(p._extraInfo || {}),
    });
    console.log("createCategoricalMarketParams:", createCategoricalMarketParams);
    api().Universe.createCategoricalMarket(createCategoricalMarketParams);
  });
}

module.exports = createCategoricalMarket;
