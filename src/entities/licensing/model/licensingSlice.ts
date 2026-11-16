import { createSlice } from '@reduxjs/toolkit';

import type { Licensing } from './types';
import {
  createDraft,
  deleteLicensing,
  fetchDraft,
  fetchFeed,
  fetchLicensings,
  publishDraft,
  toggleLike,
} from './licensingThunks';

export interface LicensingState {
  items: Licensing[];
  feed: Licensing | null;
  nextFeed: Licensing | null;
  draft: Licensing | null;
  isLoading: boolean;
  error: string | null;
  mockFallback: boolean;
}

const initialState: LicensingState = {
  items: [],
  feed: null,
  nextFeed: null,
  draft: null,
  isLoading: false,
  error: null,
  mockFallback: false,
};

const licensingSlice = createSlice({
  name: 'licensing',
  initialState,
  reducers: {
    clearLicensing(state) {
      state.items = [];
      state.feed = null;
      state.nextFeed = null;
      state.draft = null;
      state.isLoading = false;
      state.error = null;
      state.mockFallback = false;
    },
    clearLicensingError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLicensings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.mockFallback = false;
      })
      .addCase(fetchLicensings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items;
        state.mockFallback = action.payload.mockFallback;
      })
      .addCase(fetchLicensings.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload ?? 'Не удалось загрузить модели';
      })

      .addCase(fetchFeed.pending, (state) => {
        state.isLoading = true;
        state.feed = null;
        state.nextFeed = null;
        state.error = null;
        state.mockFallback = false;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.isLoading = false;
        state.feed = action.payload.feed;
        state.nextFeed = action.payload.nextFeed;
        state.mockFallback = action.payload.mockFallback;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.feed = null;
        state.nextFeed = null;
        state.mockFallback = false;
        state.error = action.payload ?? 'Не удалось загрузить ленту';
      })

      .addCase(fetchDraft.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDraft.fulfilled, (state, action) => {
        state.isLoading = false;
        state.draft = action.payload;
      })
      .addCase(fetchDraft.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Не удалось загрузить черновик';
      })

      .addCase(createDraft.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createDraft.fulfilled, (state, action) => {
        state.isLoading = false;
        state.draft = action.payload;
      })
      .addCase(createDraft.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Не удалось создать черновик';
      })

      .addCase(publishDraft.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(publishDraft.fulfilled, (state, action) => {
        state.isLoading = false;
        state.draft = null;
        state.items = state.items.filter(
          (item) => item.id !== action.payload.id,
        );
        state.items.push(action.payload);
      })
      .addCase(publishDraft.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Не удалось опубликовать модель';
      })

      .addCase(toggleLike.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
        state.isLoading = false;

        const updateLike = (licensing: Licensing | null) => {
          if (licensing?.id === action.payload.id) {
            licensing.likes_count = action.payload.likes_count;
            licensing.is_liked = action.payload.is_liked;
          }
        };

        const item = state.items.find(
          (licensing) => licensing.id === action.payload.id,
        );

        if (item) {
          item.likes_count = action.payload.likes_count;
          item.is_liked = action.payload.is_liked;
        }

        updateLike(state.feed);
        updateLike(state.nextFeed);
      })
      .addCase(toggleLike.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Не удалось поставить лайк';
      })

      .addCase(deleteLicensing.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteLicensing.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.filter(
          (item) => item.id !== action.payload,
        );

        if (state.draft?.id === action.payload) {
          state.draft = null;
        }
      })
      .addCase(deleteLicensing.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Не удалось удалить модель';
      });
  },
});

export const { clearLicensing, clearLicensingError } = licensingSlice.actions;
export default licensingSlice.reducer;
