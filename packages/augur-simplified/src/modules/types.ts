import { ReactNode, MouseEvent } from 'react';
import { Getters } from '@augurproject/sdk';
import { BUY, SELL } from 'modules/constants';
import type {
  Address,
  MarketInfo,
  PayoutNumeratorValue,
  MarketInfoOutcome,
  DisputeInfo,
  MarketOrderBookOrder,
  OutcomeOrderBook,
  MarketOrderBook,
  MarketTradingHistory,
  Orders,
} from '@augurproject/sdk-lite';
import type { TransactionMetadataParams, EthersSigner } from '@augurproject/contract-dependencies-ethers';
import type { BigNumber } from 'utils/create-big-number';
import type { Template } from '@augurproject/templates';
import { JsonRpcProvider } from "ethers/providers";

export enum SizeTypes {
  SMALL = 'small',
  NORMAL = 'normal',
  LARGE = 'large',
}

export interface TextLink {
  text: string;
  link?: string;
  linkText?: string;
  lighten?: boolean;
}

export interface TextObject {
  title: string;
  subheader: TextLink[];
}

export interface Alert {
  id: string;
  uniqueId: string;
  toast: boolean;
  title: string;
  name: string;
  description: string;
  timestamp: number;
  href: string;
  action: any;
  status: string;
  seen: boolean;
  level: string;
  params: object;
}

export interface TimezoneDateObject {
  formattedUtc: string;
  formattedLocalShortDateTimeWithTimezone: string;
  timestamp: number;
}

export interface DateFormattedObject {
  clockTimeLocal: string;
  clockTimeUtc: string;
  formattedLocalShortDate: string;
  formattedLocalShortDateSecondary: string;
  formattedLocalShortDateTimeNoTimezone: string;
  formattedLocalShortDateTimeNoSecNoTimezone: string;
  formattedLocalShortDateTimeWithTimezone: string;
  formattedLocalShortWithUtcOffset: string;
  formattedLocalShortWithUtcOffsetWithoutSeconds: string;
  formattedShortTime: string;
  formattedShortUtc: string;
  formattedSimpleData: string;
  formattedUtc: string;
  formattedUtcShortDate: string;
  formattedUtcShortTime: string;
  timestamp: number;
  utcLocalOffset: number;
  value: Date;
}

export interface ValueLabelPair {
  label: string;
  value: string | FormattedNumber;
  useFull?: boolean;
}
export interface CoreStats {
  availableFunds: ValueLabelPair;
  frozenFunds: ValueLabelPair;
  totalFunds: ValueLabelPair;
  realizedPL: ValueLabelPair;
}
export interface MarketInfos {
  [marketId: string]: MarketInfo;
}
export interface Outcomes extends MarketInfoOutcome {
  name?: string;
}
export interface ConsensusFormatted extends PayoutNumeratorValue {
  winningOutcome: string | null;
  outcomeName: string | null;
}

export interface OutcomeFormatted extends MarketInfoOutcome {
  marketId: string;
  description: string;
  lastPricePercent: FormattedNumber | null;
  lastPrice: FormattedNumber | null;
  volumeFormatted: FormattedNumber;
  isTradeable: boolean;
}

