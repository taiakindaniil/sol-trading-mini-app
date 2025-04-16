import { Section, Cell, Image, List, Title, Text, Spinner } from '@telegram-apps/telegram-ui';
import type { FC } from 'react';
import { useEffect, useState } from 'react';

import { TokenInfo } from '@/api/services/tokenService';

import { Link } from '@/components/Link/Link.tsx';
import { Page } from '@/components/Page.tsx';
import { useApi } from '@/api';
import { formatMarketCap, formatTimeElapsed } from '@/helpers/formatters';

export const IndexPage: FC = () => {

  const api = useApi(); // This sets up the init data automatically

  const [loadedTokens, setLoadedTokens] = useState<TokenInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        setLoading(true);
        const response = await api.token.getTokens();
        setLoadedTokens(response.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch tokens:', err);
        setError('Failed to load tokens. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, []);


  return (
    <Page back={false}>
      <List style={{ padding: '0px' }}>
        <Title style={{ marginLeft: '20px', marginTop: '20px' }} weight="1">
          Tokens
        </Title>
        {loading ? (
          <List style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Spinner size="m" />
          </List>
        ) : error ? (
          <Cell style={{ color: 'red' }}>{error}</Cell>
        ) : loadedTokens.length === 0 ? (
          <Cell>No tokens available</Cell>
        ) : (
          loadedTokens.map((tokenInfo) => (
            <Link key={tokenInfo.token.id} to={`/token/${tokenInfo.token.address}`}>
              <Cell
                before={<Image src={tokenInfo.token.image_uri} style={{ backgroundColor: '#000', borderRadius: '100%' }}/>}
                subtitle={
                  <>
                    <Text style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.5)' }}>{(tokenInfo.metrics?.txns?.h24.buys ?? 0) + (tokenInfo.metrics?.txns?.h24.sells ?? 0)} txns</Text>
                  </>
                }
                after={
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <Text style={{ fontSize: '15px', color: '#c4f85c' }} weight='2'>MC ${formatMarketCap(tokenInfo.metrics?.market_cap ?? 0)}</Text>
                    <Text style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.5)' }}>{tokenInfo.pool?.created_at ? formatTimeElapsed(tokenInfo.pool.created_at) : ''}</Text>
                  </div>
                }
              >
                <Text style={{ color: '#fff' }} weight='2'>{tokenInfo.token.symbol}</Text>
              </Cell>
            </Link>
          ))
        )}

        
        <Section
          header="Application Launch Data"
          footer="These pages help developer to learn more about current launch information"
        >
          <Link to="/init-data">
            <Cell subtitle="User data, chat information, technical data">Init Data</Cell>
          </Link>
          <Link to="/launch-params">
            <Cell subtitle="Platform identifier, Mini Apps version, etc.">Launch Parameters</Cell>
          </Link>
          <Link to="/theme-params">
            <Cell subtitle="Telegram application palette information">Theme Parameters</Cell>
          </Link>
        </Section>
      </List>
    </Page>
  );
};
