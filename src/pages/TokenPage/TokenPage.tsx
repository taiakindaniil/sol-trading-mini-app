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

// const [, e] = bem('wallet-page');

export const TokenPage: FC = () => {
  // const initDataState = useSignal(_initDataState);
  const api = useApi(); // This sets up the init data automatically
  const { tokenAddress } = useParams<{ tokenAddress: string }>();
  const [tokenData, setTokenData] = useState<any>(null);

  useEffect(() => {
    // Fetch token data if necessary
    const fetchTokenData = async () => {
      try {
        // Example API call - replace with your actual API
        // const data = await api.tokens.getTokenData(tokenAddress);
        // setTokenData(data);
        
        // For now, just set some mock data
        setTokenData({
          name: 'Sample Token',
          symbol: 'SMPL',
          price: 0.05,
          change24h: 3.3,
          icon: 'https://img-v1.raydium.io/icon/So11111111111111111111111111111111111111112.png',
          address: 'So11111111111111111111111111111111111111112',
        });
      } catch (error) {
        console.error('Error fetching token data:', error);
      }
    };

    if (tokenAddress) {
      fetchTokenData();
    }
  }, [api, tokenAddress]);

  const handleBuy = () => {
    console.log(`Buy ${tokenData?.symbol || 'token'} at address: ${tokenAddress}`);
    // Implement buy logic or navigation
  };

  const handleSell = () => {
    console.log(`Sell ${tokenData?.symbol || 'token'} at address: ${tokenAddress}`);
    // Implement sell logic or navigation
  };

  return (
    <Page>
      <div className="token-page-content">
        <List>
          {tokenData && (
            <div className="token-header">
              <Avatar src={tokenData.icon} style={{ backgroundColor: '#000', borderRadius: '100%' }}/>
              <div className="token-title-container">
                <Text weight="1" className="token-title">
                  {tokenData.symbol}
                </Text>
                <WalletAddress address={tokenData.address} slice={3} className="token-address" />
              </div>
              <div className="token-info-container">
                <div>
                  <Text className="token-info-label">
                    5m Vol
                  </Text>
                  <Text className="token-info-value">
                    1000
                  </Text>
                </div>
                <div>
                  <Text className="token-info-label">
                    Traders
                  </Text>
                  <Text className="token-info-value">
                    221
                  </Text>
                </div>
                <div>
                  <Text className="token-info-label">
                    Liq
                  </Text>
                  <Text className="token-info-value">
                    4332
                  </Text>
                </div>
                <div>
                  <Text className="token-info-label">
                    MC
                  </Text>
                  <Text className="token-info-value">
                    3423
                  </Text>
                </div>
              </div>
            </div>
          )}
          
          <iframe
            id="dextools-widget"
            title="DEXTools Trading Chart"
            width="100%"
            height="340"
            style={{ border: 'none', borderRadius: '10px' }}
            src="https://www.dextools.io/widget-chart/en/solana/pe-light/9J3UL85qVt9Wedp7VYGDcTyJAuuokLzSKznfBSaW8C2j?theme=dark&chartType=1&chartResolution=1&drawingToolbars=false"
          />
          
          {/* Additional token information can go here */}
          <div className="token-info-section">
            <Section header="Token Information">
              <Cell subtitle="Address">
                <Text>{tokenAddress}</Text>
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
