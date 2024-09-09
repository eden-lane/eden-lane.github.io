import React from 'react';
import { ChevronRight } from '../icons/ChevronRight.tsx';
import styles from './WidgetHeader.module.css';

type Props = {
  title: string;
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
};

export const WidgetHeader = (props: Props) => {
  const { title, isOpen, onToggle } = props;
  
  return (
    <header className={styles.header}>
      <div className={styles.toggle} onClick={() => onToggle(!isOpen)}>
        <span className={styles.icon}>
          <ChevronRight width={12} height={12} style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }} />
        </span>
        <span>{title}</span>
      </div>
    </header>
  );
};
