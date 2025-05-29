import {
  List,
  Text,
  InlineButtons,
  Headline,
  Spinner,
  Modal,
  Button,
  Cell,
  Input
} from '@telegram-apps/telegram-ui';
import { QRCodeSVG } from 'qrcode.react'; 
import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';

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

  const [isImportPage, setIsImportPage] = useState(false);
  const [isNewWalletPage, setIsNewWalletPage] = useState(false);
  
  const [newWallet, setNewWallet] = useState<{ keypair: Keypair; address: string } | null>(null);

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

  useEffect(() => {
    if (isNewWalletPage && !newWallet) {
      // Generate new wallet when entering new wallet page
      const keypair = Keypair.generate();
      setNewWallet({
        keypair,
        address: keypair.publicKey.toString()
      });
    }
  }, [isNewWalletPage]);

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

  const handleSaveNewWallet = async () => {
    if (!newWallet) return;
    
    try {
      // Convert private key to base64 string using browser APIs
      const privateKey = bs58.encode(newWallet.keypair.secretKey);
      const newWalletData = await api.wallet.setNewWallet(privateKey);
      setWalletData({ address: newWalletData.address, balance: newWalletData.balance });
      setIsNewWalletPage(false);
      setIsImportPage(false);
    } catch (error) {
      console.error('Error saving new wallet:', error);
    }
  };


  // Private Key Import

  const [privateKeyInputValue, setPrivateKeyInputValue] = useState<string>();
  const [privateKeyInputError, setPrivateKeyInputError] = useState<string | null>(null);

  const validatePrivateKeyInput = (privateKeyInputValue: string): boolean => {
    try {
      if (privateKeyInputValue.length === 0) {
        setPrivateKeyInputError(null);
        setNewWallet(null);
        return false;
      }
      
      // Try to create a PublicKey object - this will validate the address
      const privateKeyBytes = bs58.decode(privateKeyInputValue);
      const keypair = Keypair.fromSecretKey(privateKeyBytes); // just checking if it's valid
      setPrivateKeyInputError(null);

      setNewWallet({ keypair, address: keypair.publicKey.toString() })

      return true;
    } catch (error) {
      setPrivateKeyInputError("Invalid private key");
      setNewWallet(null);
      return false;
    }
  };

  const handlePrivateKeyInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setPrivateKeyInputValue(value);
      validatePrivateKeyInput(value);
  };

  if (walletData) {
    return (
      <Page back={false}>
        <List style={{ textAlign: 'center' }}>
          <Headline className={e('headline')} weight="1">
            Your Wallet
          </Headline>

          <WalletAddress
            address={walletData?.address || " "}
          />

          <Text className={e('wallet-balance')} weight="1">
            {walletData?.balance ? parseFloat(walletData.balance.toString()).toFixed(3) : '0.000'} SOL
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
                  style={{ marginTop: '16px', marginBottom: '36px' }} 
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
                      style={{ marginTop: '16px', marginBottom: '36px' }} 
                      onClick={() => privateKey && navigator.clipboard.writeText(privateKey)}
                      disabled={!privateKey}
                    >
                      Copy Private Key
                    </Button>
                  </>
                )}
              </div>
            </Modal>
            <Modal
              header={<ModalHeader>Change wallet</ModalHeader>}
              trigger={
                <InlineButtonsItem text="Change">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 4L12 20M4 12L20 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </InlineButtonsItem>
              }
              style={{zIndex: 1000, height: '500px'}}
            >
              { isImportPage && <div style={{display: 'flex', flexDirection: 'column', margin: '5px 20px', gap: '12px'}}>
                <Input
                  placeholder='Enter your Private Key'
                  value={privateKeyInputValue}
                  onChange={handlePrivateKeyInputChange}
                  status={privateKeyInputError ? "error" : undefined}
                />
                <Button
                  stretched
                  size='m'
                  className={e('save-changes-button')}
                  disabled={privateKeyInputError != null || privateKeyInputValue?.length == 0}
                  onClick={handleSaveNewWallet}
                >
                  Import Wallet
                </Button>
                <Button stretched mode="gray"
                  onClick={() => {
                    setIsImportPage(false);
                    setNewWallet(null);
                    setPrivateKeyInputValue("");
                  }}
                >
                  Cancel
                </Button>
              </div> || isNewWalletPage && <>
                <div style={{ padding: '5px 16px 40px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Text weight="1" style={{ paddingTop: '0px', marginBottom: '16px' }}>
                    Your new wallet has been generated
                  </Text>
                  <Text weight="1" style={{ fontSize: '15px', marginBottom: '8px' }}>Wallet Address</Text>
                  <Text
                    style={{ color: 'rgba(255, 255, 255, 0.3)', textAlign: 'center', maxWidth: '80%', wordWrap: 'break-word', marginBottom: '16px' }}
                    onClick={() => newWallet && navigator.clipboard.writeText(newWallet.address)}
                  >
                    <WalletAddress address={newWallet?.address ?? ""} slice={12} />
                  </Text>
                  <Text weight="1" style={{ fontSize: '15px', marginBottom: '8px' }}>Private Key</Text>
                  <Text style={{ color: 'rgba(255, 255, 255, 0.3)', textAlign: 'center', maxWidth: '80%', wordWrap: 'break-word', marginBottom: '24px' }}>
                    {newWallet ? bs58.encode(newWallet.keypair.secretKey) : ''}
                  </Text>
                  <Button 
                    stretched
                    style={{ marginBottom: '12px' }} 
                    onClick={() => newWallet && navigator.clipboard.writeText(bs58.encode(newWallet.keypair.secretKey))}
                  >
                    Copy Private Key
                  </Button>
                  <Button 
                    stretched
                    className={e('save-changes-button')}
                    style={{ marginBottom: '12px', background: '#' }} 
                    onClick={handleSaveNewWallet}
                  >
                    Save Wallet
                  </Button>
                  <Button stretched mode="gray"
                    onClick={() => {
                      setIsNewWalletPage(false);
                      setNewWallet(null);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </> || <>
                <div style={{marginBottom: '200px'}}>
                  <Cell subtitle="Creating a solana wallet" onClick={() => setIsNewWalletPage(true)}>
                    Generate a new wallet
                  </Cell>
                  <Cell subtitle="Import a solana wallet using private key" onClick={() => setIsImportPage(true)}>
                    Import a wallet
                  </Cell>
                  <span className={e('change-wallet-caution')}>
                    Your previous wallet will be removed from the app
                  </span>
                </div>
              </>}
            </Modal>
          </InlineButtons>
        </List>
      </Page>
    );
  }

  return (
    <Page back={false}>
      <List style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Spinner size="m" />
      </List>
    </Page>
  );
};