export interface MarketData extends MarketInfo {
  id: string;
  description: string;
  marketId: string;
  marketStatus: string;
  marketType: string;
  tickSize: string;
  numTicks: string;
  defaultSelectedOutcomeId: number;
  minPrice: string;
  maxPrice: string;
  minPriceBigNumber: BigNumber;
  maxPriceBigNumber: BigNumber;
  noShowBondAmountFormatted: FormattedNumber;
  creationTimeFormatted: DateFormattedObject;
  endTimeFormatted: DateFormattedObject;
  endTime: number;
  reportingState: string;
  reportingFeeRatePercent: FormattedNumber;
  marketCreatorFeeRatePercent: FormattedNumber;
  settlementFeePercent: FormattedNumber;
  openInterestFormatted: FormattedNumber;
  volumeFormatted: FormattedNumber;
  unclaimedCreatorFeesFormatted: FormattedNumber;
  marketCreatorFeesCollectedFormatted: FormattedNumber;
  finalizationTimeFormatted: DateFormattedObject | null;
  finalizationTime: number | null;
  isArchived: boolean;
  disputeInfo: DisputeInfo;
  consensusFormatted: ConsensusFormatted | null;
  outcomesFormatted: OutcomeFormatted[];
  isTemplate: boolean;
  pending?: boolean;
  status?: string;
  hasPendingLiquidityOrders?: boolean;
  noShowBondAmount: string;
  isWarpSync: boolean;
  scalarDenomination: string | null;
  author: string;
  isForking?: boolean;
  orderBook?: { [outcome: number]: LiquidityOrder[] };
  setEndTime?: string;
}

export interface ForkingInfo {
  forkEndTime: number;
  forkAttoReputationGoal: BigNumber;
  forkingMarket: string;
  forkAttoThreshold: BigNumber;
  isForkingMarketFinalized: boolean;
  winningChildUniverseId?: string;
}
export interface Universe extends Getters.Universe.UniverseDetails {
  outcomeName: string;
  creationTimestamp: number;
  usersRep: string;
  totalRepSupply: string;
  totalOpenInterest: string;
  numberOfMarkets: number;
  warpSyncHash: string;
  children: null | Array<Getters.Universe.UniverseDetails>;
  parentUniverseId: null | string;
  id: null | string;
  disputeWindow: {
      address: Address;
      startTime: number;
      endTime: number;
      purchased: string;
      fees: string;
  };
  forkingInfo?: ForkingInfo;
  forkEndTime?: string;
  timeframeData?: Getters.Platform.PlatformActivityStatsResult;
  maxMarketEndTime?: number;
}

export interface UserReports {
  markets?: {
    [universeId: string]: string;
  };
}
export interface FormattedNumber {
  fullPrecision: number | string;
  roundedValue: number | string;
  roundedFormatted: string;
  formatted: string;
  formattedValue: number | string;
  denomination: string;
  minimized: string;
  value: number;
  rounded: number | string;
  full: number | string;
  percent: number | string;
}

export interface FormattedNumberOptions {
  decimals?: number;
  decimalsRounded?: number;
  denomination?: Function;
  roundUp?: boolean;
  roundDown?: boolean;
  positiveSign?: boolean;
  zeroStyled?: boolean;
  minimized?: boolean;
  blankZero?: boolean;
  bigUnitPostfix?: boolean;
  removeComma?: boolean;
  precisionFullLabel?: boolean;
}

export interface CreateMarketData {
  id?: string;
  txParams: TransactionMetadataParams;
  endTime: DateFormattedObject;
  description: string;
  hash: string;
  pending: boolean;
  recentlyTraded: DateFormattedObject;
  creationTime: DateFormattedObject;
  marketType: string;
  pendingId: string;
  orderBook?: OutcomeOrderBook;
}

export interface PendingQueue {
  [queueName: string]: {
    [pendingId: string]: {
      status: string;
      blockNumber: number;
      hash: string;
      parameters?: UIOrder | NewMarket;
      data: CreateMarketData;
    };
  };
}
export interface PendingOrdersType {
  [marketId: string]: UIOrder[];
}

export interface QuantityOrderBookOrder
  extends MarketOrderBookOrder {
  quantityScale: number;
  percent: number;
  mySize: string;
  price: string;
  cumulativeShares: string;
}
export interface QuantityOutcomeOrderBook {
  spread: string | BigNumber | null;
  bids: QuantityOrderBookOrder[];
  asks: QuantityOrderBookOrder[];
}

