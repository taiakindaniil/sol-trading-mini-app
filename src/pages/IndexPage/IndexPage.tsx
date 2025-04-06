import { Section, Cell, Image, List, Title, Text } from '@telegram-apps/telegram-ui';
import type { FC } from 'react';

import { Link } from '@/components/Link/Link.tsx';
import { Page } from '@/components/Page.tsx';

const tokens = [
  {
    address: '4qQM2x2pfhU3ToscAqkQxTfhTm7DmJe8LGWU9kvqeNH4',
    name: 'Token',
    image: 'https://example.com/token.png',
  },
  {
    address: '4qQM2x2pfhU3ToscAqkQxTfhTm7DmJe8LGWU9kvqeNH4',
    name: 'Token',
    image: 'https://example.com/token.png',
  },

];

export const IndexPage: FC = () => {
  return (
    <Page back={false}>
      <List style={{ padding: '0px' }}>
        <Title style={{ marginLeft: '20px', marginTop: '20px' }} weight="1">
          Tokens
        </Title>
        {tokens.map((token) => (
          <Link to={`/token/${token.address}`}>
            <Cell
              before={<Image src={token.image} style={{ backgroundColor: '#000', borderRadius: '100%' }}/>}
              subtitle={token.name}
            >
              <Text style={{ color: '#fff' }} weight='1'>{token.name}</Text>
            </Cell>
          </Link>
        ))}

        
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
