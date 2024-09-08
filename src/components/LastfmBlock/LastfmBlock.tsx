import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import clsx from 'clsx';
import { animated, useSpring, useTrail, config } from '@react-spring/web';
import { actions } from 'astro:actions';
import { ChevronRight } from '../icons/ChevronRight.tsx';
import type { Track } from '../../types/tracks.ts';
import styles from './LastfmBlock.module.css';

const defaultTracks = Array.from({ length: 5 }).map((_, i) => ({}));

export const LastfmBlock = () => {
  const [isOpen, setOpen] = useState(false);
  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(() => {
    const fetchTracks = () => {
      actions.getTracks().then(({ data }) => {
        if (data) {
          setTracks(data);
        }
      });
    };
    
    fetchTracks();

    window.addEventListener('focus', fetchTracks);

    return () => {
      window.removeEventListener('focus', fetchTracks);
    };
  }, []);

  const trail = useTrail(isOpen ? tracks.length : 1, {
    from: {
      transform: 'scale(0.98)',
    },
    to: {
      transform: 'scale(1)',
    },
    config: config.stiff,
  });

  const renderHeader = () => (
    <header className={styles.header}>
      <div className={styles.toggle} onClick={() => setOpen(!isOpen)}>
        <ChevronRight width={16} height={16} style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }} />
        <span>Music</span>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"
           className="icon icon-tabler icons-tabler-outline icon-tabler-vinyl">
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M16 3.937a9 9 0 1 0 5 8.063" />
        <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
        <path d="M20 4m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
        <path d="M20 4l-3.5 10l-2.5 2" />
      </svg>

    </header>
  );

  if (!tracks.length) {
    return (
      <animated.div className={styles.root}>
        {renderHeader()}
        {
          defaultTracks.slice(0, isOpen ? defaultTracks.length - 1 : 1).map((_, i) => (
            <div key={i} className={styles.track}>
              <div className={styles.info}>
                <div className={clsx(styles.cover, styles.skeleton)} />
                <div>
                  <div className={clsx(styles.title, styles.skeleton)} />
                  <div className={clsx(styles.artist, styles.skeleton)} />
                </div>
              </div>
            </div>
          ))
        }
      </animated.div>
    );
  }

  return (
    <div className={styles.root}>
      {renderHeader()}
      {
        trail.map((style, index) => {
          const track = tracks[index];

          return (
            <animated.a href={track.url} key={track.url} className={styles.track} style={style} target="_blank">
              <div className={styles.info}>
                <img src={track.image} className={styles.cover} alt={track.title} />
                <div>
                  <div className={styles.title}>{track.title}</div>
                  <div className={styles.artist}>{track.artist}</div>
                </div>
              </div>
              {
                track.date && (
                  <div className={styles.date}>
                    <span>{formatDistanceToNow(new Date(track.date))}</span>
                  </div>
                )
              }
              {
                track.isNowPlaying && (
                  <div className={styles.now}>
                    <span>Now Playing</span>
                  </div>
                )
              }
            </animated.a>
          );
        })
      }
    </div>
  );
};
