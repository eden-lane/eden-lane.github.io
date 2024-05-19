import { LastFMUser } from "lastfm-ts-api";

const user = new LastFMUser(process.env.LASTFM_API_KEY!);

export const dynamic = "force-dynamic";

export async function GET() {
  const { recenttracks } = await user.getRecentTracks({ user: "YourRain", limit: 1 });

  return Response.json(recenttracks);
}
