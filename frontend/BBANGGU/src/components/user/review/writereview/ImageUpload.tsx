import { Camera } from 'lucide-react';
import { useRef } from 'react';

interface ImageUploadProps {
  images: File[];
  onImagesChange: (images: File[]) => void;
}

export function ImageUpload({ images, onImagesChange }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      onImagesChange([...images, ...newImages].slice(0, 5));
    }
  };

  const removeImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {images.map((image, index) => (
          <div key={index} className="relative w-20 h-20">
            <img
              src={URL.createObjectURL(image)}
              alt={`Preview ${index}`}
              className="w-full h-full object-cover rounded-xl"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute -top-2 -right-2 bg-gray-800 rounded-full w-5 h-5 flex items-center justify-center text-white text-sm"
            >
              ×
            </button>
          </div>
        ))}
        {images.length < 5 && (
          <label 
            className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center cursor-pointer"
          >
            <Camera className="w-6 h-6 text-gray-400" />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              multiple
              className="hidden"
            />
          </label>
        )}
      </div>
      <p className="text-sm text-gray-500">
        최대 5장까지 업로드 가능합니다
      </p>
    </div>
  );
} 