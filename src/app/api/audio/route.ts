import { createAudioStreamFromText } from "@/lib/eleven";
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";

export async function POST(req: Request): Promise<NextResponse> {
  const { text, voiceId } = await req.json();

  const stream = await createAudioStreamFromText(voiceId, text);

  const fileName = `${uuid()}.mp3`;
  const blob = await put(fileName, stream, {
    access: "public",
  });

  return NextResponse.json({ url: blob.url });
}
