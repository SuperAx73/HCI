import { useId, useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../lib/firebase';

const MAX_PHOTOS = 6;

interface ImagePickerProps {
  uid: string;
  value: string[];
  onChange: (urls: string[]) => void;
  label?: string;
}

/** Lets a provider pick work photos for a listing; uploads straight to Storage and reports back the public URLs. */
export function ImagePicker({ uid, value, onChange, label = 'Fotos de tu trabajo' }: ImagePickerProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputId = useId();

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError('');
    const remaining = MAX_PHOTOS - value.length;
    if (remaining <= 0) {
      setError(`Máximo ${MAX_PHOTOS} fotos por publicación.`);
      return;
    }

    setUploading(true);
    try {
      const toUpload = Array.from(files).slice(0, remaining);
      const urls = await Promise.all(
        toUpload.map(async (file) => {
          const path = `listings/${uid}/${Date.now()}-${file.name}`;
          const storageRef = ref(storage, path);
          await uploadBytes(storageRef, file);
          return getDownloadURL(storageRef);
        }),
      );
      onChange([...value, ...urls]);
    } catch {
      setError('No se pudieron subir una o más fotos. Intenta de nuevo.');
    } finally {
      setUploading(false);
    }
  }

  function removeAt(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div className="image-picker">
      <label htmlFor={inputId}>{label}</label>
      <div className="image-picker-grid">
        {value.map((url, i) => (
          <div key={url} className="image-picker-thumb">
            <img src={url} alt="" />
            <button type="button" className="image-picker-remove" aria-label="Quitar foto" onClick={() => removeAt(i)}>
              ×
            </button>
          </div>
        ))}
        {value.length < MAX_PHOTOS && (
          <label htmlFor={inputId} className="image-picker-add">
            {uploading ? 'Subiendo…' : '+ Agregar'}
          </label>
        )}
      </div>
      <input
        id={inputId}
        type="file"
        accept="image/*"
        multiple
        className="visually-hidden"
        disabled={uploading}
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = '';
        }}
      />
      <p className="text-field-hint">Hasta {MAX_PHOTOS} fotos. Se suben al elegirlas.</p>
      {error && (
        <p role="alert" className="text-field-error">
          {error}
        </p>
      )}
    </div>
  );
}
