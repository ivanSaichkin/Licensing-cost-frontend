import { createAsyncThunk } from '@reduxjs/toolkit';

import { api } from '@/shared/api';
import {
  getApiErrorMessage,
  isConflictError,
  isNotFoundError,
  isUnauthorizedError,
} from '@/shared/lib';
import { requestFinished, requestStarted } from '@/shared/model';

import { toLicensing, toLicensingList } from './adapters';
import { MOCK_LICENSINGS } from './mock';
import { filterByMaxCommission } from './selectors';
import type { Licensing } from './types';

export interface FetchLicensingsArgs {
  maxCommission: number;
  isGuest: boolean;
}

export interface FetchLicensingsResult {
  items: Licensing[];
  mockFallback: boolean;
}

export const fetchLicensings = createAsyncThunk<
  FetchLicensingsResult,
  FetchLicensingsArgs,
  { rejectValue: string }
>(
  'licensing/fetchLicensings',
  async ({ maxCommission, isGuest }, { dispatch, rejectWithValue }) => {
    dispatch(requestStarted());

    try {
      try {
        const response = await api.licensings.licensingsList(
          maxCommission > 0 ? { max_commission: maxCommission } : undefined,
        );

        return {
          items: toLicensingList(response.data),
          mockFallback: false,
        };
      } catch (error) {
        // Гость может работать без бэкенда: показываем mock-коллекцию.
        // Авторизованному пользователю ошибка API показывается как есть.
        if (isGuest) {
          return {
            items: filterByMaxCommission(MOCK_LICENSINGS, maxCommission),
            mockFallback: true,
          };
        }

        throw error;
      }
    } catch (error) {
      return rejectWithValue(
        getApiErrorMessage(error, 'Не удалось загрузить модели'),
      );
    } finally {
      dispatch(requestFinished());
    }
  },
);

export interface FetchFeedArgs {
  id?: number;
  isGuest: boolean;
}

export interface FetchFeedResult {
  feed: Licensing | null;
  nextFeed: Licensing | null;
  mockFallback: boolean;
}

const getMockFeed = (id?: number): FetchFeedResult => {
  const index =
    id === undefined
      ? 0
      : MOCK_LICENSINGS.findIndex((licensing) => licensing.id === id);

  if (index < 0 || index >= MOCK_LICENSINGS.length) {
    return { feed: null, nextFeed: null, mockFallback: true };
  }

  return {
    feed: MOCK_LICENSINGS[index],
    nextFeed: MOCK_LICENSINGS[index + 1] ?? null,
    mockFallback: true,
  };
};

/**
 * Лента загружается через отдельный feed-endpoint:
 * GET /api/licensing/feed?id=... — текущая модель,
 * GET /api/licensing/feed?id=...&next=true — следующая.
 *
 * В отличие от списка (GET /api/licensings), feed-сериализатор
 * содержит is_liked, поэтому состояние лайка сохраняется после F5.
 */
export const fetchFeed = createAsyncThunk<
  FetchFeedResult,
  FetchFeedArgs,
  { rejectValue: string }
>(
  'licensing/fetchFeed',
  async ({ id, isGuest }, { dispatch, rejectWithValue }) => {
    dispatch(requestStarted());

    try {
      let current: Licensing | undefined;

      try {
        const currentResponse = await api.licensing.feedList(
          id === undefined ? undefined : { id },
        );

        current = toLicensing(currentResponse.data);
      } catch (error) {
        if (isNotFoundError(error)) {
          return { feed: null, nextFeed: null, mockFallback: false };
        }

        // Гость может работать без бэкенда; авторизованному показываем ошибку.
        if (isGuest) {
          return getMockFeed(id);
        }

        return rejectWithValue(
          getApiErrorMessage(error, 'Не удалось загрузить ленту'),
        );
      }

      if (!current) {
        return { feed: null, nextFeed: null, mockFallback: false };
      }

      let nextFeed: Licensing | null = null;

      try {
        const nextResponse = await api.licensing.feedList({
          id: current.id,
          next: true,
        });

        nextFeed = toLicensing(nextResponse.data);
      } catch {
        // 404 — последняя модель; другие ошибки следующей карточки
        // не должны ломать уже загруженную текущую.
        nextFeed = null;
      }

      return { feed: current, nextFeed, mockFallback: false };
    } finally {
      dispatch(requestFinished());
    }
  },
);

