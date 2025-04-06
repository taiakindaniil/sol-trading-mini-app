# Icon System

This directory contains the icon system for the SOL Trading Mini App. It provides a consistent way to use SVG icons throughout the application.

## Icon Structure

The icon system is organized as follows:

- `index.tsx`: Contains the base `Icon` component and exports all icon components
- Individual icon components (e.g., `TokenIcon.tsx`, `WalletIcon.tsx`): Each icon is implemented as a separate component

## How to Use

### Basic Usage

```tsx
import { TokenIcon, WalletIcon } from '@/components/icons';

// In your component:
<TokenIcon />
<WalletIcon size={32} color="#1A73E8" />
```

### Props

All icon components accept the following props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| size | number | 24 | The size of the icon in pixels |
| color | string | 'currentColor' | The color of the icon (can be any CSS color) |
| className | string | '' | Additional CSS classes to apply to the icon |
| onClick | () => void | undefined | Click handler for the icon |

### Available Icons

- `TokenIcon`: Token/coin icon
- `WalletIcon`: Wallet icon
- `ArrowUpIcon`: Upward arrow (for send transactions)
- `ArrowDownIcon`: Downward arrow (for receive transactions)

### Using with Telegram UI Components

```tsx
import { InlineButtonsItem } from "@telegram-apps/telegram-ui/dist/components/Blocks/InlineButtons/components/InlineButtonsItem/InlineButtonsItem.js";
import { ArrowUpIcon, ArrowDownIcon } from '@/components/icons';

<InlineButtons mode="gray">
  <InlineButtonsItem text="Deposit">
    <ArrowDownIcon />
  </InlineButtonsItem>
  <InlineButtonsItem text="Send">
    <ArrowUpIcon />
  </InlineButtonsItem>
</InlineButtons>
```

## Adding New Icons

To add a new icon:

1. Create a new file in the `icons` directory (e.g., `NewIcon.tsx`)
2. Implement the icon component using the `Icon` base component
3. Export the icon from `index.tsx`

Example:

```tsx
// NewIcon.tsx
import React from 'react';
import { Icon, IconProps } from './index';

export const NewIcon: React.FC<IconProps> = (props) => {
  return (
    <Icon {...props}>
      {/* SVG paths go here */}
      <path d="..." stroke="currentColor" strokeWidth="2" />
    </Icon>
  );
};

// In index.tsx, add:
export * from './NewIcon';
``` 