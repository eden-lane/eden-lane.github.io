import quotes from '../../data/quotes.json';

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(quotes[Math.floor(Math.random() * quotes.length)]);
}
