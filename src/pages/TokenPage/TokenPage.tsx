// import { openLink } from '@telegram-apps/sdk-react';
import {
  Avatar,
  Cell,
  List,
  // Navigation,
  Section,
  Text,
  // Title,
  // InlineButtons,
  // Headline,
  // Button,
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

// const [, e] = bem('wallet-page');

export const TokenPage: FC = () => {
  // const initDataState = useSignal(_initDataState);
  const api = useApi(); // This sets up the init data automatically
  const { tokenAddress } = useParams<{ tokenAddress: string }>();
  const [tokenData, setTokenData] = useState<TokenInfo | null>(null);

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
                    ${tokenData.metrics?.volume?.m5}
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
          
          { tokenData && (
            <iframe
              id="dextools-widget"
              title="DEXTools Trading Chart"
              width="100%"
              height="340"
              style={{ border: 'none', borderRadius: '10px' }}
              src={`https://www.dextools.io/widget-chart/en/solana/pe-light/${tokenData?.pool?.address}?theme=dark&chartType=1&chartResolution=1&drawingToolbars=false`}
            />
          )}
          
          {/* Additional token information can go here */}
          <div className="token-info-section">
            <Section header="Token Information">
              <Cell subtitle="Mint address">
                <Text>{tokenAddress}</Text>
              </Cell>
              <Cell subtitle="Pool address">
                <Text>{tokenData?.pool?.address}</Text>
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
          />
        </div>
      </div>
    </Page>
  );
};
