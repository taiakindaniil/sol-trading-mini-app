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
  const seriesRef = useRef<any>(null);
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number>(initialPrice);
  const [priceChange, setPriceChange] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [chartError, setChartError] = useState<string | null>(null);

  // Chart initialization
  useEffect(() => {
    if (!chartContainerRef.current) {
      console.log('Chart container not available');
      return;
    }
    
    try {
      console.log('Initializing chart with container:', chartContainerRef.current);
      
      const chart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth || 400,
        height: Math.max(height - 40, 200),
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
      
      console.log('Chart created, adding line series...');
      
      // Try different series creation methods for compatibility
      let lineSeries;
      try {
        // Try v4+ method first
        lineSeries = (chart as any).addLineSeries({
          color: '#c4f85c',
          lineWidth: 2,
          crosshairMarkerVisible: true,
          lastValueVisible: true,
          priceLineVisible: true,
        });
        console.log('Using addLineSeries (v4+)');
      } catch (e) {
        console.log('addLineSeries failed, trying addSeries (v3):', e);
        // Fallback to v3 method
        lineSeries = (chart as any).addSeries('line', {
          color: '#c4f85c',
          lineWidth: 2,
          crosshairMarkerVisible: true,
          lastValueVisible: true,
          priceLineVisible: true,
        });
        console.log('Using addSeries (v3)');
      }
      
      chartRef.current = chart;
      seriesRef.current = lineSeries;
      
      console.log('Chart initialization complete');
      
      const handleResize = () => {
        if (chartContainerRef.current && chartRef.current) {
          chartRef.current.applyOptions({ 
            width: chartContainerRef.current.clientWidth || 400 
          });
        }
      };
      
      window.addEventListener('resize', handleResize);
      
      // Force initial resize
      setTimeout(handleResize, 100);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        if (chartRef.current) {
          chartRef.current.remove();
        }
      };
    } catch (error) {
      console.error('Chart initialization error:', error);
      setChartError(`Chart initialization failed: ${error}`);
    }
  }, [height]);

  // Initial data setup
  useEffect(() => {
    console.log('Setting up initial data, initialPrice:', initialPrice, 'priceData length:', priceData.length);
    
    if (initialPrice > 0 && priceData.length === 0) {
      const now = Math.floor(Date.now() / 1000) as UTCTimestamp;
      const initialData: PriceData[] = [
        { time: (now - 300) as UTCTimestamp, value: initialPrice * 0.99 },
        { time: (now - 180) as UTCTimestamp, value: initialPrice * 1.01 },
        { time: (now - 60) as UTCTimestamp, value: initialPrice * 0.98 },
        { time: now, value: initialPrice },
      ];
      
      console.log('Setting initial data:', initialData);
      setPriceData(initialData);
      setCurrentPrice(initialPrice);
      setIsLoading(false);
    } else if (priceData.length === 0) {
      // Create dummy data to show chart is working
      const now = Math.floor(Date.now() / 1000) as UTCTimestamp;
      const dummyData: PriceData[] = [
        { time: (now - 300) as UTCTimestamp, value: 0.001 },
        { time: (now - 180) as UTCTimestamp, value: 0.0012 },
        { time: (now - 60) as UTCTimestamp, value: 0.0009 },
        { time: now, value: 0.0011 },
      ];
      
      console.log('Setting dummy data:', dummyData);
      setPriceData(dummyData);
      setIsLoading(false);
    }
  }, [initialPrice, priceData.length]);

  // Update chart with new data
  useEffect(() => {
    console.log('Updating chart data, series available:', !!seriesRef.current, 'data length:', priceData.length);
    
    if (seriesRef.current && priceData.length > 0) {
      try {
        const chartData = priceData.map(item => ({
          time: item.time,
          value: item.value,
        }));
        
        console.log('Setting chart data:', chartData);
        seriesRef.current.setData(chartData);
        
        if (chartRef.current) {
          setTimeout(() => {
            chartRef.current?.timeScale().fitContent();
          }, 100);
        }
      } catch (error) {
        console.error('Error updating chart data:', error);
      }
    }
  }, [priceData]);

  // Listen for socket price updates
  useEffect(() => {
    let socket: any;
    
    const handlePriceUpdate = (data: any) => {
      console.log('Received price update:', data);
      
      if (data.token_address === tokenAddress && data.metrics?.token_price_sol) {
        const newPrice = parseFloat(data.metrics.token_price_sol);
        const timestamp = Math.floor(data.metrics.timestamp / 1000) as UTCTimestamp;
        
        console.log('Processing price update:', { newPrice, timestamp });
        
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
      console.log('Socket listener added for token_metrics_update');
    }).catch(console.error);

    return () => {
      if (socket) {
        socket.off('token_metrics_update', handlePriceUpdate);
        console.log('Socket listener removed');
      }
    };
  }, [tokenAddress, currentPrice]);

  if (chartError) {
    return (
      <div className="price-chart-loading" style={{ height }}>
        <Text style={{ color: '#ff7373' }}>Chart Error: {chartError}</Text>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="price-chart-loading" style={{ height }}>
        <Text>Loading chart...</Text>
      </div>
    );
  }

  return (
    <div className="price-chart-container" style={{ height }}>
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
      <div 
        ref={chartContainerRef} 
        className="price-chart" 
        style={{ 
          height: height - 40,
          minHeight: '200px',
          width: '100%',
          position: 'relative'
        }} 
      />
    </div>
  );
}; 