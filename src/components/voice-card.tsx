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
    <Card
      className={cn("transition-transform duration-300" , {
        // "transform translate-y-[-10px] shadow-md":
        //   voiceId === voice.voice_id,
        // "cursor-pointer": voiceId !== voice.voice_id,
      })}
      // onClick={() => setVoiceId(voice.voice_id)}
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {voice.name}
          <Button
            type="button"
            size="icon"
            variant="secondary"
            className="rounded-full"
            onClick={() => play(voice.preview_url!)}
          >
            {<PlayIcon />}
            {/* {playingAudio ? <PauseIcon /> : <PlayIcon />} */}
          </Button>
        </CardTitle>
        <CardDescription>{voice.category}</CardDescription>
      </CardHeader>
      <CardContent>
        <h3 className="font-bold text-lg">Labels</h3>

        {voice.labels &&
          Object.keys(voice.labels).map((key) => (
            <div key={key}>{voice.labels![key]}</div>
          ))}
      </CardContent>
      <CardFooter className="justify-end">
        {text && (
          <Button
            size="icon"
            className="rounded-full  bg-violet-300"
            type="button"
            onClick={onGenerate}
            disabled={generating}
          >
            {generating ? (
              <LoaderCircleIcon className="animate-spin" />
            ) : (
              <PlayIcon />
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
