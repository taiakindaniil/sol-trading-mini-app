import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabbar } from '@telegram-apps/telegram-ui';
import { bem } from '@/css/bem.ts';

import './TabBar.css';
const [, e] = bem('tab-bar');

const tabs = [
  {
    id: 'tokens',
    text: 'Tokens',
    path: '/',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
        <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="2"/>
      </svg>
    )
  },
  {
    id: 'wallet',
    text: 'Wallet',
    path: '/wallet',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M17 8v-3a1 1 0 0 0 -1 -1h-10a2 2 0 0 0 0 4h12a1 1 0 0 1 1 1v3m0 4v3a1 1 0 0 1 -1 1h-12a2 2 0 0 1 -2 -2v-12" /><path d="M20 12v4h-4a2 2 0 0 1 0 -4h4" /></svg>
    )
  },
  {
    id: 'search',
    text: 'Search',
    path: '/search',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill="currentColor" stroke="currentColor" strokeWidth="0.8" strokeLinejoin="round" strokeLinecap="round" rx="2" ry="2"/>
      </svg>
    )
  },
  {
    id: 'referral',
    text: 'Referral',
    path: '/referral',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" /><path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /><path d="M21 21v-2a4 4 0 0 0 -3 -3.85" /></svg>
    )
  }
];

export function TabBar() {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState(tabs[0].id);

  return (
    <Tabbar className={e('tab-bar')}>
      {tabs.map(({ id, text, path, icon }) => (
        <Tabbar.Item
          key={id}
          text={text}
          selected={id === currentTab}
          onClick={() => {
            setCurrentTab(id);
            navigate(path);
          }}
        >
          {icon}
        </Tabbar.Item>
      ))}
    </Tabbar>
  );
} 