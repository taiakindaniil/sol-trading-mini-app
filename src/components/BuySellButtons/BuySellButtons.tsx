import { Button } from '@telegram-apps/telegram-ui';
import './BuySellButtons.css';

interface BuySellButtonsProps {
  onBuy?: () => void;
  onSell?: () => void;
  lowLiquidity?: boolean;
}

export function BuySellButtons({ onBuy, onSell, lowLiquidity }: BuySellButtonsProps) {
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
        {lowLiquidity ? "Low Liq" : "Buy"}
      </Button>
      <Button 
        size="m" 
        mode="outline"
        stretched 
        onClick={onSell}
        className="sell-button"
      >
        Sell
      </Button>
    </div>
  );
} 