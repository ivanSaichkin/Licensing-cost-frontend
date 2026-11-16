import type { ChangeEvent, FC, FormEvent } from 'react';
import { useEffect, useMemo, useReducer, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@/app/store';
import {
  clearLicensingError,
  createDraft,
  fetchDraft,
  publishDraft,
  type Licensing,
} from '@/entities/licensing';
import { buildLicensingRoute } from '@/shared/config';
import {
  DEFAULT_IMAGE_URL,
  DEFAULT_VIDEO_URL,
  resolveImageUrl,
  resolveVideoUrl,
} from '@/shared/lib';

import './AddPage.css';

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const VIDEO_TYPES = ['video/webm', 'video/mp4'];

interface AddFormState {
  title: string;
  description: string;
  commission: string;
  minForCalc: string;
}

type AddFormAction =
  | {
      type: 'loadDraft';
      draft: Licensing;
    }
  | {
      type: 'setField';
      field: keyof AddFormState;
      value: string;
    };

const INITIAL_FORM: AddFormState = {
  title: 'Новая модель',
  description: 'Описание модели лицензирования',
  commission: '100',
  minForCalc: '1',
};

const addFormReducer = (
  state: AddFormState,
  action: AddFormAction,
): AddFormState => {
  if (action.type === 'setField') {
    return { ...state, [action.field]: action.value };
  }

  return {
    ...state,
    title: action.draft.title,
    description: action.draft.description,
    commission:
      action.draft.commission_per_unit === null
        ? state.commission
        : String(action.draft.commission_per_unit),
    minForCalc:
      action.draft.min_for_calc === null
        ? state.minForCalc
        : String(action.draft.min_for_calc),
  };
};

const asNumber = (value: string): number => Number(value);

/**
 * «Добавление» — форма новой модели лицензирования.
 * Создание черновика и публикация идут через redux-thunk
 * и сгенерированный axios-клиент.
 */
export const AddPage: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { draft, error: requestError } = useAppSelector(
    (state) => state.licensing,
  );
  const isBusy = useAppSelector((state) => state.requests.pending > 0);

  const [form, dispatchForm] = useReducer(addFormReducer, INITIAL_FORM);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    void dispatch(fetchDraft());
  }, [dispatch]);

  useEffect(() => {
    if (draft) {
      dispatchForm({ type: 'loadDraft', draft });
    }
  }, [draft]);

  const imageObjectUrl = useMemo(
    () => (imageFile ? URL.createObjectURL(imageFile) : null),
    [imageFile],
  );
  const videoObjectUrl = useMemo(
    () => (videoFile ? URL.createObjectURL(videoFile) : null),
    [videoFile],
  );

  useEffect(() => {
    if (!imageObjectUrl) {
      return;
    }

    return () => URL.revokeObjectURL(imageObjectUrl);
  }, [imageObjectUrl]);

  useEffect(() => {
    if (!videoObjectUrl) {
      return;
    }

    return () => URL.revokeObjectURL(videoObjectUrl);
  }, [videoObjectUrl]);

  const imagePreview =
    imageObjectUrl ??
    (draft?.image_url ? resolveImageUrl(draft.image_url) : DEFAULT_IMAGE_URL);
  const videoPreview =
    videoObjectUrl ??
    (draft?.video_url ? resolveVideoUrl(draft.video_url) : DEFAULT_VIDEO_URL);

  const clearErrors = () => {
    setFormError(null);
    dispatch(clearLicensingError());
  };

  const handleTextField =
    (field: keyof AddFormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      dispatchForm({
        type: 'setField',
        field,
        value: event.currentTarget.value,
      });
      clearErrors();
    };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0] ?? null;

    if (file && !IMAGE_TYPES.includes(file.type)) {
      setFormError('Изображение: допустимы JPEG, PNG или WebP');
      return;
    }

    setImageFile(file);
    clearErrors();
  };

  const handleVideoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0] ?? null;

    if (file && !VIDEO_TYPES.includes(file.type)) {
      setFormError('Видео: допустимы WebM или MP4');
      return;
    }

    setVideoFile(file);
    clearErrors();
  };

  const validateFields = (): boolean => {
    if (!form.title.trim()) {
      setFormError('Укажите название модели');
      return false;
    }

    if (!form.description.trim()) {
      setFormError('Добавьте описание модели');
      return false;
    }

    const commissionValue = asNumber(form.commission);

    if (!Number.isFinite(commissionValue) || commissionValue < 0) {
      setFormError('Комиссия должна быть неотрицательным числом');
      return false;
    }

    const minValue = asNumber(form.minForCalc);

    if (!Number.isInteger(minValue) || minValue < 1) {
      setFormError('Минимальное число для расчёта должно быть целым и больше нуля');
      return false;
    }

    return true;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateFields()) {
      return;
    }

    if (!draft) {
      if (!imageFile) {
        setFormError('Выберите изображение');
        return;
      }

      if (!videoFile) {
        setFormError('Выберите видео');
        return;
      }

      try {
        await dispatch(
          createDraft({
            title: form.title.trim(),
            description: form.description.trim(),
            image: imageFile,
            video: videoFile,
          }),
        ).unwrap();
      } catch (submitError) {
        setFormError(String(submitError));
      }

      return;
    }

    try {
      const published = await dispatch(
        publishDraft({
          id: draft.id,
          description: form.description.trim(),
          commission: asNumber(form.commission),
          minForCalc: asNumber(form.minForCalc),
        }),
      ).unwrap();

      navigate(buildLicensingRoute(published.id), { replace: true });
    } catch (submitError) {
      setFormError(String(submitError));
    }
  };

  const errorMessage = formError ?? requestError;

  return (
    <main className="addPage">
      <h1 className="addPageTitle">
        {draft ? 'Черновик модели' : 'Новая модель лицензирования'}
      </h1>

      <form className="addForm" onSubmit={handleSubmit}>
        <div className="addMediaPicker addMediaPickerStatic">
          <div className="addMediaSummary">
            <img
              className="addSummaryPreview"
              src={imagePreview}
              alt="Изображение модели"
            />
            <div className="addSummaryRow">
              <span className="addMediaLabel">Изображение</span>
              {!draft ? (
                <label className="addFileLabel">
                  {imageFile ? 'Заменить' : 'Выбрать'} ▾
                  <input
                    className="addFileInput"
                    type="file"
                    accept={IMAGE_TYPES.join(',')}
                    onChange={handleImageChange}
                  />
                </label>
              ) : null}
            </div>
          </div>
        </div>

        <div className="addMediaPicker addMediaPickerStatic">
          <div className="addMediaSummary">
            <video
              className="addSummaryPreview"
              src={videoPreview}
              muted
              playsInline
              preload="metadata"
            />
            <div className="addSummaryRow">
              <span className="addMediaLabel">Видео</span>
              {!draft ? (
                <label className="addFileLabel">
                  {videoFile ? 'Заменить' : 'Выбрать'} ▾
                  <input
                    className="addFileInput"
                    type="file"
                    accept={VIDEO_TYPES.join(',')}
                    onChange={handleVideoChange}
                  />
                </label>
              ) : null}
            </div>
          </div>
        </div>

        <div className="addFields">
          <label className="addField">
            <span className="addFieldLabel">Название</span>
            <input
              className="addInput"
              type="text"
              value={form.title}
              disabled={Boolean(draft)}
              onChange={handleTextField('title')}
            />
          </label>

          <label className="addField">
            <span className="addFieldLabel">Описание</span>
            <textarea
              className="addInput addTextarea"
              value={form.description}
              onChange={handleTextField('description')}
            />
          </label>

          <label className="addField">
            <span className="addFieldLabel">Комиссия за 1 ед.</span>
            <input
              className="addInput"
              type="number"
              min="0"
              step="1"
              value={form.commission}
              onChange={handleTextField('commission')}
            />
          </label>

          <label className="addField">
            <span className="addFieldLabel">
              Минимальное число для расчёта
            </span>
            <input
              className="addInput"
              type="number"
              min="1"
              step="1"
              value={form.minForCalc}
              onChange={handleTextField('minForCalc')}
            />
          </label>
        </div>

        {errorMessage ? (
          <div className="addError" role="alert">
            {errorMessage}
          </div>
        ) : null}

        {draft ? (
          <div className="addNotice" role="status">
            Черновик создан. После публикации модель появится в ленте и плите.
          </div>
        ) : null}

        <Button type="submit" className="addCta" disabled={isBusy}>
          {draft ? 'Опубликовать' : 'Далее'}
        </Button>
      </form>
    </main>
  );
};
