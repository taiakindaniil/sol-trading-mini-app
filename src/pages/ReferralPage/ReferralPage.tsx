// import { openLink } from '@telegram-apps/sdk-react';
import {
    Cell,
    List,
    Section,
    Spinner,
    Title,
  } from '@telegram-apps/telegram-ui';

import type { FC } from 'react';
import { Snackbar } from '@telegram-apps/telegram-ui';
import { useEffect, useState } from 'react';
import { ClipboardIcon } from '@/components/icons';
  
import {
  initDataState as _initDataState,
  // type User,
  // useSignal,
} from '@telegram-apps/sdk-react';

import { Page } from '@/components/Page';
// import { bem } from '@/css/bem';

import './ReferralPage.css';
import { ReferralResponse, useApi } from '@/api';
  
// const [, e] = bem('wallet-page');

export const ReferralPage: FC = () => {
  const api = useApi();
  
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [referralData, setReferralData] = useState<ReferralResponse | null>(null);
  
  const handleCopyAddress = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setShowSnackbar(true);
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  useEffect(() => {
    const fetchReferralData = async () => {
      try {
        const referralData = await api.user.getReferralData();
        setReferralData(referralData);
      } catch (error) {
        console.error('Error fetching referral data:', error);
      }
    };

    fetchReferralData();
  }, [api]);
  

  if (referralData) {
    return (
      <Page>

        <List>
            <Title style={{ marginLeft: '0px', marginTop: '10px' }} weight="1">
                My Referrals
            </Title>
            <Section footer="Invite your friends to get % of their trades">
                <Cell subhead="Commision from your refs">{referralData?.data.ref_percent}%</Cell>
                <Cell subhead="You invited">{referralData?.data.ref_invited || 0}</Cell>
                <Cell
                  subhead="Referral Link"
                  onClick={() => handleCopyAddress(`t.me/do0rman_bot?start=ref_${referralData?.data.ref_username}`)}
                >
                  t.me/do0rman_bot?start=ref_{referralData?.data.ref_username}
                </Cell>
            </Section>
        </List>
        {showSnackbar && (
          <Snackbar
            before={<ClipboardIcon />}
            onClose={() => setShowSnackbar(false)}
            duration={3000}
            style={{ zIndex: 9999 }}
          >
            Copied to clipboard
          </Snackbar>
        )}
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
  