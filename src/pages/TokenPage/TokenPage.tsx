// import { openLink } from '@telegram-apps/sdk-react';
import {
  Avatar,
  Input,
  List,
  Text,
} from '@telegram-apps/telegram-ui';

import {
  initDataRaw as _initDataRaw,
  initDataState as _initDataState,
  useSignal,
  // type User,
  // useSignal,
} from '@telegram-apps/sdk-react';

import { FC, useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';

import { Page } from '@/components/Page';
import { WalletAddress } from '@/components/WalletAddress/WalletAddress';
import { BuySellButtons } from '@/components/BuySellButtons/BuySellButtons';
import { PriceChart } from '@/components/PriceChart/PriceChart';
import { Audit } from '@/components/Audit/Audit';
// import { bem } from '@/css/bem';
import { useApi } from '@/api';

import './TokenPage.css';
import { TokenInfo, TokenTxHistoryResponse } from '@/api/services/tokenService';
import { formatMarketCap, formatTimeElapsed, formatSmallNumber } from '@/helpers/formatters';
import { createFloatHandlers, createIntegerHandlers } from '@/helpers/numberInputHandlers';
import { socket } from '@/socket';
// const [, e] = bem('wallet-page');

const getErrorType = (errorType: string) => {
  switch (errorType) {
    case 'insufficient_balance':
      return 'Insufficient balance';
    case 'slippage_error':
      return 'Slippage';
    case 'low_liquidity':
      return 'Low liquidity';
    default:
      return 'Something went wrong';
  }
}

export const TokenPage: FC = () => {
  const initDataRaw = useSignal(_initDataRaw);
  // const initDataState = useSignal(_initDataState);
  const api = useApi(); // This sets up the init data automatically
  const { tokenAddress } = useParams<{ tokenAddress: string }>();
  const [tokenData, setTokenData] = useState<TokenInfo | null>(null);

  const [tokenBalance, setTokenBalance] = useState<number>(0);
  
  // Updated initial values
  const [feeValue, setFeeValue] = useState<string>("0.0001");
  const [slipValue, setSlipValue] = useState<string>("25");
  const [buyValue, setBuyValue] = useState<string>("0.01");
  const [sellValue, setSellValue] = useState<string>("25");
  const [txHistory, setTxHistory] = useState<TokenTxHistoryResponse | null>(null);

  const [tokenPrice, setTokenPrice] = useState<number>(0);
  const [tokenLiquidity, setTokenLiquidity] = useState<number>(0);

  
  // Flag to prevent updates during initial loading
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const [isTxProcessing, setIsTxProcessing] = useState(false);

  const txHistoryRef = useRef<TokenTxHistoryResponse | null>(null);
  
  // Update the ref whenever txHistory changes
  useEffect(() => {
    txHistoryRef.current = txHistory;
  }, [txHistory]);

  // Callback to update settings on the server
  const updateSettings = useCallback(async () => {
    if (isInitialLoad) return;
    
    await api.user.updateSettings({
      priority_fee_in_sol: Number(feeValue),
      slippage_percent: Number(slipValue),
      buy_amount_in_sol: Number(buyValue),
      sell_amount_percent: Number(sellValue),
    })
    .then(() => console.log('Settings updated successfully'))
    .catch(err => console.error('Failed to update settings:', err));
  }, [feeValue, slipValue, buyValue, sellValue, isInitialLoad]);

  // Create handlers with the update callback
  const feeHandlers = createFloatHandlers(setFeeValue);
  const slipHandlers = createIntegerHandlers(setSlipValue);
  const buyHandlers = createFloatHandlers(setBuyValue);
  const sellHandlers = createIntegerHandlers(setSellValue);

  useEffect(() => {
    console.log('initDataRaw', initDataRaw);
    socket.auth = {
      tma: initDataRaw
    };
    socket.connect();

    socket.on('connect', () => {
      console.log('Connected to socket');

      socket.emit('message', {
        "token_address": tokenAddress,
      });

      socket.emit('subscribe_token_metrics', {
        "token_address": tokenAddress,
      });
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from socket');
    });

    const handleTxStatus = (data: any) => {
      console.log('Tx status:', data);
      if (data.status === 'success') {
        setIsTxProcessing(false);
        setTokenBalance(Number(data.token_balance));

        const prevHistory = txHistoryRef.current?.data || [];
        console.log('prevHistory', prevHistory);
        
        setTxHistory({ data: [
          {
            id: prevHistory.length + 1,
            token_id: tokenData?.token.id ?? 0,
            tx_type: data.tx_type,
            wallet_address: "",
            amount_sol: data.amount_sol,
            amount_tokens: data.amount_tokens,
            price_per_token_sol: data.price_per_token_sol,
            tx_hash: data.txId,
            tx_status: "success",
            created_at: new Date().toISOString(),
          },
          ...prevHistory,
        ]});
      } else if (data.status === 'error') {
        setIsTxProcessing(false);
        console.log('Tx failed');

        const prevHistory = txHistoryRef.current?.data || [];
        console.log('prevHistory', prevHistory);
        
        setTxHistory({ data: [
          {
            id: prevHistory.length + 1,
            token_id: 0,
            tx_type: "failed",
            error_type: data.error_type || "",
            wallet_address: "",
            amount_sol: 0,
            amount_tokens: 0,
            price_per_token_sol: 0,
            tx_hash: data.txId,
            tx_status: "error",
            created_at: new Date().toISOString(),
          },
          ...prevHistory,
        ]});

      } else if (data.status === 'pending') {
        console.log('Tx pending');
      }
    };

    socket.on('tx_status', handleTxStatus);

    socket.on('response', (data: any) => {
      console.log('Token price update:', data);
    });

    socket.on('token_metrics_update', (data: any) => {
      console.log('Token metrics update:', data);
      setTokenPrice(data.metrics.token_price_usd);
      setTokenLiquidity(data.metrics.liquidity_usd);
    });

    // Cleanup function to disconnect socket when component unmounts
    return () => {
      socket.disconnect();
      socket.off('connect');
      socket.off('disconnect');
      socket.off('response');
      socket.off('tx_status');
    };
  }, [initDataRaw, tokenData?.token.id]); // Removed txHistory from dependencies

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsInitialLoad(true);
        const settings = await api.user.getSettings();
        
        // Update state with fetched settings
        setFeeValue(settings.priority_fee_in_sol.toString());
        setSlipValue(settings.slippage_percent.toString());
        setBuyValue(settings.buy_amount_in_sol.toString());
        setSellValue(settings.sell_amount_percent.toString());
        
        // After a short delay, allow updates again
        setTimeout(() => {
          setIsInitialLoad(false);
        }, 100);
      } catch (error) {
        console.error("Error fetching settings:", error);
        setIsInitialLoad(false);
      }
    };

    const fetchTokenData = async () => {
      try {
        const data = await api.token.getTokenInfo(tokenAddress || "");
        setTokenData(data);

        setTokenPrice(data.metrics?.price_usd ?? 0);
        setTokenLiquidity(data.metrics?.liquidity?.usd ?? 0);
      } catch (error) {
        console.error("Error fetching token data:", error);
      }
    };

    const fetchTokenBalance = async () => {
      try {
        const balance = await api.token.getTokenBalance(tokenAddress || "");
        setTokenBalance(balance);
      } catch (error) {
        console.error("Error fetching token balance:", error);
      }
    };

    const fetchTxHistory = async () => {
      try {
        const history = await api.token.getTokenTxHistory(tokenAddress || "");
        setTxHistory(history);
      } catch (error) {
        console.error("Error fetching token tx history:", error);
      }
    };

    fetchTokenBalance();
    fetchSettings();
    
    // Initial fetch
    fetchTokenData();

    fetchTxHistory();
    
    // Set up interval for auto-refresh every 15 seconds
    const refreshInterval = setInterval(fetchTokenData, 15000);
    
    // Clean up interval on component unmount
    return () => {
      clearInterval(refreshInterval);
    };
  }, [api, tokenAddress]);

  const handleBuy = () => {
    if (isTxProcessing) return;
    setIsTxProcessing(true);
    console.log(`Buy ${tokenData?.token.symbol || 'token'} at address: ${tokenAddress}`);
    // Implement buy logic or navigation

    socket.emit('submit_tx', {
      "type": "buy",
      "token_address": tokenAddress,
      "amount": buyValue,
      "fee": feeValue,
      "slippage": slipValue,
      "timestamp": new Date().toISOString(),
    });
  };

  const handleSell = () => {
    if (isTxProcessing) return;
    setIsTxProcessing(true);
    console.log(`Sell ${tokenData?.token.symbol || 'token'} at address: ${tokenAddress}`);
    // Implement sell logic or navigation

    socket.emit('submit_tx', {
      "type": "sell",
      "token_address": tokenAddress,
      "amount": sellValue,
      "fee": feeValue,
      "slippage": slipValue,
      "timestamp": new Date().toISOString(),
    });
  };

  return (
    <Page>
      <div className="token-page-content">
        <List>
          {tokenData && (
            <div className="token-header">
              <Avatar src={tokenData.token.image_uri} style={{ backgroundColor: '#000', borderRadius: '100%' }}/>
              <div className="token-title-container">
                <Text weight="1" className="token-title">
                  {tokenData.token.symbol}
                </Text>
                <WalletAddress address={tokenData.token.address} slice={3} className="token-address" />
              </div>
              <div className="token-info-container">
                <div>
                  <Text className="token-info-label">
                    5m Vol
                  </Text>
                  <Text className="token-info-value">
                    ${formatMarketCap(tokenData.metrics?.volume?.m5 ?? 0)}
                  </Text>
                </div>
                <div>
                  <Text className="token-info-label">
                    Trades
                  </Text>
                  <Text className="token-info-value">
                    {(tokenData.metrics?.txns?.m5.buys ?? 0) + (tokenData.metrics?.txns?.m5.sells ?? 0)}
                  </Text>
                </div>
                <div>
                  <Text className="token-info-label">
                    Liq
                  </Text>
                  <Text className="token-info-value">
                    ${formatMarketCap(tokenLiquidity ?? tokenData.metrics?.liquidity?.usd ?? 0)}
                  </Text>
                </div>
                <div>
                  <Text className="token-info-label">
                    MC
                  </Text>
                  <Text className="token-info-value">
                    ${formatMarketCap(tokenPrice * (tokenData.token.max_supply ?? 1e9))}
                  </Text>
                </div>
              </div>
            </div>
          )}

          <Audit buttonStyle={{display: 'block',position: 'relative', marginBottom: '-40px', zIndex: 9999}} mintAuthority={tokenData?.token.mint_authority ?? null} freezeAuthority={tokenData?.token.freeze_authority ?? null} />
          
          <PriceChart 
            tokenAddress={tokenAddress || ""} 
            tokenSupply={tokenData?.token.max_supply ?? 1e9 }
            initialPrice={tokenData?.metrics?.price_sol ? parseFloat(tokenData.metrics.price_sol.toString()) : 0}
            height={270}
          />

          <Text style={{fontSize: '12px', fontWeight: 'bold', marginLeft: '8px'}}>MARKET</Text>
          <div style={{display: 'flex', flexDirection: 'row', gap: '8px'}}>
            <div style={{flex: 1, width: '50%'}}>
              <Input 
                before={<Text style={{fontSize: '12px', whiteSpace: 'nowrap'}}>FEE</Text>} 
                value={feeValue} 
                onChange={feeHandlers.handleChange}
                onKeyDown={feeHandlers.handleKeyDown}
                onBlur={updateSettings}
                inputMode="decimal"
                type="text"
                name="fee"
                style={{width: '100%'}} 
              />
            </div>
            <div style={{flex: 1, width: '50%'}}>
              <Input 
                before={<Text style={{fontSize: '12px', whiteSpace: 'nowrap'}}>SLIP %</Text>} 
                value={slipValue} 
                onChange={slipHandlers.handleChange}
                onKeyDown={slipHandlers.handleKeyDown}
                onBlur={updateSettings}
                inputMode="numeric"
                type="text"
                name="slip"
                style={{width: '100%'}} 
              />
            </div>
          </div>
          <div style={{display: 'flex', flexDirection: 'row', gap: '8px'}}>
            <div style={{flex: 1, width: '50%'}}>
              <Input 
                before={<Text style={{fontSize: '12px', whiteSpace: 'nowrap'}}>BUY</Text>} 
                value={buyValue} 
                onChange={buyHandlers.handleChange}
                onKeyDown={buyHandlers.handleKeyDown}
                onBlur={updateSettings}
                inputMode="decimal"
                type="text"
                name="buy"
                style={{width: '100%'}}
              />
            </div>
            <div style={{flex: 1, width: '50%'}}>
              <Input 
                before={<Text style={{fontSize: '12px', whiteSpace: 'nowrap'}}>SELL %</Text>} 
                value={sellValue} 
                onChange={sellHandlers.handleChange}
                onKeyDown={sellHandlers.handleKeyDown}
                onBlur={updateSettings}
                inputMode="numeric"
                type="text"
                name="sell"
                style={{width: '100%'}}
              />
            </div>
          </div>

          <table className="token-page-table">
            <thead>
              <tr>
                <th><Text>#</Text></th>
                <th><Text>When</Text></th>
                <th><Text>SOL</Text></th>
                <th><Text>Tokens</Text></th>
                <th><Text>Price</Text></th>
              </tr>
            </thead>
            <tbody>
              {txHistory?.data?.map((tx) => (
                <tr key={tx.tx_hash}>
                  <td>
                    <span className={tx.tx_status === 'success' ? (tx.tx_type === 'buy' ? 'token-page-table-buy' : 'token-page-table-sell') : 'token-page-table-error'}>
                      {tx.tx_status === 'success' ? tx.tx_type.charAt(0) : 'F'}
                    </span>
                  </td>
                  <td style={{position: 'relative'}}>
                    <Text>
                      {tx.tx_status === 'error' ? <span style={{position: 'absolute', whiteSpace: 'nowrap', top: 0, left: 0}}>{getErrorType(tx.error_type ?? '')}</span> : ''}
                      {tx.tx_status === 'success' ? formatTimeElapsed(tx.created_at) : ''}
                    </Text>
                  </td>
                  <td><Text>{tx.tx_status === 'success' ? tx.amount_sol : ''}</Text></td>
                  <td><Text>{tx.tx_status === 'success' ? formatMarketCap(tx.amount_tokens) : ''}</Text></td>
                  <td><Text>{tx.tx_status === 'success' ? formatSmallNumber(tx.price_per_token_sol) : ''}</Text></td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Additional token information can go here */}
          {/* <div className="token-info-section">
            <Section header="Token Information">
              <Cell subtitle="Pool address">
                <Text>{tokenData?.pool?.address ?? "No pool address found"}</Text>
              </Cell>
            </Section>
          </div> */}
        </List>
        
        {/* Add the Buy and Sell buttons for this token */}
        <div className="token-page-actions">
          <BuySellButtons 
            onBuy={handleBuy} 
            onSell={handleSell} 
            lowLiquidity={(tokenData != null && (tokenData?.metrics?.liquidity?.usd ?? 0) < 1000)}
            sellValue={Number(sellValue)}
            buyValue={Number(buyValue)}
            disableSell={tokenBalance === 0}
            isTxProcessing={isTxProcessing}
          />
        </div>
      </div>
    </Page>
  );
};
