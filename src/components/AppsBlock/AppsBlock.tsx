import React, { useMemo, useState } from 'react';
import { WidgetHeader } from '../WidgetHeader';
import { animated, useTrail } from '@react-spring/web';
import data from '../../data/apps.json';
import styles from './AppsBlock.module.css';

export const AppsBlock = () => {
  const [isOpen, setOpen] = useState(false);

  const apps = useMemo(() => shuffleArray(data), []);

  const trails = useTrail(isOpen ? apps.length : 3, {
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    },
    config: {
      duration: 500 / apps.length,
    },
  });

  return (
    <div className={styles.root}>
      <WidgetHeader title="Apps I Use a Lot" isOpen={isOpen} onToggle={setOpen} />
      <div className={`${styles.apps} ${styles.vertical}`}>
        {apps.slice(0, isOpen ? undefined : 3).map((app, index) => {
          return (
            <animated.span
              key={app.title}
              style={trails[index]}
              className={styles.app}
              rel="noopener noreferrer">
              <img className={styles.logo} src={app.icon} alt={app.title} />
              <div className={styles.info}>
                <div className={styles.title}>{app.title}</div>
                {app.paid && <span className={styles.price}>$</span>}
              </div>
            </animated.span>
          );
        })}
      </div>
    </div>
  );
};

const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};
