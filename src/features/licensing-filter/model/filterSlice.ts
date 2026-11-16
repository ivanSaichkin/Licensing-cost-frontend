import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { DEFAULT_MAX_COMMISSION } from './constants';

export interface FilterState {
  maxCommission: number;
  appliedMaxCommission: number;
}

const initialState: FilterState = {
  maxCommission: DEFAULT_MAX_COMMISSION,
  appliedMaxCommission: DEFAULT_MAX_COMMISSION,
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setMaxCommission(state, action: PayloadAction<number>) {
      state.maxCommission = action.payload;
    },
    applyFilter(state) {
      state.appliedMaxCommission = state.maxCommission;
    },
    resetFilter(state) {
      state.maxCommission = DEFAULT_MAX_COMMISSION;
      state.appliedMaxCommission = DEFAULT_MAX_COMMISSION;
    },
  },
});

export const { setMaxCommission, applyFilter, resetFilter } =
  filterSlice.actions;

export default filterSlice.reducer;
