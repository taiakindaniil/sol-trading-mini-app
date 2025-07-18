import { FC } from 'react';
import './Audit.css';
import { Modal, IconButton } from '@telegram-apps/telegram-ui';
import { ModalHeader } from '@telegram-apps/telegram-ui/dist/components/Overlays/Modal/components/ModalHeader/ModalHeader';

interface AuditProps {
//   tokenAddress: string;
  mintAuthority: string | null;
  freezeAuthority: string | null;
  buttonStyle?: React.CSSProperties;
  buttonClassName?: string;
}

export const Audit: FC<AuditProps> = ({ mintAuthority, freezeAuthority, buttonStyle, buttonClassName }) => {
  const getShieldColor = () => {
    const isMintNull = !mintAuthority || mintAuthority === 'null';
    const isFreezeNull = !freezeAuthority || freezeAuthority === 'null';
    
    if (isMintNull && isFreezeNull) {
      return '#22c55e'; // green
    } else if (isMintNull || isFreezeNull) {
      return '#eab308'; // yellow
    } else {
      return '#ef4444'; // red
    }
  };

  const isMintDisabled = !mintAuthority || mintAuthority === 'null';
  const isFreezeDisabled = !freezeAuthority || freezeAuthority === 'null';

  return (
    <Modal
        header={<ModalHeader>Audit</ModalHeader>}
        trigger={
        <IconButton 
            style={buttonStyle}
            className={buttonClassName}
            mode="gray"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={getShieldColor()} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </IconButton>
                }
        style={{zIndex: 1000}}
    >
        <div className="audit-content">
            <div className="audit-item">
                <div className="audit-column">
                    <span 
                        className={`audit-status ${isMintDisabled ? 'enabled' : 'disabled'}`}
                        style={{ color: isMintDisabled ? '#22c55e' : '#ef4444' }}
                    >
                        {isMintDisabled ? 'YES' : 'NO'}
                    </span>
                    <span className="audit-label">Mint Disabled</span>
                </div>
                <div className="audit-column">
                    <span 
                        className={`audit-status ${isFreezeDisabled ? 'enabled' : 'disabled'}`}
                        style={{ color: isFreezeDisabled ? '#22c55e' : '#ef4444' }}
                    >
                        {isFreezeDisabled ? 'YES' : 'NO'}
                    </span>
                    <span className="audit-label">Freeze Disabled</span>
                </div>
            </div>
        </div>
    </Modal>
  )
};