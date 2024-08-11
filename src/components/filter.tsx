import * as React from "react"
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useSelector } from "react-redux"
import {FilterOptions, setFilterOptions } from "./voices.slice"
import { useDispatch } from "react-redux"
import { AppDispatch, RootState } from "@/app/store"
export type FilterCategory = keyof FilterOptions;

type VoiceOptions = {
  [key: string]: string[];
};

export function Filter({ voiceOptions }: { voiceOptions: VoiceOptions }) {

  const dispatch = useDispatch<AppDispatch>();

  const filter = useSelector((state: RootState) => state.voice.filterOptions);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, category: keyof FilterOptions) => {
    const value = event.target.value;
    const checked = event.target.checked;

    dispatch(setFilterOptions({
      ...filter,
      [category]: checked
        ? [...filter[category], value]
        : filter[category].filter(option => option !== value)
    }));
  };


  return (
    <div className="flex align-row w-full justify-between">
      {voiceOptions &&
        Object.entries(voiceOptions).map(([key, value]) => (
          value && (
            <Select key={key}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={key} />
              </SelectTrigger>
              <SelectContent>
                {value.map((item: any, index: any) => (
                  <label className="flex align-col" key={item}>
                    <input
                      type="checkbox"
                      value={item}
                      checked={filter[key as FilterCategory]?.includes(item) || false}
                      onChange={(e) => handleCheckboxChange(e, key as keyof FilterOptions)}
                    />
                    {item}
                  </label>
                ))}
              </SelectContent>
            </Select >
          )
        ))
      }

    </div>
  )
}
