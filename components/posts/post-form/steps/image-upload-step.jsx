import { AnimatedSection } from "@/components/fragments/animated-section";
import { Label } from "@/components/ui/label";
import { UploadDropzone } from "../upload-dropzone";
import { ImagePreview } from "../image-preview";
import { HelperText } from "@/components/fragments/helper-text";

export function ImageUploadStep({ onImageUpload, imagePreviews, imageFiles, onRemoveImage, errors, isSubmitting }) {
    return (
        <AnimatedSection delay={0.2}>
            <Label className="text-gray-300">Upload Gambar (Opsional)</Label>
            <UploadDropzone onChange={onImageUpload} disabled={isSubmitting} />
            {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                    {imagePreviews.map((src, index) => (
                        <ImagePreview
                            key={index}
                            src={src}
                            onRemove={() => onRemoveImage(index)}
                            fileName={imageFiles?.[index]?.name}
                            fileSize={imageFiles?.[index] ? (imageFiles[index].size / 1024 / 1024).toFixed(2) : ""}
                            disabled={isSubmitting}
                        />
                    ))}
                </div>
            )}
            <HelperText error={errors.image_files?.message} />
        </AnimatedSection>
    );
}