export interface OutcomeTestTradingOrder {
  [outcomeId: number]: TestTradingOrder[];
}
export interface TestTradingOrder {
  disappear: boolean;
  avgPrice: FormattedNumber;
  cumulativeShares: string;
  id: string;
  mySize: string;
  orderEstimate: BigNumber;
  outcomeId: string;
  outcomeName: string;
  price: string;
  quantity: string;
  shares: string;
  sharesEscrowed: FormattedNumber;
  tokensEscrowed: FormattedNumber;
  type: string;
  unmatchedShares: FormattedNumber;
}
export interface OrderBooks {
  [marketId: string]: MarketOrderBook;
}
export interface IndividualOutcomeOrderBook {
  spread: string | BigNumber | null;
  bids: MarketOrderBookOrder[];
  asks: MarketOrderBookOrder[];
}
export interface MyPositionsSummary {
  currentValue: FormattedNumber;
  totalPercent: FormattedNumber;
  totalReturns: FormattedNumber;
  valueChange: FormattedNumber;
  valueChange24Hr: FormattedNumber;
}

export interface Notification {
  id: string;
  type: string;
  isImportant: boolean;
  redIcon?: boolean;
  isNew: boolean;
  isRead: boolean;
  lastUpdated?: number | null;
  title: string;
  buttonLabel: string;
  buttonAction: ButtonActionType;
  Template: ReactNode;
  market: MarketData;
  markets: string[];
  claimReportingFees?: object;
  totalProceeds?: number;
  queueName?: string;
  queueId?: string;
  hideCheckbox?: boolean;
  hideNotification?: boolean;
  dontShowNotificationButton?: boolean;
}

export interface OrderStatus {
  orderId: string;
  status: string;
  marketId: string;
  outcome: any;
  orderTypeLabel: string;
}

export interface OrderCancellations {
  [orderId: string]: { status: string };
}

export interface UIOrder {
  id: string;
  outcomeName: string;
  outcomeId: number;
  marketId: string;
  amount: string;
  price: string;
  fullPrecisionAmount: string;
  fullPrecisionPrice: string;
  type: string;
  orderEstimate?: string;
  cumulativeShares?: number;
  status?: string;
  hash?: string;
  numTicks: number;
  minPrice: string;
  creationTime?: DateFormattedObject;
  blockNumber?: number;
}

export interface CreateLiquidityOrders {
  marketId: string;
  chunkOrders: boolean;
}
export interface LiquidityOrders {
  [txParamHash: string]: {
    [outcome: number]: LiquidityOrder[];
  };
}

export interface LiquidityOrder {
  id?: string;
  outcome?: string; // TODO: need to be consistent with outcome naming and type
  index?: number;
  quantity: BigNumber;
  price: BigNumber;
  type: string;
  orderEstimate: BigNumber;
  outcomeName: string;
  outcomeId: number;
  status?: string;
  hash?: string;
  mySize?: string;
  cumulativeShares?: string;
  shares: string;
}
export interface NewMarketPropertiesValidations {
  description?: string;
  categories?: string[];
  type?: string;
  designatedReporterType?: string;
  designatedReporterAddress?: string;
  setEndTime?: string;
  hour?: string;
  minute?: string;
  meridiem?: string;
  outcomes?: string | string[];
  settlementFee?: string;
  affiliateFee?: string;
  inputs?: NewMarketPropertiesValidations[];
}

export interface NewMarketPropertyValidations {
  description?: string;
  settlementFee?: string;
  scalarDenomination?: string;
  affiliateFee?: string;
  inputs?: NewMarketPropertiesValidations[];
  outcomes?: string | string[];
}

