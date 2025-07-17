import { FC, useEffect, useRef, useState } from 'react';
import { createChart, UTCTimestamp, LineSeries } from 'lightweight-charts';
import { Text } from '@telegram-apps/telegram-ui';
import './PriceChart.css';

interface PriceChartProps {
  tokenAddress: string;
  initialPrice?: number;
  height?: number;
}

export const PriceChart: FC<PriceChartProps> = ({ tokenAddress, initialPrice = 0, height = 270 }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [chartReady, setChartReady] = useState(false);
  const [currentPrice, setCurrentPrice] = useState<number>(initialPrice);
  const [debugInfo, setDebugInfo] = useState<string>('Initializing...');
  const [lineSeries, setLineSeries] = useState<any>(null);

  useEffect(() => {
    if (!chartContainerRef.current) {
      setDebugInfo('Chart container ref is null');
      return;
    }

    const container = chartContainerRef.current;
    setDebugInfo(`Container found: ${container.offsetWidth}x${container.offsetHeight}`);

    // Clear any existing content
    container.innerHTML = '';

    try {
      const chart = createChart(container, {
        width: Math.max(container.offsetWidth, 400),
        height: Math.max(height - 40, 230),
        layout: {
          background: { color: '#1e1e1e' },
          textColor: '#ffffff',
          attributionLogo: false
        },
        // grid: {
        //   vertLines: { color: '#2B2B43' },
        //   horzLines: { color: '#2B2B43' },
        // },
        // crosshair: {
        //   mode: 1,
        // },
        // rightPriceScale: {
        //   borderColor: '#485c7b',
        // },
        // timeScale: {
        //   borderColor: '#485c7b',
        // },
      });

      setDebugInfo('Chart created successfully');

      setLineSeries(chart.addSeries(LineSeries));

      // Add sample data
      const now = Math.floor(Date.now() / 1000);
      const sampleData = [
        { time: (now - 3600) as UTCTimestamp, value: 0.001 },
        { time: (now - 2700) as UTCTimestamp, value: 0.0015 },
        { time: (now - 1800) as UTCTimestamp, value: 0.0012 },
        { time: (now - 900) as UTCTimestamp, value: 0.0018 },
        { time: now as UTCTimestamp, value: 0.0016 },
      ];

      lineSeries.setData(sampleData);
      setCurrentPrice(0.0016);
      setChartReady(true);
      setDebugInfo('Chart data set, should be visible');

      // Resize handler
      const handleResize = () => {
        if (container && chart) {
          chart.applyOptions({
            width: Math.max(container.offsetWidth, 400),
          });
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        chart.remove();
      };
    } catch (error) {
      setDebugInfo(`Chart error: ${error}`);
      console.error('Chart creation error:', error);
    }
  }, [height]);

  // Socket updates
  useEffect(() => {
    let socket: any;
    
    const handlePriceUpdate = (data: any) => {
      if (data.token_address === tokenAddress && data.metrics?.token_price_sol) {
        const newPrice = parseFloat(data.metrics.token_price_sol);
        setCurrentPrice(newPrice);
        setDebugInfo(`Price updated: ${newPrice}`);

        lineSeries.update({
          value: newPrice
        });
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
  }, [tokenAddress]);

  return (
    <div className="price-chart-container" style={{ height }}>
      <div className="price-chart-header">
        <div className="price-info">
          <Text className="current-price">
            {currentPrice > 0 ? `$${currentPrice.toFixed(8)}` : 'No price data'}
          </Text>
        </div>
        <Text style={{ fontSize: '10px', color: '#888' }}>
          {debugInfo}
        </Text>
      </div>
      <div 
        ref={chartContainerRef} 
        className="price-chart"
        style={{ 
          height: height - 40,
          width: '100%',
          backgroundColor: '#1e1e1e',
          border: '1px solid #333'
        }}
      />
      {!chartReady && (
        <div style={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          color: '#fff',
          fontSize: '12px'
        }}>
          Loading chart...
        </div>
      )}
    </div>
  );
}; 