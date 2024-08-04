import { eleven } from "@/lib/eleven";

export async function GET() {
    const voices = await eleven.voices.getAll();
    return Response.json(voices);
}