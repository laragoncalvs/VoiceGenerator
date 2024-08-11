"use client";

import { Filter } from "@/components/filter";
import { Textarea } from "@/components/ui/textarea";
import { VoiceCard } from "@/components/voice-card";

import React, { useEffect, useState, useTransition } from "react";
import { Provider } from "react-redux";
import { RootState, store } from "./store";
import { useSelector } from "react-redux";
import { setFiltered } from "@/components/voices.slice";


type FilterOptions = {
    description: string[];
    gender: string[];
    accent: string[];
    age: string[];
    use_case: string[];
};

export default function VoiceList() {
    const [generating, startGenerating] = useTransition();
    const [voices, setVoices] = useState<any[]>([]);
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
    const [text, setText] = useState("");
    const [playingAudio, setPlayingAudio] = useState(false);
    const [loading, startLoading] = useTransition();
    const [voiceId, setVoiceId] = useState("");
    const [filterOptions, setFilterOptions] = useState<FilterOptions>({
        description: [],
        gender: [],
        accent: [],
        age: [],
        use_case: []
    });
    async function load() {
        const res = await fetch("https://api.elevenlabs.io/v1/voices");
        const data = await res.json();
        setVoices(data.voices);
        setVoiceId(data.voices[0].voice_id);
        setFiltered(false);
    }

    const filter = useSelector((state: RootState) => state.voice.filterOptions);

    React.useEffect(() => { console.log('filter', filter) }, [filter])


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

    useEffect(() => {
        const options = voices.reduce<FilterOptions>(
            (acc, voice) => {
                acc.description = Array.from(new Set([...acc.description, voice.labels.description]));
                acc.gender = Array.from(new Set([...acc.gender, voice.labels.gender]));
                acc.accent = Array.from(new Set([...acc.accent, voice.labels.accent]));
                acc.age = Array.from(new Set([...acc.age, voice.labels.age]));
                acc.use_case = Array.from(new Set([...acc.use_case, voice.labels.use_case]));
                return acc;
            },
            {
                description: [],
                gender: [],
                accent: [],
                age: [],
                use_case: []
            }
        );
        setFilterOptions(options);
    }, [voices]);

    console.log(filterOptions)

    function togglePlay(audioUrl: string): void {
        const audio = new Audio(audioUrl);
        setAudio(audio);
    }

    const filterVoices = (voices: any[], filter: FilterOptions) => {
        return voices.filter(voice =>
            (filter.description.length === 0 || filter.description.includes(voice.labels.description)) &&
            (filter.gender.length === 0 || filter.gender.includes(voice.labels.gender)) &&
            (filter.accent.length === 0 || filter.accent.includes(voice.labels.accent)) &&
            (filter.age.length === 0 || filter.age.includes(voice.labels.age)) &&
            (filter.use_case.length === 0 || filter.use_case.includes(voice.labels.use_case))
        );
    };

    const filteredVoices = filterVoices(voices, filter);

    return (
        <Provider store={store}>
            <main className="flex min-h-screen flex-col items-center p-24 gap-14 overflow-hidden ">
                <div>
                    <h1 className="scroll-m-20 text-4xl  tracking-tight lg:text-6xl">Transforme <span className="text-[#7e22ce]"> texto</span> em <span className="text-[#4338ca]">voz</span></h1>
                </div>
                <Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Digite seu texto aqui..." />
                <h2 className="mt-8 scroll-m-20 text-2xl border-b pb-2  tracking-tight"><span className="text-[#7e22ce]">+15 </span>vozes para você escolher</h2>
                <div className="flex align-row items-center">

                <span className="mr-5 font-bold">Filtros:</span>
                <Filter voiceOptions={filterOptions}/>
                </div>
                <div className="flex flex-col items-center gap-3 ">

                    {filteredVoices.map((voice: any) => (
                        <ul key={voice.voice_id} className="lg:basis-1/6 w-screen  flex flex-col items-center ">
                            <li className="w-3/4 ">
                                <VoiceCard voice={voice} text={text} />
                            </li>
                        </ul>
                    ))}

                </div>
            </main>
        </Provider>
    );
}
