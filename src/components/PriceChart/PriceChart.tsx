import { FC, useEffect, useRef, useState } from 'react';
import { createChart, ISeriesApi, AreaSeries, UTCTimestamp } from 'lightweight-charts';
import { formatMarketCap } from '@/helpers/formatters';
import './PriceChart.css';
import { useApi } from '@/api';
import { TokenPricesResponse } from '@/api/services/tokenService';

interface PriceChartProps {
  tokenAddress: string;
  tokenSupply: number;  
  initialPrice?: number;
  height?: number;
}

export const PriceChart: FC<PriceChartProps> = ({ tokenAddress, tokenSupply, initialPrice = 0, height = 270 }) => {
  const api = useApi();
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const lineSeriesRef = useRef<ISeriesApi<'Area'> | null>(null);
  const [chartReady, setChartReady] = useState(false);
  const [currentPrice, setCurrentPrice] = useState<number>(initialPrice);
  const [_, setDebugInfo] = useState<string>('Initializing...');
  const [prices, setPrices] = useState<TokenPricesResponse['data']['prices']>([]);

  useEffect(() => {
    api.token.getTokenPrices(tokenAddress).then((data) => {
      setPrices(data.data.prices);
    });
  }, [tokenAddress]);

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
        height: Math.max(height, 270),
        layout: {
          background: { color: 'black' },
          textColor: '#ffffff',
          attributionLogo: false
        },
        // crosshair: {
        //   // hide the horizontal crosshair line
        //   horzLine: {
        //     visible: false,
        //   },
        //   // hide the vertical crosshair label
        //   vertLine: {
        //     labelVisible: false,
        //   },
        // },
        // hide the grid lines
        grid: {
          vertLines: {
            visible: false,
          },
          horzLines: {
            visible: true,
            color: '#2B2B43'
          },
        },
        rightPriceScale: {
          borderColor: '#485c7b',
        },
        timeScale: {
          borderColor: '#485c7b',
          timeVisible: true,
          secondsVisible: true,
        },
        localization: {
          timeFormatter: (time: UTCTimestamp) => {
            const date = new Date(time * 1000);
            return date.toLocaleTimeString();
          },
          priceFormatter: (price: number) => {
            return `${formatMarketCap(price, 3)}`;
          },
        },
      });

      setDebugInfo('Chart created successfully');

      lineSeriesRef.current = chart.addSeries(AreaSeries, {
        topColor: 'rgba(255, 255, 255, 0.5)',
        bottomColor: 'rgba(255, 255, 255, 0.1)',
        lineColor: 'rgba(255, 255, 255, 1)',
        lineWidth: 2,
      });

      // Add sample data
      const sampleData = prices.map((price) => ({
        time: new Date(price.datetime).getTime() / 1000 as UTCTimestamp,
        value: price.price * tokenSupply
      }));

      lineSeriesRef.current.setData(sampleData);
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
  }, [height, prices]);

  // Socket updates
  useEffect(() => {
    let socket: any;
    
    const handlePriceUpdate = (data: any) => {
      if (data.token_address === tokenAddress && data.metrics?.token_price_sol && lineSeriesRef.current) {
        const newPrice = parseFloat(data.metrics.token_price_sol);

        if (currentPrice != newPrice) {
          lineSeriesRef.current.update({
            time: Math.floor(new Date(data.metrics.timestamp).getTime() / 1000) as UTCTimestamp,
            value: (newPrice * tokenSupply)
          });
        }

        setCurrentPrice(newPrice);
        setDebugInfo(`Price updated: ${newPrice}`);
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
      {/* <div className="price-chart-header">
        <div className="price-info">
          <Text className="current-price">
            {currentPrice > 0 ? `$${currentPrice.toFixed(8)}` : 'No price data'}
          </Text>
        </div>
        <Text style={{ fontSize: '10px', color: '#888' }}>
          {debugInfo}
        </Text>
      </div> */}
      <div 
        ref={chartContainerRef} 
        className="price-chart"
        style={{ 
          height: height,
          width: '100',
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