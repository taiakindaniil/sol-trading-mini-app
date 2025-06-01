import {
    List,
    Text,
    Title,
    Cell,
    Spinner,
} from '@telegram-apps/telegram-ui';
  
import { FC, useState, useEffect } from 'react';
import { Page } from '@/components/Page';
import { Link } from '@/components/Link/Link.tsx';

//   import { bem } from '@/css/bem';
import { useApi } from '@/api';
import { OpenPositionResponse } from '@/api/services/userService';
//   const [, e] = bem('wallet-page');
import { OptionBlock } from '@/components/OptionBlock/OptionBlock';
  
export const PositionsPage: FC = () => {
    // const initDataState = useSignal(_initDataState);
    const api = useApi(); // This sets up the init data automatically

    const [positions, setPositionsData] = useState<OpenPositionResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

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
    
      fetchOpenPositionsData();
    }, [api]);
  
    return (
      <Page back={false}>
        <List style={{ paddingTop: '0px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
            <Title weight="1" style={{ marginRight: 'auto' }}>
              Positions
            </Title>
          </div>

          <OptionBlock defaultSelected={0}>
            <div>Open</div>
            {/* <div>Closed</div> */}
          </OptionBlock>

          {isLoading ? (
            <List style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Spinner size="m" />
            </List>
          ) : positions?.data.length === 0 ? (
            <Cell>No tokens available</Cell>
          ) : (
            positions?.data.map((pos) => (
              <Link key={pos.token_info.address} to={`/token/${pos.token_info.address}`}>
                <Cell
                  after={
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                      ${pos.token_info.total_usd_price ?? " ––"}
                    </div>
                  }
                >
                  <Text style={{ color: '#fff' }} weight='2'>{pos.metadata.symbol}</Text>
                </Cell>
              </Link>
            ))
          )}
        </List>
      </Page>
    );
};
  