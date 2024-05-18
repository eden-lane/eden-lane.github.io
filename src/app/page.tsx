"use client";
import clsx from "clsx";
import { Lastfm } from "@/components/Lastfm";
import { Block } from "@/components/Block";
import { useEffect, useRef, useState } from "react";
import apps from "../data/apps.json";
import styles from "./page.module.css";
import { useSpring, useSpringRef, useSprings, useTransition } from "@react-spring/web";

const vhToPixel = (value: number) => `${(window.innerHeight * value) / 100}px`;
const vwToPixel = (value: number) => `${(window.innerWidth * value) / 100}px`;


const fewApps = apps.slice(0, 3);

export default function Home() {
  const [open, setOpen] = useState<string | null>(null);

  const isFirstRender = useRef(true);
  const ref = useRef<HTMLDivElement[]>([]);

  const blocks = [
    {
      name: "about",
      render: (style, index) => {
        return (
          <Block key={index} ref={handleRef(index)} style={style} className={styles.about} isOpen={open === "about"}
                 onClick={() => handleClick("about")}>
            <h2>About</h2>
            <div className={styles.body}>
              <div>
                <p>I'm <strong>eden lane</strong>, frontend engineer from Benidorm, Spain.</p>
                <p>In my free time I build <a target="_blank" href="https://getweek.pro">Week</a> - task manager with an
                  integrated
                  calendar.</p>
              </div>
              <img src="/eden.png" alt="eden" width="100px" height="100px" />
            </div>
          </Block>
        );
      }
    },
    {
      name: "lastfm",
      render: (style, index) => {
        return (<Block ref={handleRef(index)} className={styles.lastfm} style={style} isOpen={open === "lastfm"}
                       onClick={() => handleClick("lastfm")}>
          <h2>Last.fm</h2>
          <Lastfm />
        </Block>);
      }
    },
    {
      name: "map",
      render: (style, index) => {
        return (
          <Block style={style} ref={handleRef(index)} className={styles.map} isOpen={open === "map"}
                 onClick={() => handleClick("map")}>
            <div style={{ height: "150px" }}>
              <gmp-map center="38.541343688964844,-0.12339382618665695" zoom="4" map-id="DEMO_MAP_ID">
                <gmp-advanced-marker position="38.541343688964844,-0.12339382618665695"
                                     title="My location"></gmp-advanced-marker>
              </gmp-map>
            </div>
          </Block>
        );
      }
    },
    {
      name: "twitter",
      render: (style, index) => {
        return (
          <Block style={style} ref={handleRef(index)} className={clsx(styles.twitter, {
            [styles.open]: open === "twitter"
          })} isOpen={open === "twitter"} onClick={() => handleClick("twitter")}>
            <div className={styles.body}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
                   className="icon icon-tabler icons-tabler-outline icon-tabler-brand-x">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
                <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
              </svg>
              <a target="_blank" href="https://x.com/lane_en">@lane_en</a>
            </div>
          </Block>
        );
      }
    },
    {
      name: "apps",
      height: 300,
      width: 300,
      render: (style, index) => {
        return (
          <Block style={style} ref={handleRef(index)} className={clsx(styles.apps, {
            [styles.open]: open === "apps"
          })} isOpen={open === "apps"}
                 onClick={() => handleClick("apps")}>
            <h2>Apps</h2>
            <div className={styles.body}>
              {(open === "apps" ? apps : fewApps).map((app) => (
                <div className={styles.app} key={app.title}>
                  <img width={32} height={32} src={app.icon} alt={app.title} />
                  <div className={styles.info}>
                    <div>
                      <strong>
                        {app.title}
                        {app.paid && <><span>&nbsp;-</span><span className={styles.paid}>&nbsp;{app.paid}</span></>}
                      </strong>
                    </div>
                    <div>{app.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </Block>
        );
      }
    }
  ];

  const handleClick = (id: string) => {
    if (open === id) {
      setOpen(null);
    } else {
      setOpen(id);
    }
  };

  const [springs, apis] = useSprings(
    blocks.length,
    (index) => ({
      position: "static",
      left: "0px",
      top: "0px",
      transform: "translate(0%, 0%)",
      width: "100%",
      height: "100%",
      zIndex: blocks[index]?.name === open ? 1 : 0
    }),
    []
  );

  const handleRef = (index: number) =>
    (element?: HTMLDivElement) => {
      if (element) {
        ref.current[index] = element;
      }
    };

  const getRects = () => {
    ref.current.forEach((element) => {
      if (element) {
        element.style.width = "auto";
        element.style.height = "auto";
        element.style.position = "static";
        element.style.transform = "translate(0%, 0%)";
        element.style.maxHeight = "150px";
      }
    });

    const rects = ref.current.map((element) => element?.getBoundingClientRect());
    resetElements();

    return rects;
  };

  const resetElements = () => {
    ref.current.forEach((element) => {
      if (element) {
        element.style.position = "fixed";
        element.style.transform = "";
        element.style.maxHeight = "";
      }
    });
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;

      const rects = getRects();
      apis.start((index) => {
        return {
          position: "fixed",
          left: `${rects[index]?.left}px`,
          top: `${rects[index]?.top}px`,
          width: `${rects[index]?.width}px`,
          height: `${rects[index]?.height}px`,
          transform: "translate(0%, 0%)",
          immediate: true
        };
      });
    }

    if (open) {
      const rects = getRects();

      apis.start((index) => {
        const block = blocks[index];

        const rect = rects[index];
        const left = `${rect?.left}px`;
        const top = `${rect?.top}px`;
        const width = block?.name === open && block?.width ? `${block.width}px` : `${rect?.width}px`;
        const height = block?.name === open && block?.height ? `${block.height}px` : `${rect?.height}px`;

        return {
          from: {
            zIndex: block?.name === open ? 5 : 1
          },
          width,
          height,
          position: "fixed",
          left: block?.name === open ? vwToPixel(50) : left,
          top: block?.name === open ? vhToPixel(50) : top,
          transform: block?.name === open ? "translate(-50%, -50%)" : "translate(0%, 0%)",
          zIndex: block?.name === open ? 5 : 1
        };
      });
    } else {
      const rects = getRects();

      apis.start((index) => {
        const rect = rects[index];
        const left = `${rect?.left ?? 0}px`;
        const top = `${rect?.top ?? 0}px`;
        const width = `${rect?.width ?? 0}px`;
        const height = `${rect?.height ?? 0}px`;

        return {
          position: "fixed",
          left,
          top,
          width,
          height,
          transform: "translate(0%, 0%)",
          zIndex: 0
        };
      });
    }
  }, [open, blocks]);

  return (
    <main className={styles.main}>
      {
        blocks.map((block, index) => {
          return block.render(springs[index], index);
        })
      }


    </main>
  );
}
