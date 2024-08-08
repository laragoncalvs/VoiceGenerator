"use client";

import { Voice } from "elevenlabs/api";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { LoaderCircleIcon, PauseIcon, PlayIcon } from "lucide-react";
import { useEffect, useState, useTransition } from "react";

interface VoiceCardProps {
  text: string;
  voice: Voice;
}

export function VoiceCard({ voice, text }: VoiceCardProps) {
  const [generating, generate] = useTransition();
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement>();

  function onGenerate() {
    generate(async () => {
      const res = await fetch("/api/audio", {
        method: "POST",
        body: JSON.stringify({
          text,
          voiceId: voice.voice_id,
        }),
      });
      const { url } = await res.json();
      play(url);
    });
  }

  function play(url: string) {
    const audio = new Audio(url);
    audio.play();
  }

  return (
    <div className="flex flex-row items-center gap-14 " >
      <div>

        <Button
          type="button"
          size="icon"
          variant="secondary"
          className="rounded-full"
          onClick={() => play(voice.preview_url!)}
        >
          {<PlayIcon />}
        </Button>
      </div>
      <div >
        <div className="flex flex-row items-center gap-5">

          <h2 className="font-bold text-lg">
            {voice.name}
          </h2>
          | {voice.category}
        </div>
        <div>
          <div className="flex flex-row items-center gap-3">
            <h3 >Labels:</h3>


            {voice.labels &&
              Object.keys(voice.labels).map((key) => (
                <div key={key}>{voice.labels![key]}</div>
              ))}

         
            </div>

      </div>
    </div>
    <div className="ml-80 ">

    {text && (
      <Button
                className="  bg-violet-400"
                type="button"
                onClick={onGenerate}
                disabled={generating}
                >
                {generating ? (
                  <LoaderCircleIcon className="animate-spin" />
                ) : (
                  <PlayIcon />
                )} Gerar texto com essa voz
              </Button>
            )}
            </div>
            </div>
  );
}
