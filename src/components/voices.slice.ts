import { createSlice} from '@reduxjs/toolkit';

interface VoiceState {
    filterOptions: FilterOptions;
}

export interface FilterOptions {
    description: string[],
    gender: string[],
    accent: string[],
    age: string[],
    useCase: string[]
}


const initialState: VoiceState = {
    filterOptions: {
        description: [],
        gender: [],
        accent: [],
        age: [],
        useCase: []
    }
};


const voiceSlice = createSlice({
    name: 'voices',
    initialState,
    reducers: {
        setFilterOptions: (state, action) => {
            state.filterOptions = action.payload
        }
    }
});

export const { setFilterOptions } = voiceSlice.actions;
export default voiceSlice.reducer;
