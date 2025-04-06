import type { FC } from 'react';
import { Snackbar, Text } from '@telegram-apps/telegram-ui';
import { useState } from 'react';
import { ClipboardIcon } from '../icons';

export interface WalletAddressProps {
  address: string;
  className?: string;
  slice?: number;
}

export const WalletAddress: FC<WalletAddressProps> = ({ address, className, slice = 10 }) => {
  const [showSnackbar, setShowSnackbar] = useState(false);

  if (!address) return null;

  const truncated = `${address.slice(0, slice)}...${address.slice(-slice)}`;

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setShowSnackbar(true);
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  return (
    <>
      <Text className={className} onClick={handleCopyAddress} style={{ display: 'block', cursor: 'pointer' }}>
        {truncated}
      </Text>
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
    </>
  );
};
