import { Button } from '@telegram-apps/telegram-ui';
import './BuySellButtons.css';

interface BuySellButtonsProps {
  onBuy?: () => void;
  onSell?: () => void;
  lowLiquidity?: boolean;
  sellValue?: number;
  buyValue?: number;
  disableSell?: boolean;
}

export function BuySellButtons({ onBuy, onSell, lowLiquidity, buyValue, sellValue, disableSell }: BuySellButtonsProps) {
  return (
    <div className="buy-sell-buttons">
      <Button 
        size="m" 
        mode="filled"
        stretched 
        onClick={onBuy}
        disabled={lowLiquidity}
        className="buy-button"
      >
        {lowLiquidity ? (
          "Low Liq"
        ) : buyValue ? (
          `Buy ${buyValue} SOL`
        ) : (
          "Set buy amount"
        )}
      </Button>
      <Button 
        size="m" 
        mode="outline"
        stretched 
        onClick={onSell}
        className="sell-button"
        disabled={disableSell}
      >
        {sellValue ? (
          `Sell ${sellValue}%`
        ) : (
          "Set sell amount"
        )}
      </Button>
    </div>
  );
} 