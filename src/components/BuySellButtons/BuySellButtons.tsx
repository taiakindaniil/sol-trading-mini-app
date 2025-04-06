import { Button } from '@telegram-apps/telegram-ui';
import './BuySellButtons.css';

interface BuySellButtonsProps {
  onBuy?: () => void;
  onSell?: () => void;
}

export function BuySellButtons({ onBuy, onSell }: BuySellButtonsProps) {
  return (
    <div className="buy-sell-buttons">
      <Button 
        size="m" 
        mode="filled"
        stretched 
        onClick={onBuy}
        className="buy-button"
      >
        Buy
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