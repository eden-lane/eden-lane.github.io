"use client";

import React from "react";
import useSWR from "swr";
import styles from "./styles.module.css";

type Track = {
  "@attr": { nowplaying: "true" | "false" },
  name: string;
  artist: {
    "#text": string;
  }
  mbid: string;
  image: {
    size: string;
    "#text": string;
  }[]
}

type Response = {
  track: Track[];
}

export const Lastfm = () => {
  const { data } = useSWR<Response>("/lastfm", (url) => fetch(url).then((res) => res.json()));

  return (
    <div className={styles.track}>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"
           className="icon icon-tabler icons-tabler-outline icon-tabler-vinyl">
        <path d="M16 3.937a9 9 0 1 0 5 8.063" />
        <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
        <path d="M20 4m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
        <path d="M20 4l-3.5 10l-2.5 2" />
      </svg>
      <strong>{data?.track[0].artist["#text"]}</strong>
      <div>{data?.track[0].name}</div>
      <div
        className={styles.status}>{data?.track[0]["@attr"]?.nowplaying === "true" ? "Now playing" : "Last played"}</div>
    </div>
  );
};
