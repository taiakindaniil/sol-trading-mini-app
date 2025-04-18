import {
  List,
  Text,
  Headline,
  // Spinner,
  Button,
  Input,
} from '@telegram-apps/telegram-ui';

import {
  initDataState as _initDataState,
  // type User,
  // useSignal,
} from '@telegram-apps/sdk-react';

import { FC, useState, useEffect } from 'react';
import { PublicKey } from '@solana/web3.js';

import { Page } from '@/components/Page';
// import { bem } from '@/css/bem';
import { useApi } from '@/api';

import './WithdrawPage.css';
import { createFloatHandlers } from '@/helpers/numberInputHandlers';
import { WithdrawResponse } from '@/api/services/walletService';
import { formatTimeElapsed } from '@/helpers/formatters';
// const [, e] = bem('wallet-page');
  
export const WithdrawPage: FC = () => {
    // const initDataState = useSignal(_initDataState);
    const api = useApi(); // This sets up the init data automatically
  
    const [amountValue, setAmountValue] = useState<string>();
    const [addressValue, setAddressValue] = useState<string>();
    const [addressError, setAddressError] = useState<string | null>(null);
    const [amountError, setAmountError] = useState<string | null>(null);
    const [withdrawData, setWithdrawData] = useState<WithdrawResponse | null>(null);
    const [isWithdrawInProgress, setIsWithdrawInProgress] = useState<boolean>(false);

    const amountHandlers = createFloatHandlers(setAmountValue);
  
    useEffect(() => {
      const fetchWithdrawData = async () => {
        try {
          const data = await api.wallet.getWithdrawals();
          setWithdrawData(data);
        } catch (error) {
          console.error('Error fetching withdrawals:', error);
        }
      };

      fetchWithdrawData();
    }, [api]);
  
    const validateSolanaAddress = (address: string): boolean => {
      try {
        if (address.length === 0) {
          setAddressError(null);
          return false;
        }
        
        // Try to create a PublicKey object - this will validate the address
        new PublicKey(address);
        setAddressError(null);
        return true;
      } catch (error) {
        setAddressError("Invalid Solana address");
        return false;
      }
    };

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setAddressValue(value);
      validateSolanaAddress(value);
    };

    // Add a function to validate the amount
    const validateAmount = (value: string): boolean => {
      if (!value || parseFloat(value) <= 0) {
        setAmountError("Amount must be greater than 0");
        return false;
      }
      
      if (withdrawData && parseFloat(value) > (withdrawData.data?.balance ?? 0)) {
        setAmountError("Insufficient balance");
        return false;
      }
      
      setAmountError(null);
      return true;
    };

    // Update the amount change handler
    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      amountHandlers.handleChange(e);
      validateAmount(e.target.value);
    };

    // When setting max amount, also validate
    const setMaxAmount = () => {
      if (withdrawData) {
        const maxAmount = (withdrawData.data?.balance ?? 0).toString();
        setAmountValue(maxAmount);
        validateAmount(maxAmount);
      }
    };

    const handleWithdraw = async () => {
      if (!addressValue || !!addressError || !amountValue || amountValue === "0" || !!amountError) {
        return;
      }

      setIsWithdrawInProgress(true);

      const amount = parseFloat(amountValue);
      const address = addressValue;

      try {
        const response = await api.wallet.withdraw(amount, address);
        setWithdrawData(response);
      } catch (error) {
        console.error('Withdrawal failed:', error);
      } finally {
        setIsWithdrawInProgress(false);
      }
    };
  
    return (
      <Page>
        <List>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Headline weight="1">
              Withdraw
            </Headline>
            <Text onClick={setMaxAmount} style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)', cursor: 'pointer' }}>
              Max: {withdrawData?.data?.balance} SOL
            </Text>
          </div>
          <Input 
            before={<Text>SOL</Text>}
            value={amountValue}
            onChange={handleAmountChange}
            onKeyDown={amountHandlers.handleKeyDown}
            placeholder="Amount"
            inputMode="decimal"
            type="text"
            status={amountError ? "error" : undefined}
          />
          <Input
            before={<Text>Recipient</Text>}
            placeholder="Address"
            value={addressValue}
            onChange={handleAddressChange}
            status={addressError ? "error" : undefined}
          />
          <Button 
            size="m" 
            disabled={!addressValue || !!addressError || !amountValue || amountValue === "0" || !!amountError}
            stretched
            onClick={handleWithdraw}
            loading={isWithdrawInProgress}
          >
            Withdraw
          </Button>

          {withdrawData && (withdrawData.data?.withdrawals.length ?? 0) > 0 && (
            <div style={{ marginTop: '24px' }}>
              <Headline weight="2" style={{ marginBottom: '16px', fontSize: '18px' }}>
                History
              </Headline>

              <table>
                <thead>
                  <tr>
                    <th><Text>When</Text></th>
                    <th><Text>Amount SOL</Text></th>
                    <th><Text>Tx link</Text></th>
                  </tr>
                </thead>
                <tbody>
                  {withdrawData.data?.withdrawals.map((withdrawal) => (
                    <tr key={withdrawal.hash}>
                      <td><Text>{formatTimeElapsed(withdrawal.created_at)}</Text></td>
                      <td><Text>{withdrawal.amount_sol}</Text></td>
                      <td><Button size="s" onClick={() => window.open(`https://solscan.io/tx/${withdrawal.hash}`, '_blank')}>View</Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) || (
            (withdrawData?.data?.withdrawals.length ?? -1) === 0 && (
              <div style={{ marginTop: '24px' }}>
                <Text>No withdrawals yet</Text>
              </div>
            ) || (
              <div style={{ marginTop: '24px' }}>
                <Text>Loading...</Text>
              </div>
            )
          )}
        </List>
      </Page>
    );
};
  