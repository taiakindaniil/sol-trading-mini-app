import { Cell, Image, List, Title, Text, Spinner } from '@telegram-apps/telegram-ui';
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

  useEffect(() => {
    fetchTokens();
  }, []);


  return (
    <Page>
      <List style={{ padding: '0px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginLeft: '20px', marginTop: '20px' }}>
          <Title weight="1" style={{ marginRight: '10px' }}>
            Tokens <span style={{ fontSize: '14px', alignContent: 'center', color: 'rgba(255, 255, 255, 0.5)' }}>• 5 min</span>
          </Title>
        </div>
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
                before={
                  <div style={{ position: 'relative' }}>
                    <Image src={tokenInfo.token.image_uri} style={{ backgroundColor: '#000', borderRadius: '100%' }}/>
                    <svg style={{display: 'block', position: 'absolute', right: '-2px', bottom: '-2px'}} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="0.25" y="0.25" width="15.5" height="15.5" rx="7.75" fill="black"></rect><rect x="0.25" y="0.25" width="15.5" height="15.5" rx="7.75" stroke="url(#paint0_linear_4906_442)" stroke-width="0.5"></rect><path d="M3.39299 5.36746L8.00003 2.73486L12.6071 5.36746V10.6326L8.00003 13.2652L3.39299 10.6326V5.36746Z" fill="#1A2138"></path><path d="M12.0843 6.68689V10.3587L8.0001 12.7163L3.9137 10.3587V5.64137L8.0001 3.28154L11.139 5.09469L11.6128 4.82135L8.0001 2.73486L3.43991 5.36803V10.6321L8.0001 13.2652L12.5603 10.6321V6.41355L12.0843 6.68689Z" fill="url(#paint1_linear_4906_442)"></path><path d="M6.8566 10.3589H6.17325V8.06736H8.45109C8.6666 8.06498 8.87248 7.97784 9.02424 7.82479C9.17601 7.67177 9.26141 7.46515 9.26199 7.2496C9.26321 7.14306 9.24265 7.03734 9.20152 6.93904C9.16037 6.8407 9.09958 6.75185 9.0228 6.6779C8.94852 6.60156 8.85961 6.54103 8.76137 6.49994C8.66312 6.45881 8.55757 6.43799 8.45109 6.4387H6.17325V5.7417H8.45334C8.85253 5.74409 9.2347 5.90373 9.51701 6.18599C9.79923 6.46828 9.95889 6.85044 9.96126 7.2496C9.9637 7.55518 9.87057 7.85385 9.69478 8.10379C9.53301 8.34295 9.30505 8.52976 9.03876 8.64136C8.77508 8.72499 8.4999 8.76651 8.22328 8.76438H6.8566V10.3589Z" fill="url(#paint2_linear_4906_442)"></path><path d="M9.94528 10.3036H9.14803L8.53304 9.23073C8.77635 9.21584 9.01635 9.16676 9.24599 9.08496L9.94528 10.3036Z" fill="url(#paint3_linear_4906_442)"></path><path d="M11.6082 5.92182L12.0797 6.18379L12.5511 5.92182V5.36831L12.0797 5.09497L11.6082 5.36831V5.92182Z" fill="url(#paint4_linear_4906_442)"></path><defs><linearGradient id="paint0_linear_4906_442" x1="15.9859" y1="4.00527" x2="-0.233681" y2="11.4942" gradientUnits="userSpaceOnUse"><stop stop-color="#C200FB"></stop><stop offset="0.489658" stop-color="#3772FF"></stop><stop offset="0.489758" stop-color="#3773FE"></stop><stop offset="1" stop-color="#5AC4BE"></stop></linearGradient><linearGradient id="paint1_linear_4906_442" x1="12.5523" y1="5.37093" x2="2.88211" y2="9.23799" gradientUnits="userSpaceOnUse"><stop stop-color="#C200FB"></stop><stop offset="0.489658" stop-color="#3772FF"></stop><stop offset="0.489758" stop-color="#3773FE"></stop><stop offset="1" stop-color="#5AC4BE"></stop></linearGradient><linearGradient id="paint2_linear_4906_442" x1="12.5522" y1="5.36875" x2="2.88207" y2="9.23582" gradientUnits="userSpaceOnUse"><stop stop-color="#C200FB"></stop><stop offset="0.489658" stop-color="#3772FF"></stop><stop offset="0.489758" stop-color="#3773FE"></stop><stop offset="1" stop-color="#5AC4BE"></stop></linearGradient><linearGradient id="paint3_linear_4906_442" x1="12.5521" y1="5.37043" x2="2.88202" y2="9.23749" gradientUnits="userSpaceOnUse"><stop stop-color="#C200FB"></stop><stop offset="0.489658" stop-color="#3772FF"></stop><stop offset="0.489758" stop-color="#3773FE"></stop><stop offset="1" stop-color="#5AC4BE"></stop></linearGradient><linearGradient id="paint4_linear_4906_442" x1="12.5522" y1="5.36893" x2="2.88207" y2="9.23599" gradientUnits="userSpaceOnUse"><stop stop-color="#C200FB"></stop><stop offset="0.489658" stop-color="#3772FF"></stop><stop offset="0.489758" stop-color="#3773FE"></stop><stop offset="1" stop-color="#5AC4BE"></stop></linearGradient></defs></svg>
                  </div>
                }
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

        
        {/* <Section
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
        </Section> */}
      </List>
    </Page>
  );
};
