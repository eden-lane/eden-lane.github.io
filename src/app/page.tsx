"use client";
import clsx from "clsx";
import { Lastfm } from "@/components/Lastfm";
import { Block } from "@/components/Block";
import { useState } from "react";
import apps from "../data/apps.json";
import styles from "./page.module.css";
import { useSprings } from "@react-spring/web";
import useSWR from "swr";


const fewApps = apps.slice(0, 3);

export default function Home() {
  const { data: quote } = useSWR("/quote", (url: string) => fetch(url).then((res) => res.json()));

  const blocks = [
    {
      name: "about",
      render: (style, index) => {
        return (
          <Block key={index} style={style} className={styles.about}
                 onClick={() => handleClick("about")}>
            <h2>About</h2>
            <div className={styles.body}>
              <div>
                <p>I&apos;m <strong>eden lane</strong>, frontend engineer from Benidorm, Spain.</p>
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
        return (<Block className={styles.lastfm} style={style}
                       onClick={() => handleClick("lastfm")}>
          <h2>Last.fm</h2>
          <Lastfm />
        </Block>);
      }
    },
    {
      name: "map",
      render: (style, index) => {
        /* @ts-ignore */
        return (
          <Block style={style} className={styles.map}
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
          <Block style={style} className={styles.twitter}>
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
          <Block style={style} className={styles.apps}
          >
            <h2>Apps</h2>
            <div className={styles.body}>
              {(fewApps).map((app) => (
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

  const [springs, apis] = useSprings(
    blocks.length,
    (index) => ({
      position: "static",
      left: "0px",
      top: "0px",
      transform: "translate(0%, 0%)",
      width: "100%",
      height: "100%"
    }),
    []
  );


  return (
    <>
      <main className={styles.main}>
        {
          blocks.map((block, index) => {
            return block.render(springs[index], index);
          })
        }
      </main>
      <footer>
        {quote?.split("\n").map((line, index) => <div key={index}>{line}</div>)}
      </footer>
    </>

  );
}
