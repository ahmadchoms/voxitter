import { MAX_FILE_SIZE, MAX_IMAGES } from "@/lib/constants/post";
import { Upload } from "lucide-react";

export function UploadDropzone({ onChange, disabled }) {
    return (
        <label htmlFor="image-upload" className={`cursor-pointer ${disabled ? 'opacity-50' : ''}`}>
            <div className="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center hover:border-gray-600 transition-colors">
                <input
                    type="file"
                    accept="image/*"
                    id="image-upload"
                    multiple
                    onChange={onChange}
                    className="hidden"
                    disabled={disabled}
                />
                <div className="flex flex-col items-center gap-2">
                    <Upload className="w-6 h-6 text-gray-400" />
                    <p className="text-sm text-gray-400">
                        Klik untuk upload hingga {MAX_IMAGES} gambar
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF hingga {MAX_FILE_SIZE}MB</p>
                </div>
            </div>
        </label>
    );
}