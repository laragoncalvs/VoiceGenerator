"use client";

import { Voice } from "elevenlabs/api";
import { Button } from "./ui/button";
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { LoaderCircleIcon, PlayIcon } from "lucide-react";
import React, { useTransition } from "react";
import { RootState } from "@/app/store";
import { useSelector } from "react-redux";
import { FilterOptions } from "./voices.slice";

interface VoiceCardProps {
  text: string;
  voice: Voice;
}

export function VoiceCard({ voice, text }: VoiceCardProps) {
  const [generating, generate] = useTransition();

  const filter = useSelector((state: RootState) => state.voice.filterOptions);
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
      className="flex align-row items-center justify-between overflow-hidden"

    >
      <CardHeader>
        <CardTitle className="flex items-center ">
          <Button
            type="button"
            size="icon"
            variant="secondary"
            className="rounded-full mr-5"
            onClick={() => play(voice.preview_url!)}
          >
            {<PlayIcon />}

          </Button>
          <div className="flex align-row">

            {voice.name}

          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">

        {voice.labels &&
          Object.keys(voice.labels).length > 0 &&
          (Object.keys(voice.labels) as Array<keyof FilterOptions>).map((key) => {
            const labelValue = voice.labels![key];
            if (
              filter[key] &&
              !filter[key]?.includes(labelValue)
            ) {
              return (
                <Badge variant="secondary" className="m-2 bg-indigo-200" key={key}>
                  {labelValue}
                </Badge>
              );
            }
            return null;
          })}
      </CardContent>
      <CardFooter className="p-0 pr-5">
        {text && (
          <Button
          variant="secondary"
            type="button"
            onClick={onGenerate}
            disabled={generating}
          >
            {generating ? (
              <LoaderCircleIcon className="animate-spin mr-2" />
            ) : (
              <PlayIcon className=" mr-2" />
            )}
            Gerar áudio com essa voz
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
