import { type PropsWithChildren } from 'react';
import { TabBar } from './TabBar';

export function Layout({ children }: PropsWithChildren) {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      height: '100vh',
      position: 'relative'
    }}>
      <main style={{ 
        flex: 1,
        overflow: 'auto',
        paddingBottom: '60px' // Add padding to prevent content from being hidden behind TabBar
      }}>
        {children}
      </main>
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000
      }}>
        <TabBar />
      </div>
    </div>
  );
} 