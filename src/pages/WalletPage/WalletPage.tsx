// import { openLink } from '@telegram-apps/sdk-react';
import {
  // Avatar,
  // Cell,
  List,
  // Navigation,
  // Section,
  Text,
  // Title,
  InlineButtons,
  Headline,
  Spinner,
} from '@telegram-apps/telegram-ui';

import {
  initDataState as _initDataState,
  // type User,
  // useSignal,
} from '@telegram-apps/sdk-react';

import {
  InlineButtonsItem
} from "@telegram-apps/telegram-ui/dist/components/Blocks/InlineButtons/components/InlineButtonsItem/InlineButtonsItem.js";

import { Icon24QR } from "@telegram-apps/telegram-ui/dist/icons/24/qr";

import { FC, useState, useEffect } from 'react';

import { Page } from '@/components/Page';
import { bem } from '@/css/bem';
import { WalletData, useApi } from '@/api';

import './WalletPage.css';
import { WalletAddress } from '@/components/WalletAddress/WalletAddress';

const [, e] = bem('wallet-page');

export const WalletPage: FC = () => {
  // const initDataState = useSignal(_initDataState);
  const api = useApi(); // This sets up the init data automatically

  const [walletData, setWalletData] = useState<WalletData | null>(null);

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const data = await api.wallet.getWalletData();
        setWalletData(data);
      } catch (error) {
        console.error('Error fetching wallet data:', error);
      }
    };

    // The init data is automatically set by useApi
    fetchWalletData();
  }, [api]);

  if (walletData) {
    return (
      <Page>
        <List style={{ textAlign: 'center' }}>
          <Headline className={e('headline')} weight="1">
            Your Wallet
          </Headline>

          <WalletAddress
            address={walletData?.address || " "}
          />

          <Text className={e('wallet-balance')} weight="1">
            {walletData?.balance || 0} SOL
          </Text>

          <InlineButtons mode="gray">
            <InlineButtonsItem text="Deposit">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 4L12 16M12 16L16 12M12 16L8 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 20L20 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </InlineButtonsItem>
            <InlineButtonsItem text="Send">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 20L12 8M12 8L16 12M12 8L8 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 4L20 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </InlineButtonsItem>
            <InlineButtonsItem text="Export">
              <Icon24QR />
            </InlineButtonsItem>
            <InlineButtonsItem text="Change">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 4L12 20M4 12L20 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </InlineButtonsItem>
          </InlineButtons>
        </List>
      </Page>
    );
  }

  return (
    <Page>
      <List style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Spinner size="m" />
      </List>
    </Page>
  );
};
