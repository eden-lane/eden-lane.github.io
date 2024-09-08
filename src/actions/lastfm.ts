import { defineAction } from "astro:actions";
import { LastFMUser } from "lastfm-ts-api";


const user = new LastFMUser(import.meta.env.LASTFM_API_KEY!);

export const getTracks = defineAction({
  handler: async () => {
    const { recenttracks } = await user.getRecentTracks({ user: "YourRain", limit: 5 });

    const tracks = new Map();

    recenttracks.track.map((track) => ({
      artist: track.artist["#text"],
      title: track.name,
      url: track.url,
      image: track.image[3]["#text"],
      date: track.date?.uts && +track.date?.uts * 1000,
      isNowPlaying: track["@attr"]?.nowplaying === "true"
    }))
      .forEach((track) => {
        if (track.isNowPlaying) {
          tracks.set(track.url, track);
        } else if (!tracks?.has(track.url)) {
          tracks.set(track.url, track);
        }
      });

    return Array.from(tracks.values()).slice(0, 5);
  }
});