export const fetchDraft = createAsyncThunk<
  Licensing | null,
  void,
  { rejectValue: string }
>('licensing/fetchDraft', async (_, { dispatch, rejectWithValue }) => {
  dispatch(requestStarted());

  try {
    const response = await api.licensings.draftList();
    return toLicensing(response.data);
  } catch (error) {
    if (isNotFoundError(error)) {
      return null;
    }

    if (isUnauthorizedError(error)) {
      return rejectWithValue('Сессия истекла, войдите заново');
    }

    return rejectWithValue(
      getApiErrorMessage(error, 'Не удалось загрузить черновик'),
    );
  } finally {
    dispatch(requestFinished());
  }
});

export interface CreateDraftArgs {
  title: string;
  description: string;
  image: File;
  video: File;
}

export const createDraft = createAsyncThunk<
  Licensing,
  CreateDraftArgs,
  { rejectValue: string }
>('licensing/createDraft', async (args, { dispatch, rejectWithValue }) => {
  dispatch(requestStarted());

  try {
    const response = await api.licensings.licensingsCreate({
      title: args.title,
      description: args.description,
      image: args.image,
      video: args.video,
    });

    return toLicensing(response.data);
  } catch (error) {
    if (isConflictError(error)) {
      return rejectWithValue(
        'Черновик уже существует. Загрузите страницу, чтобы продолжить его редактирование.',
      );
    }

    if (isUnauthorizedError(error)) {
      return rejectWithValue('Сессия истекла, войдите заново');
    }

    return rejectWithValue(
      getApiErrorMessage(error, 'Не удалось создать черновик'),
    );
  } finally {
    dispatch(requestFinished());
  }
});

export interface PublishDraftArgs {
  id: number;
  description: string;
  commission: number;
  minForCalc: number;
}

export const publishDraft = createAsyncThunk<
  Licensing,
  PublishDraftArgs,
  { rejectValue: string }
>('licensing/publishDraft', async (args, { dispatch, rejectWithValue }) => {
  dispatch(requestStarted());

  try {
    const response = await api.licensings.publishUpdate(args.id, {
      description: args.description,
      commission_per_unit: args.commission,
      min_for_calc: args.minForCalc,
    });

    return toLicensing(response.data);
  } catch (error) {
    if (isUnauthorizedError(error)) {
      return rejectWithValue('Сессия истекла, войдите заново');
    }

    return rejectWithValue(
      getApiErrorMessage(error, 'Не удалось опубликовать модель'),
    );
  } finally {
    dispatch(requestFinished());
  }
});

export interface ToggleLikeArgs {
  id: number;
  like: boolean;
}

export const toggleLike = createAsyncThunk<
  Licensing,
  ToggleLikeArgs,
  { rejectValue: string }
>('licensing/toggleLike', async ({ id, like }, { dispatch, rejectWithValue }) => {
  dispatch(requestStarted());

  try {
    const response = await api.licensings.likeCreate(id, {
      like: like ? 1 : 0,
    });

    return toLicensing(response.data);
  } catch (error) {
    if (isUnauthorizedError(error)) {
      return rejectWithValue('Войдите, чтобы ставить лайки');
    }

    return rejectWithValue(
      getApiErrorMessage(error, 'Не удалось поставить лайк'),
    );
  } finally {
    dispatch(requestFinished());
  }
});

export const deleteLicensing = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>('licensing/deleteLicensing', async (id, { dispatch, rejectWithValue }) => {
  dispatch(requestStarted());

  try {
    await api.licensings.licensingsDelete(id);
    return id;
  } catch (error) {
    if (isUnauthorizedError(error)) {
      return rejectWithValue('Войдите, чтобы удалять модели');
    }

    return rejectWithValue(
      getApiErrorMessage(error, 'Не удалось удалить модель'),
    );
  } finally {
    dispatch(requestFinished());
  }
});
