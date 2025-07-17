import { FC, useEffect, useRef, useState } from 'react';
import { createChart, IChartApi, UTCTimestamp } from 'lightweight-charts';
import { Text } from '@telegram-apps/telegram-ui';
import './PriceChart.css';

interface PriceChartProps {
  tokenAddress: string;
  initialPrice?: number;
  height?: number;
}

interface PriceData {
  time: UTCTimestamp;
  value: number;
}

export const PriceChart: FC<PriceChartProps> = ({ tokenAddress, initialPrice = 0, height = 270 }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<any>(null); // Use any to avoid TypeScript complexity
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number>(initialPrice);
  const [priceChange, setPriceChange] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Chart initialization
  useEffect(() => {
    if (!chartContainerRef.current) return;
    
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: height - 40,
      layout: {
        background: { color: 'transparent' },
        textColor: '#ffffff',
      },
      grid: {
        vertLines: { color: '#243043' },
        horzLines: { color: '#2B2B43' },
      },
      crosshair: {
        mode: 1,
        vertLine: { color: '#c4f85c', width: 1, style: 0 },
        horzLine: { color: '#c4f85c', width: 1, style: 0 },
      },
      rightPriceScale: {
        borderColor: '#2B2B43',
        textColor: '#ffffff',
      },
      timeScale: {
        borderColor: '#2B2B43',
        timeVisible: true,
        secondsVisible: false,
      },
      handleScroll: {
        mouseWheel: false,
        pressedMouseMove: false,
        horzTouchDrag: false,
        vertTouchDrag: false,
      },
      handleScale: {
        axisPressedMouseMove: false,
        mouseWheel: false,
        pinch: false,
      },
    });
    
    // @ts-ignore - lightweight-charts v3/v4 compatibility
    const lineSeries = chart.addSeries('line', {
      color: '#c4f85c',
      lineWidth: 2,
      crosshairMarkerVisible: true,
      lastValueVisible: false,
      priceLineVisible: false,
    });
    
    chartRef.current = chart;
    seriesRef.current = lineSeries;
    
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [height]);

  // Initial data setup
  useEffect(() => {
    if (initialPrice > 0 && priceData.length === 0) {
      const now = Math.floor(Date.now() / 1000) as UTCTimestamp;
      const initialData: PriceData[] = [
        { time: (now - 300) as UTCTimestamp, value: initialPrice * 0.99 },
        { time: (now - 180) as UTCTimestamp, value: initialPrice * 1.01 },
        { time: (now - 60) as UTCTimestamp, value: initialPrice * 0.98 },
        { time: now, value: initialPrice },
      ];
      setPriceData(initialData);
      setCurrentPrice(initialPrice);
      setIsLoading(false);
    } else if (priceData.length === 0) {
      setIsLoading(false);
    }
  }, [initialPrice, priceData.length]);

  // Update chart with new data
  useEffect(() => {
    if (seriesRef.current && priceData.length > 0) {
      const chartData = priceData.map(item => ({
        time: item.time,
        value: item.value,
      }));
      seriesRef.current.setData(chartData);
      if (chartRef.current) {
        chartRef.current.timeScale().fitContent();
      }
    }
  }, [priceData]);

  // Listen for socket price updates
  useEffect(() => {
    let socket: any;
    
    const handlePriceUpdate = (data: any) => {
      if (data.token_address === tokenAddress && data.metrics?.token_price_sol) {
        const newPrice = parseFloat(data.metrics.token_price_sol);
        const timestamp = Math.floor(data.metrics.timestamp / 1000) as UTCTimestamp;
        
        setPriceData(prevData => {
          const newData = [...prevData, { time: timestamp, value: newPrice }];
          return newData.length > 100 ? newData.slice(-100) : newData;
        });
        
        if (currentPrice > 0) {
          const change = ((newPrice - currentPrice) / currentPrice) * 100;
          setPriceChange(change);
        }
        
        setCurrentPrice(newPrice);
      }
    };

    import('@/socket').then(mod => {
      socket = mod.socket;
      socket.on('token_metrics_update', handlePriceUpdate);
    }).catch(console.error);

    return () => {
      if (socket) {
        socket.off('token_metrics_update', handlePriceUpdate);
      }
    };
  }, [tokenAddress, currentPrice]);

  if (isLoading) {
    return (
      <div className="price-chart-loading" style={{ height }}>
        <Text>Loading chart...</Text>
      </div>
    );
  }

  return (
    <div className="price-chart-container">
      <div className="price-chart-header">
        <div className="price-info">
          <Text className="current-price">
            {currentPrice > 0 ? `$${currentPrice.toFixed(8)}` : 'No price data'}
          </Text>
          {priceChange !== 0 && (
            <Text className={`price-change ${priceChange >= 0 ? 'positive' : 'negative'}`}>
              {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
            </Text>
          )}
        </div>
      </div>
      <div ref={chartContainerRef} className="price-chart" style={{ height: height - 40 }} />
    </div>
  );
}; 