import { createSlice} from '@reduxjs/toolkit';

interface VoiceState {
    filterOptions: FilterOptions;
    filtered: boolean;
}

export interface FilterOptions {
    description: string[],
    gender: string[],
    accent: string[],
    age: string[],
    use_case: string[]
}


const initialState: VoiceState = {
    filterOptions: {
        description: [],
        gender: [],
        accent: [],
        age: [],
        use_case: []
    },
    filtered: false
};


const voiceSlice = createSlice({
    name: 'voices',
    initialState,
    reducers: {
        setFilterOptions: (state, action) => {
            state.filterOptions = action.payload;
            state.filtered = true
        },
        setFiltered: (state, action) => {
            state.filtered = action.payload
        }
    }
});

export const { setFilterOptions, setFiltered } = voiceSlice.actions;
export default voiceSlice.reducer;
