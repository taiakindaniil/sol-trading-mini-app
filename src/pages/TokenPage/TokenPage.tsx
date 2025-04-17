// import { openLink } from '@telegram-apps/sdk-react';
import {
  Avatar,
  Cell,
  Input,
  List,
  Section,
  Text,
} from '@telegram-apps/telegram-ui';

import {
  initDataState as _initDataState,
  // type User,
  // useSignal,
} from '@telegram-apps/sdk-react';

import { FC, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { Page } from '@/components/Page';
import { WalletAddress } from '@/components/WalletAddress/WalletAddress';
import { BuySellButtons } from '@/components/BuySellButtons/BuySellButtons';
// import { bem } from '@/css/bem';
import { useApi } from '@/api';

import './TokenPage.css';
import { TokenInfo } from '@/api/services/tokenService';
import { formatMarketCap } from '@/helpers/formatters';
import { createFloatHandlers, createIntegerHandlers } from '@/helpers/numberInputHandlers';

// const [, e] = bem('wallet-page');

export const TokenPage: FC = () => {
  // const initDataState = useSignal(_initDataState);
  const api = useApi(); // This sets up the init data automatically
  const { tokenAddress } = useParams<{ tokenAddress: string }>();
  const [tokenData, setTokenData] = useState<TokenInfo | null>(null);
  
  // Updated initial values
  const [feeValue, setFeeValue] = useState<string>("0.01");
  const [slipValue, setSlipValue] = useState<string>("25");
  const [buyValue, setBuyValue] = useState<string>("0.01");
  const [sellValue, setSellValue] = useState<string>("25");

  // Используем утилиты для создания обработчиков
  const feeHandlers = createFloatHandlers(setFeeValue);
  const slipHandlers = createIntegerHandlers(setSlipValue);
  const buyHandlers = createFloatHandlers(setBuyValue);
  const sellHandlers = createIntegerHandlers(setSellValue);

  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        const data = await api.token.getTokenInfo(tokenAddress || "");
        setTokenData(data);
      } catch (error) {
        console.error("Error fetching token data:", error);
      }
    };
    
    // Initial fetch
    fetchTokenData();
    
    // Set up interval for auto-refresh every 15 seconds
    const refreshInterval = setInterval(fetchTokenData, 15000);
    
    // Clean up interval on component unmount
    return () => {
      clearInterval(refreshInterval);
    };
  }, [api, tokenAddress]);

  useEffect(() => {
    console.log(feeValue, slipValue, buyValue, sellValue);
  }, [feeValue, slipValue, buyValue, sellValue]);

  const handleBuy = () => {
    console.log(`Buy ${tokenData?.token.symbol || 'token'} at address: ${tokenAddress}`);
    // Implement buy logic or navigation
  };

  const handleSell = () => {
    console.log(`Sell ${tokenData?.token.symbol || 'token'} at address: ${tokenAddress}`);
    // Implement sell logic or navigation
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
                    ${formatMarketCap(tokenData.metrics?.liquidity?.usd ?? 0)}
                  </Text>
                </div>
                <div>
                  <Text className="token-info-label">
                    MC
                  </Text>
                  <Text className="token-info-value">
                    ${formatMarketCap(tokenData.metrics?.market_cap ?? 0)}
                  </Text>
                </div>
              </div>
            </div>
          )}
          
          {tokenData ? (
            tokenData.pool?.address ? (
              <iframe
                id="dextools-widget"
                title="DEXTools Trading Chart"
                width="100%"
                height="340"
                style={{ border: 'none', borderRadius: '10px' }}
                src={`https://www.dextools.io/widget-chart/en/solana/pe-light/${tokenData.pool.address}?theme=dark&chartType=1&chartResolution=1&drawingToolbars=false`}
              />
            ) : (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '340px' }}>
                <Text>Cannot show chart for this token</Text>
              </div>
            )
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '340px' }}>
              <Text>Loading chart...</Text>
            </div>
          )}

          <Text style={{fontSize: '12px', fontWeight: 'bold', marginLeft: '8px'}}>MARKET</Text>
          <div style={{display: 'flex', flexDirection: 'row', gap: '8px'}}>
            <div style={{flex: 1, width: '50%'}}>
              <Input 
                before={<Text style={{fontSize: '12px', whiteSpace: 'nowrap'}}>FEE</Text>} 
                value={feeValue} 
                onChange={feeHandlers.handleChange}
                onKeyDown={feeHandlers.handleKeyDown}
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
                inputMode="numeric"
                type="text"
                name="sell"
                style={{width: '100%'}}
              />
            </div>
          </div>
          
          {/* Additional token information can go here */}
          <div className="token-info-section">
            <Section header="Token Information">
              <Cell subtitle="Pool address">
                <Text>{tokenData?.pool?.address ?? "No pool address found"}</Text>
              </Cell>
              {/* Add more token info here */}
            </Section>
          </div>
        </List>
        
        {/* Add the Buy and Sell buttons for this token */}
        <div className="token-page-actions">
          <BuySellButtons 
            onBuy={handleBuy} 
            onSell={handleSell} 
            lowLiquidity={(tokenData != null && (tokenData?.metrics?.liquidity?.usd ?? 0) < 1000)}
            sellValue={Number(sellValue)}
            buyValue={Number(buyValue)}
          />
        </div>
      </div>
    </Page>
  );
};