export interface DateTimeComponents {
  endTime: number;
  endTimeFormatted: DateFormattedObject;
  setEndTime: number;
  hour: string;
  minute: string;
  meridiem: string;
  offsetName: string;
  offset: number;
  timezone: string;
}
export interface NewMarket {
  uniqueId: string;
  isValid: boolean;
  validations: NewMarketPropertiesValidations | NewMarketPropertyValidations;
  currentStep: number;
  type: string;
  outcomes: string[];
  outcomesFormatted: OutcomeFormatted[];
  scalarBigNum: string;
  scalarDenomination: string;
  description: string;
  designatedReporterType: string;
  designatedReporterAddress: string;
  minPrice: string;
  maxPrice: string;
  endTime: number;
  endTimeFormatted: DateFormattedObject;
  setEndTime: number;
  tickSize: number;
  numTicks: number;
  hour: string;
  minute: string;
  meridiem: string;
  marketType: string;
  detailsText: string;
  navCategories: string[];
  categories: string[];
  settlementFee: number;
  settlementFeePercent: FormattedNumber;
  affiliateFee: number;
  orderBook: { [outcome: number]: LiquidityOrder[] };
  orderBookSorted: { [outcome: number]: LiquidityOrder[] };
  minPriceBigNumber: BigNumber;
  maxPriceBigNumber: BigNumber;
  initialLiquidityDai: BigNumber;
  initialLiquidityGas: BigNumber;
  creationError: string;
  offsetName: string;
  offset: number;
  timezone: string;
  template: Template;
}

export interface LinkContent {
  content: string;
  link?: string;
}

export interface Draft {
  uniqueId: string;
  created: number;
  updated: number;
  isValid: boolean;
  validations:
    | NewMarketPropertiesValidations[]
    | NewMarketPropertyValidations[];
  currentStep: number;
  type: string;
  outcomes: string[];
  scalarBigNum: string;
  scalarDenomination: string;
  description: string;
  designatedReporterType: string;
  designatedReporterAddress: string;
  minPrice: string;
  maxPrice: string;
  endTime: number;
  tickSize: string;
  hour: string;
  minute: string;
  meridiem: string;
  marketType: string;
  detailsText: string;
  categories: string[];
  settlementFee: number;
  affiliateFee: number;
  orderBook: { [outcome: number]: LiquidityOrder[] };
  orderBookSorted: { [outcome: number]: LiquidityOrder[] };
  initialLiquidityDai: any; // TODO: big number type
  initialLiquidityGas: any; // TODO: big number type
  creationError: string;
  template: Template;
}

export interface Drafts {
  [uniqueId: string]: Draft;
}

export interface Analytics {
  [id: string]: Analytic;
}

export interface Analytic {
  type: string;
  eventName: string;
  payload: AnalyticPayload;
}

export interface AnalyticPayload {
  addedTimestamp: number;
  userAgent: string;
}

export interface MarketsList {
  isSearching: boolean;
  meta: {
    filteredOutCount: number;
    marketCount: number;
    categories: object;
  };
  allCategoriesMeta: {
    filteredOutCount: number;
    marketCount: number;
    categories: object;
  };
  selectedCategories: string[];
  selectedCategory: string;
  marketCardFormat: string;
  isSearchInPlace: boolean;
  sportsGroupTypeFilter: string;
  numFutures: number;
  numDailies: number;
}

export interface DefaultOrderProperties {
  orderPrice: string;
  orderQuantity: string;
  selectedNav: string;
}

export interface LoadReportingMarketsOptions {
  limit: number;
  offset: number;
  userPortfolioAddress?: string;
  sortByRepAmount?: boolean;
  sortByDisputeRounds?: boolean;
  search?: string;
  reportingStates?: string[];
}

export interface ReportingListState {
  [reportingState: string]: {
    marketIds: string[];
    params: Partial<LoadReportingMarketsOptions>;
    isLoading: boolean;
  };
}
export interface FilledOrders {
  [account: string]: MarketTradingHistory;
}

export interface OpenOrders {
  [account: string]: Orders;
}

export interface GasPriceInfo {
  average: number;
  fast: number;
  safeLow: number;
  userDefinedGasPrice: number;
}

export enum INVALID_OPTIONS {
  Show = 'show',
  Hide = 'hide',
}

