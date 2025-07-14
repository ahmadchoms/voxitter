import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ImagePreview({ src, onRemove, fileName, fileSize, disabled }) {
    return (
        <div className="relative group">
            <img
                src={src}
                alt="Preview"
                className="w-full h-32 object-cover rounded-lg"
            />
            <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={onRemove}
                className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                disabled={disabled}
            >
                <X className="w-3 h-3" />
            </Button>
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-1 rounded-b-lg">
                <p className="text-xs truncate">
                    {fileName} ({fileSize} MB)
                </p>
            </div>
        </div>
    );
}