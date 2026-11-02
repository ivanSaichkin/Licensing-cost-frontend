import type { ChangeEvent, FC, FormEvent } from 'react';
import { useState } from 'react';
import { Button } from 'react-bootstrap';

import './AddPage.css';

interface MediaOption {
  id: string;
  imageUrl: string;
  videoUrl: string;
}

const MEDIA_OPTIONS: MediaOption[] = [
  {
    id: 'per_user',
    imageUrl: '/media/licensing/per_user.jpg',
    videoUrl: '/media/licensing/per_user.mp4',
  },
  {
    id: 'per_core',
    imageUrl: '/media/licensing/per_core.jpg',
    videoUrl: '/media/licensing/per_core.mp4',
  },
  {
    id: 'subscription',
    imageUrl: '/media/licensing/subscription.jpg',
    videoUrl: '/media/licensing/subscription.mp4',
  },
  {
    id: 'enterprise',
    imageUrl: '/media/licensing/enterprise.jpg',
    videoUrl: '/media/licensing/enterprise.mp4',
  },
  {
    id: 'concurrent',
    imageUrl: '/media/licensing/concurrent.jpg',
    videoUrl: '/media/licensing/concurrent.mp4',
  },
];

interface AddFormValues {
  title: string;
  description: string;
  commission: string;
  minForCalc: string;
  imageUrl: string;
  videoUrl: string;
}

type TextField = 'title' | 'description' | 'commission' | 'minForCalc';

const INITIAL_VALUES: AddFormValues = {
  title: 'Новая модель',
  description: 'Описание модели лицензирования',
  commission: '100',
  minForCalc: '1',
  imageUrl: MEDIA_OPTIONS[0].imageUrl,
  videoUrl: MEDIA_OPTIONS[0].videoUrl,
};

/**
 * «Добавление» — форма новой модели лицензирования по дизайну
 * templates/addLicensing.html из предыдущих лабораторных.
 *
 * В лабораторной 5 страница работает в mock-режиме: медиа выбираются
 * из файлов проекта, после «Далее» показывается превью черновика.
 * Отправка в веб-сервис будет подключена в лабораторной 6.
 */
export const AddPage: FC = () => {
  const [values, setValues] = useState<AddFormValues>(INITIAL_VALUES);
  const [isDraftReady, setIsDraftReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const updateField =
    (field: TextField) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value } = event.currentTarget;

      setValues((current) => ({ ...current, [field]: value }));
      setError(null);
      setNotice(null);
    };

  const selectImage = (imageUrl: string) => {
    setValues((current) => ({ ...current, imageUrl }));
    setError(null);
  };

  const selectVideo = (videoUrl: string) => {
    setValues((current) => ({ ...current, videoUrl }));
    setError(null);
  };

  const handleNext = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!values.title.trim()) {
      setError('Укажите название модели');
      return;
    }

    if (!values.description.trim()) {
      setError('Добавьте описание модели');
      return;
    }

    const commission = Number(values.commission);

    if (!Number.isFinite(commission) || commission < 0) {
      setError('Комиссия должна быть неотрицательным числом');
      return;
    }

    const minForCalc = Number(values.minForCalc);

    if (!Number.isInteger(minForCalc) || minForCalc < 1) {
      setError('Минимальное число для расчёта должно быть целым и больше нуля');
      return;
    }

    setIsDraftReady(true);
    setError(null);
    setNotice(
      'Черновик создан. Отправку модели в веб-сервис подключим в лабораторной 6.',
    );
  };

  const handlePublish = () => {
    setNotice(
      'Модель готова к публикации. Отправку в веб-сервис подключим в лабораторной 6.',
    );
  };

  return (
    <main className="addPage">
      <h1 className="addPageTitle">Новая модель лицензирования</h1>

      <form className="addForm" onSubmit={handleNext}>
        {isDraftReady ? (
          <>
            <div className="addMediaPicker addMediaPickerStatic">
              <div className="addMediaSummary">
                <img
                  className="addSummaryPreview"
                  src={values.imageUrl}
                  alt="Изображение модели"
                />
                <div className="addSummaryRow">
                  <span className="addMediaLabel">Изображение</span>
                </div>
              </div>
            </div>

            <div className="addMediaPicker addMediaPickerStatic">
              <div className="addMediaSummary">
                <video
                  className="addSummaryPreview"
                  src={values.videoUrl}
                  muted
                  playsInline
                  preload="metadata"
                />
                <div className="addSummaryRow">
                  <span className="addMediaLabel">Видео</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <details className="addMediaPicker">
              <summary className="addMediaSummary">
                <img
                  className="addSummaryPreview"
                  src={values.imageUrl}
                  alt="Выбранное изображение"
                />
                <div className="addSummaryRow">
                  <span className="addMediaLabel">Изображение</span>
                  <span className="addMediaHint">Выбрать ▾</span>
                </div>
              </summary>

              <div className="addMediaList">
                {MEDIA_OPTIONS.map((option) => (
                  <label className="addMediaOption" key={option.id}>
                    <input
                      type="radio"
                      name="imageUrl"
                      checked={values.imageUrl === option.imageUrl}
                      onChange={() => selectImage(option.imageUrl)}
                    />
                    <img src={option.imageUrl} alt="" />
                    <span>{option.id}.jpg</span>
                  </label>
                ))}
              </div>
            </details>

            <details className="addMediaPicker">
              <summary className="addMediaSummary">
                <video
                  className="addSummaryPreview"
                  src={values.videoUrl}
                  muted
                  playsInline
                  preload="metadata"
                />
                <div className="addSummaryRow">
                  <span className="addMediaLabel">Видео</span>
                  <span className="addMediaHint">Выбрать ▾</span>
                </div>
              </summary>

              <div className="addMediaList">
                {MEDIA_OPTIONS.map((option) => (
                  <label className="addMediaOption" key={option.id}>
                    <input
                      type="radio"
                      name="videoUrl"
                      checked={values.videoUrl === option.videoUrl}
                      onChange={() => selectVideo(option.videoUrl)}
                    />
                    <video
                      src={option.videoUrl}
                      muted
                      playsInline
                      preload="metadata"
                    />
                    <span>{option.id}.mp4</span>
                  </label>
                ))}
              </div>
            </details>
          </>
        )}

        <div className="addFields">
          <label className="addField">
            <span className="addFieldLabel">Название</span>
            <input
              className="addInput"
              type="text"
              value={values.title}
              onChange={updateField('title')}
            />
          </label>

          <label className="addField">
            <span className="addFieldLabel">Описание</span>
            <textarea
              className="addInput addTextarea"
              value={values.description}
              onChange={updateField('description')}
            />
          </label>

          <label className="addField">
            <span className="addFieldLabel">Комиссия за 1 ед.</span>
            <input
              className="addInput"
              type="number"
              min="0"
              step="1"
              value={values.commission}
              onChange={updateField('commission')}
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
              value={values.minForCalc}
              onChange={updateField('minForCalc')}
            />
          </label>
        </div>

        {error ? (
          <div className="addError" role="alert">
            {error}
          </div>
        ) : null}

        {notice ? (
          <div className="addNotice" role="status">
            {notice}
          </div>
        ) : null}

        {isDraftReady ? (
          <Button
            type="button"
            className="addCta"
            onClick={handlePublish}
          >
            Опубликовать
          </Button>
        ) : (
          <Button type="submit" className="addCta">
            Далее
          </Button>
        )}
      </form>
    </main>
  );
};
