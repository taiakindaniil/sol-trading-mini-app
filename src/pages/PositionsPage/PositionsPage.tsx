import {
    List,
    Text,
    Title,
    Cell,
    Spinner,
    Image,
} from '@telegram-apps/telegram-ui';
  
import { FC, useState, useEffect } from 'react';
import { Page } from '@/components/Page';
import { Link } from '@/components/Link/Link.tsx';

//   import { bem } from '@/css/bem';
import { useApi } from '@/api';
import { ClosedPositionsResponse, OpenPositionResponse } from '@/api/services/userService';
//   const [, e] = bem('wallet-page');
import { OptionBlock } from '@/components/OptionBlock/OptionBlock';
import { WalletAddress } from '@/components/WalletAddress/WalletAddress';
  
export const PositionsPage: FC = () => {
    const api = useApi();
    const [positions, setPositionsData] = useState<OpenPositionResponse | null>(null);
    const [closedPositions, setClosedPositionsData] = useState<ClosedPositionsResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedTab, setSelectedTab] = useState<number>(0);

    useEffect(() => {
      const fetchOpenPositionsData = async () => {
        setIsLoading(true);
        try {
          const positionsData = await api.user.getOpenPositions();
          setPositionsData(positionsData);
          setIsLoading(false);
        } catch (error) {
          console.error('Error fetching positions data:', error);
          setIsLoading(false);
        }
      };

      const fetchClosedPositionsData = async () => {
        setIsLoading(true);
        try {
          const positionsData = await api.user.getClosedPositions();
          setClosedPositionsData(positionsData);
          setIsLoading(false);
        } catch (error) {
          console.error('Error fetching closed positions data:', error);
          setIsLoading(false);
        }
      }
    
      fetchOpenPositionsData();
      fetchClosedPositionsData();
    }, [api]);

    const renderPositionList = () => {
      if (isLoading) {
        return (
          <List style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Spinner size="m" />
          </List>
        );
      }

      if (selectedTab === 0) {
        if (!positions?.data.length) {
          return <Cell>No open positions available</Cell>;
        }

        return positions.data.map((pos) => {
          return (
            <Link key={pos.token.address} to={`/token/${pos.token.address}`}>
              <Cell
                before={
                  <div style={{ position: 'relative' }}>
                    <Image src={pos.token.image_uri} style={{ backgroundColor: '#000', borderRadius: '100%' }}/>
                  </div>
                }
                subtitle={
                  <WalletAddress address={pos.token.address} slice={5} />
                }
                after={
                  <div style={{ display: 'flex', flexDirection: 'column', color: '#fff', alignItems: 'flex-end' }}>
                    <Text style={{ color: '#fff' }}>
                      {pos.current_value_sol?.toFixed(5) ?? "—"} SOL
                    </Text>
                  </div>
                }
              >
                <Text style={{ color: '#fff' }} weight='2'>{pos.token.symbol}</Text>
              </Cell>
            </Link>
          );
        });
      } else {
        if (!closedPositions?.data.length) {
          return <Cell>No closed positions available</Cell>;
        }

        return closedPositions.data.map((pos) => (
          <Link key={pos.token.address} to={`/token/${pos.token.address}`}>
            <Cell
              before={
                <div style={{ position: 'relative' }}>
                  <Image src={pos.token.image_uri} style={{ backgroundColor: '#000', borderRadius: '100%' }}/>
                </div>
              }
              subtitle={
                <WalletAddress address={pos.token.address} slice={5} />
              }
              after={
                <div style={{ display: 'flex', flexDirection: 'column', color: '#fff', alignItems: 'flex-end' }}>
                  <Text style={{ color: pos.pnl_percentage >= 0 ? '#4CAF50' : '#FF5252' }}>
                    {pos.pnl_percentage >= 0 ? '+' : ''}{pos.pnl_percentage.toFixed(1)}%
                  </Text>
                  <Text style={{ color: '#fff' }}>
                    {pos.pnl_sol.toFixed(2)} SOL
                  </Text>
                </div>
              }
            >
              <Text style={{ color: '#fff' }} weight='2'>{pos.token.symbol}</Text>
            </Cell>
          </Link>
        ));
      }
    };
  
    return (
      <Page back={false}>
        <List style={{ padding: '0px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: '20px', marginTop: '20px', marginRight: '20px' }}>
            <Title weight="1" style={{ marginRight: 'auto' }}>
              Positions
            </Title>

            <OptionBlock defaultSelected={0} onChange={setSelectedTab}>
              <div>Open</div>
              <div>Closed</div>
            </OptionBlock>
          </div>

          {renderPositionList()}
        </List>
      </Page>
    );
};
  