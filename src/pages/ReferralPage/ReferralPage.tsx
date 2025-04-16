// import { openLink } from '@telegram-apps/sdk-react';
import {
    Cell,
    List,
    Section,
    Title,
  } from '@telegram-apps/telegram-ui';
  
  import {
    initDataState as _initDataState,
    // type User,
    // useSignal,
  } from '@telegram-apps/sdk-react';
  
  import { FC} from 'react';
  
  import { Page } from '@/components/Page';
  // import { bem } from '@/css/bem';
  
  import './ReferralPage.css';
  
  // const [, e] = bem('wallet-page');
  
  export const ReferralPage: FC = () => {
    return (
      <Page>
        <List>
            <Title style={{ marginLeft: '0px', marginTop: '10px' }} weight="1">
                My Referrals
            </Title>
            <Section footer="These pages help developer to learn more about current launch information">
                <Cell subhead="Referral Link">t.me/do0rman_bot?start=ref_username</Cell>
            </Section>
        </List>
      </Page>
    );
};
  