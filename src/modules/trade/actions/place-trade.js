import async from 'async';
import BigNumber from 'bignumber.js';
import { BUY, SELL } from '../../trade/constants/types';
import { ZERO } from '../../trade/constants/numbers';
import { augur, abi, constants } from '../../../services/augurjs';
import { addTradeTransaction } from '../../transactions/actions/add-trade-transaction';
import { selectMarket } from '../../market/selectors/market';
import { clearTradeInProgress } from '../../trade/actions/update-trades-in-progress';
import { updateTradeCommitLock } from '../../trade/actions/update-trade-commit-lock';
import { selectTransactionsLink } from '../../link/selectors/links';
import { calculateSellTradeIDs, calculateBuyTradeIDs } from '../../trade/actions/helpers/calculate-trade-ids';
import { addBidTransaction } from '../../transactions/actions/add-bid-transaction';
import { addAskTransaction } from '../../transactions/actions/add-ask-transaction';
import { addShortSellTransaction } from '../../transactions/actions/add-short-sell-transaction';
import { addShortAskTransaction } from '../../transactions/actions/add-short-ask-transaction';

export function placeTrade(marketID) {
	return (dispatch, getState) => {
		const { tradesInProgress, outcomesData, orderBooks, loginAccount } = getState();
		const marketTradeInProgress = tradesInProgress[marketID];
		console.log('market trade in progress:', marketTradeInProgress);
		const market = selectMarket(marketID);
		if (!marketTradeInProgress || !market) {
			return;
		}
		async.forEachOf(marketTradeInProgress, (outcomeTradeInProgress, outcomeID, nextOutcome) => {
			console.log('outcomeTradeInProgress', outcomeID, outcomeTradeInProgress);
			if (!outcomeTradeInProgress || !outcomeTradeInProgress.limitPrice || !outcomeTradeInProgress.numShares || !outcomeTradeInProgress.totalCost) {
				return nextOutcome(outcomeTradeInProgress || 'outcome trade in progress not found');
			}
			const totalCost = Math.abs(outcomeTradeInProgress.totalCost);
			if (outcomeTradeInProgress.side === BUY) {
				const tradeIDs = calculateBuyTradeIDs(marketID, outcomeID, outcomeTradeInProgress.limitPrice, orderBooks, loginAccount.id);
				if (tradeIDs && tradeIDs.length) {
					dispatch(updateTradeCommitLock(true));
					dispatch(addTradeTransaction(
						BUY,
						marketID,
						outcomeID,
						market.type,
						market.description,
						outcomesData[marketID][outcomeID].name,
						outcomeTradeInProgress.numShares,
						outcomeTradeInProgress.limitPrice,
						totalCost,
						outcomeTradeInProgress.tradingFeesEth,
						outcomeTradeInProgress.feePercent,
						outcomeTradeInProgress.gasFeesRealEth));
				} else {
					dispatch(addBidTransaction(
						marketID,
						outcomeID,
						market.description,
						outcomesData[marketID][outcomeID].name,
						outcomeTradeInProgress.numShares,
						outcomeTradeInProgress.limitPrice,
						totalCost,
						outcomeTradeInProgress.tradingFeesEth,
						outcomeTradeInProgress.feePercent,
						outcomeTradeInProgress.gasFeesRealEth));
				}
				nextOutcome();
			} else if (outcomeTradeInProgress.side === SELL) {

				// check if user has position
				//  - if so, sell/ask
				//  - if not, short sell/short ask
				const bnNumShares = abi.bignum(outcomeTradeInProgress.numShares);
				augur.getParticipantSharesPurchased(marketID, loginAccount.id, outcomeID, (sharesPurchased) => {
					if (!sharesPurchased || sharesPurchased.error) {
						console.error('getParticipantSharesPurchased:', sharesPurchased);
						return nextOutcome(sharesPurchased || 'shares lookup failed');
					}
					let position = abi.bignum(sharesPurchased);
					if (position && position.gt(ZERO)) {
						if (position.gt(bnNumShares) && outcomeTradeInProgress.side === 'sell' && position.minus(bnNumShares).lt(constants.PRECISION.limit)) {
							outcomeTradeInProgress.numShares = position.toNumber();
						} else {
							position = position.round(constants.PRECISION.decimals, BigNumber.ROUND_DOWN);
						}
					}
					const tradeIDs = calculateSellTradeIDs(marketID, outcomeID, outcomeTradeInProgress.limitPrice, orderBooks, loginAccount.id);
					console.log('outcome trade in progress:', outcomeID, outcomeTradeInProgress);
					if (position && position.gt(ZERO)) {
						if (tradeIDs && tradeIDs.length) {
							dispatch(updateTradeCommitLock(true));
							dispatch(addTradeTransaction(
								SELL,
								marketID,
								outcomeID,
								market.type,
								market.description,
								outcomesData[marketID][outcomeID].name,
								outcomeTradeInProgress.numShares,
								outcomeTradeInProgress.limitPrice,
								totalCost,
								outcomeTradeInProgress.tradingFeesEth,
								outcomeTradeInProgress.feePercent,
								outcomeTradeInProgress.gasFeesRealEth));
						} else {
							let askShares;
							let shortAskShares;
							const numShares = abi.bignum(outcomeTradeInProgress.numShares);
							if (position.gt(numShares)) {
								askShares = outcomeTradeInProgress.numShares;
								shortAskShares = 0;
							} else {
								askShares = position.toNumber();
								shortAskShares = numShares.minus(position).toNumber();
							}
							dispatch(addAskTransaction(
								marketID,
								outcomeID,
								market.description,
								outcomesData[marketID][outcomeID].name,
								askShares,
								outcomeTradeInProgress.limitPrice,
								totalCost,
								outcomeTradeInProgress.tradingFeesEth,
								outcomeTradeInProgress.feePercent,
								outcomeTradeInProgress.gasFeesRealEth));
							if (shortAskShares > 0) {
								dispatch(addShortAskTransaction(
									marketID,
									outcomeID,
									market.description,
									outcomesData[marketID][outcomeID].name,
									shortAskShares,
									outcomeTradeInProgress.limitPrice,
									totalCost,
									outcomeTradeInProgress.tradingFeesEth,
									outcomeTradeInProgress.feePercent,
									outcomeTradeInProgress.gasFeesRealEth));
							}
						}
					} else {
						if (tradeIDs && tradeIDs.length) {
							dispatch(updateTradeCommitLock(true));
							dispatch(addShortSellTransaction(
								marketID,
								outcomeID,
								market.description,
								outcomesData[marketID][outcomeID].name,
								outcomeTradeInProgress.numShares,
								outcomeTradeInProgress.limitPrice,
								totalCost,
								outcomeTradeInProgress.tradingFeesEth,
								outcomeTradeInProgress.feePercent,
								outcomeTradeInProgress.gasFeesRealEth));
						} else {
							dispatch(addShortAskTransaction(
								marketID,
								outcomeID,
								market.description,
								outcomesData[marketID][outcomeID].name,
								outcomeTradeInProgress.numShares,
								outcomeTradeInProgress.limitPrice,
								totalCost,
								outcomeTradeInProgress.tradingFeesEth,
								outcomeTradeInProgress.feePercent,
								outcomeTradeInProgress.gasFeesRealEth));
						}
					}
					nextOutcome();
				});
			}
		});
		dispatch(clearTradeInProgress(marketID));
		selectTransactionsLink(dispatch).onClick();
	};
}