export interface FilterSortOptions {
  marketFilter: string;
  sortBy: string;
  maxFee: string;
  maxLiquiditySpread: string;
  includeInvalidMarkets: INVALID_OPTIONS;
  transactionPeriod: string;
  templateFilter: string;
  marketTypeFilter: string;
  limit: number;
  offset: number;
}

export interface Favorite {
  [marketId: string]: number;
}

export interface Endpoints {
  ethereumNodeHTTP: string;
  ethereumNodeWS: string;
}

export interface Category {
  categoryName: string;
  nonFinalizedOpenInterest: string;
  openInterest: string;
  tags: Array<string>;
}

export interface Blockchain {
  currentBlockNumber: number;
  lastSyncedBlockNumber: number;
  blocksBehindCurrent: number;
  percentSynced: string;
  currentAugurTimestamp: number;
}

export interface AppStatus {
  isHelpMenuOpen: boolean;
  ethToDaiRate: FormattedNumber;
  repToDaiRate: FormattedNumber;
  usdcToDaiRate: FormattedNumber;
  usdtToDaiRate: FormattedNumber;
}

export interface AccountPositionAction {
  marketId: string;
  positionData: AccountPosition;
}

export interface AccountPosition {
  [market: string]: {
    tradingPositionsPerMarket?: Getters.Users.MarketTradingPosition;
    tradingPositions: {
      [outcomeId: number]: Getters.Users.TradingPosition;
    };
  };
}

export interface UnrealizedRevenue {
  unrealizedRevenue24hChangePercent: string;
}

// TODO: to be provided by SDK the comes from user stats
export interface TimeframeData {
  positions: number;
  numberOfTrades: number;
  marketsTraded: number;
  marketsCreated: number;
  successfulDisputes: number;
  redeemedPositions: number;
}
export interface AccountBalances {
  eth: string;
  rep: string;
  dai: string;
  usdt: string;
  usdc: string;
  legacyRep: string;
  attoRep: string;
  legacyAttoRep?: string;
  signerBalances: {
    eth: string;
    rep: string;
    dai: string;
    usdc: string;
    usdt: string
    legacyRep: string;
  }
}

export interface LoginAccountMeta {
  accountType: string;
  address: string;
  signer: any | EthersSigner;
  provider: JsonRpcProvider;
  isWeb3: boolean;
  profileImage?: string;
  email?: string;
  openWallet?: Function;
}

export interface LoginAccountSettings {
  showInvalidMarketsBannerFeesOrLiquiditySpread?: boolean;
  showInvalidMarketsBannerHideOrShow?: boolean;
  templateFilter?: string;
  maxFee?: string;
  maxLiquiditySpread?: INVALID_OPTIONS;
  includeInvalidMarkets?: string;
  spread?: boolean;
  marketTypeFilter?: boolean;
  marketFilter?: string;
  showInvalid?: boolean;
  sortBy?: string;
  limit?: number;
  offset?: number;
}

export interface LoginAccount {
  address?: string;
  mixedCaseAddress?: string;
  meta?: LoginAccountMeta;
  totalFrozenFunds?: string;
  totalRealizedPL?: string;
  totalOpenOrdersFrozenFunds?: string;
  tradingPositionsTotal?: UnrealizedRevenue;
  timeframeData?: TimeframeData;
  tradingApproved?: boolean;
  currentOnboardingStep?: number;
  balances: AccountBalances;
  reporting: Getters.Accounts.AccountReportingHistory;
  settings?: LoginAccountSettings;
  affiliate?: string;
}

export interface Web3 {
  currentProvider: any;
}

