import {
  List,
  Text,
  InlineButtons,
  Headline,
  Spinner,
  Modal,
  Button,
} from '@telegram-apps/telegram-ui';
import { QRCodeSVG } from 'qrcode.react'; 

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
import { ModalHeader } from '@telegram-apps/telegram-ui/dist/components/Overlays/Modal/components/ModalHeader/ModalHeader';
import { useNavigate } from 'react-router-dom';
const [, e] = bem('wallet-page');

export const WalletPage: FC = () => {
  // const initDataState = useSignal(_initDataState);
  const api = useApi(); // This sets up the init data automatically

  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [privateKey, setPrivateKey] = useState<string | null>(null);
  const [isExportLoading, setIsExportLoading] = useState(false);

  const navigate = useNavigate();

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

  const handleExportClick = async () => {
    if (!privateKey) {
      setIsExportLoading(true);
      try {
        // Call a separate endpoint to get the private key
        const exportData = await api.wallet.exportWallet();
        setPrivateKey(exportData.private_key ?? "");
      } catch (error) {
        console.error('Error exporting wallet:', error);
        // Handle error - maybe show a notification to the user
      } finally {
        setIsExportLoading(false);
      }
    }
  };

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
            <Modal
              header={<ModalHeader>Deposit</ModalHeader>}
              trigger={
                <InlineButtonsItem text="Deposit">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 4L12 16M12 16L16 12M12 16L8 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4 20L20 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </InlineButtonsItem>
              }
              style={{zIndex: 1000}}
            >
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Text weight="1" style={{ marginBottom: '16px' }}>
                  Scan this QR code to deposit SOL
                </Text>
                <div style={{ background: 'white', padding: '16px', borderRadius: '12px' }}>
                  <QRCodeSVG 
                    value={walletData.address} 
                    size={200}
                    level="H"
                  />
                </div>
                <Text style={{ marginTop: '16px', textAlign: 'center' }}>
                  <WalletAddress address={walletData.address} slice={12} />
                </Text>
                <Button 
                  style={{ marginTop: '16px', marginBottom: '16px' }} 
                  onClick={() => navigator.clipboard.writeText(walletData.address)}
                >
                  Copy Address
                </Button>
              </div>
            </Modal>
            <InlineButtonsItem onClick={() => navigate('/withdraw')} text="Send">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 20L12 8M12 8L16 12M12 8L8 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 4L20 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </InlineButtonsItem>
            <Modal
              header={<ModalHeader>Export</ModalHeader>}
              trigger={
                <InlineButtonsItem text="Export" onClick={handleExportClick}>
                  <Icon24QR />
                </InlineButtonsItem>
              }
              style={{zIndex: 1000}}
            >
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Text weight="1" style={{ marginBottom: '16px' }}>
                  Your private key
                </Text>
                {isExportLoading ? (
                  <Spinner size="m" />
                ) : (
                  <>
                    <Text style={{ color: 'rgba(255, 255, 255, 0.3)', textAlign: 'center', maxWidth: '80%', wordWrap: 'break-word' }}>
                      {privateKey || ""}
                    </Text>
                    <Button 
                      style={{ marginTop: '16px', marginBottom: '16px' }} 
                      onClick={() => privateKey && navigator.clipboard.writeText(privateKey)}
                      disabled={!privateKey}
                    >
                      Copy Private Key
                    </Button>
                  </>
                )}
              </div>
            </Modal>
            {/* <InlineButtonsItem text="Change">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 4L12 20M4 12L20 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </InlineButtonsItem> */}
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
