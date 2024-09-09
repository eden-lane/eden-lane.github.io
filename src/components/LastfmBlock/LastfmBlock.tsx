import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import clsx from 'clsx';
import { animated, useTrail, config } from '@react-spring/web';
import { actions } from 'astro:actions';
import type { Track } from '../../types/tracks.ts';
import styles from './LastfmBlock.module.css';
import { WidgetHeader } from '../WidgetHeader';
import { Music } from '../icons/Music.tsx';

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
      // transform: 'scaleX(0.90)',
      width: '90%',
    },
    to: {
      // transform: 'scaleX(1)',
      width: '100%',
    },
    config: config.wobbly,
  });

  if (!tracks.length) {
    return (
      <animated.div className={styles.root}>
        <WidgetHeader title="Music I Listen To" isOpen={isOpen} onToggle={setOpen} />
        {defaultTracks.slice(0, isOpen ? defaultTracks.length - 1 : 1).map((_, i) => (
          <div key={i} className={styles.track}>
            <div className={styles.info}>
              <div className={clsx(styles.cover, styles.skeleton)} />
              <div>
                <div className={clsx(styles.title, styles.skeleton)} />
                <div className={clsx(styles.artist, styles.skeleton)} />
              </div>
            </div>
          </div>
        ))}
      </animated.div>
    );
  }

  return (
    <div className={`${styles.root} ${isOpen ? styles.open : ''}`}>
      <WidgetHeader title="Music I Listen To" isOpen={isOpen} onToggle={setOpen} />
      <div className={styles.tracks}>
        {trail.map((style, index) => {
          const track = tracks[index];

          return (
            <animated.a
              href={track.url}
              key={track.url}
              className={styles.track}
              style={style}
              target="_blank">
              <div className={styles.info}>
                <Cover src={track.image} />
                <div>
                  <div className={styles.title}>{track.title}</div>
                  <div className={styles.artist}>{track.artist}</div>
                </div>
              </div>
              {track.date && (
                <div className={styles.date}>
                  <span>{formatDistanceToNow(new Date(track.date))} ago</span>
                </div>
              )}
              {track.isNowPlaying && (
                <div className={styles.now}>
                  <span>Now Playing</span>
                </div>
              )}
            </animated.a>
          );
        })}
      </div>
    </div>
  );
};

type CoverProps = {
  src?: string;
};

const Cover = (props: CoverProps) => {
  const [src, setSrc] = useState<string | undefined>(props.src);

  return src ? (
    <img className={styles.cover} src={src} onError={() => setSrc(undefined)} alt="Cover" />
  ) : (
    <div className={styles.cover}>
      <Music width={32} height={32} />
    </div>
  );
};
