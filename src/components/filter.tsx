import * as React from "react"
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useSelector } from "react-redux"
import { FilterOptions, setFilterOptions } from "./voices.slice"
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
            <div className="p-1" key={key} >

              <Select >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={key} />
                </SelectTrigger>
                <SelectContent>
                  {value.map((item: any, index: any) => (
                    <label className="relative flex items-center p-1 rounded-full cursor-pointer" key={item}>
                      <input
                        className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-indigo-500 checked:bg-indigo-500 checked:before:bg-indigo-500 hover:before:opacity-10" type="checkbox"
                        id="indigo"
                        value={item}
                        checked={filter[key as FilterCategory]?.includes(item) || false}
                        onChange={(e) => handleCheckboxChange(e, key as keyof FilterOptions)}
                      />
                      <span className="ml-2">

                        {item}
                      </span>
                    </label>
                  ))}
                </SelectContent>
              </Select >
            </div>
          )
        ))
      }

    </div>
  )
}
