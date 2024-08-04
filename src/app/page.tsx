"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Textarea } from "@/components/ui/textarea";
import { VoiceCard } from "@/components/voice-card";
import { cn } from "@/lib/utils";
import {
  PauseCircleIcon,
  PauseIcon,
  PlayCircleIcon,
  PlayIcon,
} from "lucide-react";
import { useEffect, useState, useTransition } from "react";

export default function Home() {
  const [generating, startGenerating] = useTransition();
  const [voices, setVoices] = useState<any[]>([]);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [text, setText] = useState("");
  const [playingAudio, setPlayingAudio] = useState(false);
  const [loading, startLoading] = useTransition();
  const [voiceId, setVoiceId] = useState("");

  async function load() {
    const res = await fetch("https://api.elevenlabs.io/v1/voices");
    const data = await res.json();
    setVoices(data.voices);
    setVoiceId(data.voices[0].voice_id);
  }

  async function generate() {
    const res = await fetch("/api/audio", {
      method: "POST",
      body: JSON.stringify({
        text,
        voiceId,
      }),
    });
  }

  useEffect(() => {
    startLoading(() => load());
  }, []);

  useEffect(() => {
    if (audio) {
      setPlayingAudio(true);
      audio.play();
      audio.onended = () => {
        setPlayingAudio(false);
      };
    }
  }, [audio]);

  function togglePlay(audioUrl: string): void {
    const audio = new Audio(audioUrl);
    setAudio(audio);
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-24 gap-14">
      <div>
        <h1 className= "scroll-m-20 text-4xl  tracking-tight lg:text-6xl">Transforme <span className="text-[#7e22ce]"> texto</span> em <span className="text-[#4338ca]">voz</span></h1>
      </div>
      <Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Digite seu texto aqui..."/>
        <h2 className= "mt-8 scroll-m-20 text-2xl border-b pb-2  tracking-tight"><span className="text-[#7e22ce]">+15 </span>vozes para você escolher</h2>
      <Carousel
        className="w-full"
        opts={{
          align: "start",
        }}
      >
        <CarouselContent>
          {voices.map((voice: any) => (
            <CarouselItem key={voice.voice_id} className="lg:basis-1/6">
              <div className="p-1">
                <VoiceCard voice={voice} text={text} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </main>
  );
}