export interface WindowApp extends Window {
  app?: any;
  web3?: Web3;
  ethereum?: {
    selectedAddress;
    networkVersion: string;
    isMetaMask?: boolean;
    on?: Function;
    enable?: Function;
    send?: Function;
    request?: Function;
    chainId?: string;
  };
  localStorage: Storage;
  integrationHelpers: any;
  fm?: any;
  torus?: any;
  portis?: any;
  stores?: {
    appStatus?: any;
    markets?: any;
    betslip?: any;
    trading?: any;
    pendingOrders?: any;
  },
  appStatus?: any;
  markets?: any;
  betslip?: any;
  trading?: any;
  pendingOrders?: any;
  showIndexedDbSize?: Function;
}

export type ButtonActionType = (
  event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>
) => void;

export type NodeStyleCallback = (
  err: Error | string | null,
  result?: any
) => void;

export type DataCallback = (result?: any) => void;

export interface EthereumWallet {
  appId: string;
  appIds: string[];
  archived: boolean;
  deleted: boolean;
  sortIndex: number;
  id: string;
  type: string;
  keys: { ethereumAddress: string };
}

export interface EdgeUiAccount {
  signEthereumTransaction: Function;
  getFirstWalletInfo: Function;
  createCurrencyWallet: Function;
  username: string;
}

export interface WalletObject {
  address: string;
  balance: string;
  derivationPath: Array<number>;
  serializedPath: string;
}

export interface Trade {
  numShares: FormattedNumber;
  limitPrice: FormattedNumber;
  potentialDaiProfit: FormattedNumber;
  potentialDaiLoss: FormattedNumber;
  totalCost: FormattedNumber;
  sharesFilled: FormattedNumber;
  shareCost: FormattedNumber;
  side: typeof BUY | typeof SELL;
  orderShareProfit: FormattedNumber;
  orderShareTradingFee: FormattedNumber;
  numFills: number;
  selfTrade: boolean;
  loopLimit: number;
  gasLimit?: BigNumber;
}

export interface PriceTimeSeriesData {
  tokenVolume: number;
  period: number;
  open: number;
  close: number;
  low: number;
  high: number;
  volume: number;
  shareVolume: number;
}

export interface MarketClaimablePositions {
  markets: MarketData[];
  totals: {
    totalUnclaimedProfit: BigNumber;
    totalUnclaimedProceeds: BigNumber;
    totalFees: BigNumber;
  };
  positions: {
    [marketId: string]: {
      unclaimedProfit: string;
      unclaimedProceeds: string;
      fee: string;
    };
  };
}

export interface ClaimReportingOptions {
  reportingParticipants: string[];
  disputeWindows: string[];
  estimateGas?: boolean;
  disavowed?: boolean;
  isForkingMarket?: boolean;
}

export interface MarketReportContracts {
  marketId: string;
  contracts: string[];
  totalAmount: BigNumber;
  marketObject: MarketData;
}

export interface marketsReportingCollection {
  unclaimedRep: BigNumber;
  marketContracts: MarketReportContracts[];
}

export interface MarketReportClaimableContracts {
  claimableMarkets: marketsReportingCollection;
  participationContracts: {
    contracts: string[];
    unclaimedDai: BigNumber;
    unclaimedRep: BigNumber;
  };
  totalUnclaimedDai: BigNumber;
  totalUnclaimedRep: BigNumber;
  totalUnclaimedDaiFormatted: FormattedNumber;
  totalUnclaimedRepFormatted: FormattedNumber;
}

export interface DisputeInputtedValues {
  inputStakeValue: string;
  inputToAttoRep: string;
}

export interface NavMenuItem {
  route: string;
  title: string;
  requireLogin?: boolean;
  disabled?: boolean;
  showAlert?: boolean;
  button?: boolean;
  alternateStyle?: boolean;
}

export interface SortedGroup {
  value: string;
  label: string;
  subGroup?: Array<SortedGroup>;
  autoCompleteList?: Array<SortedGroup>;
}

export interface CategoryList {
  [category: string]: [
    {
      [category: string]: [
        {
          [index: number]: string;
        }
      ];
    }
  ];
}

export interface Initialized3box {
  address?: string;
  box?: any;
  profile?: object;
  openComments?: boolean;
}
