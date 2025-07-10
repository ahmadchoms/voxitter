import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { PenSquare } from "lucide-react";
import { PostForm } from "./post-form";

export function CreatePostDialog({
    open,
    onOpenChange,
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-gray-950 border-gray-800 text-white max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-white flex items-center gap-2">
                        <PenSquare className="w-5 h-5" />
                        Buat Konten Baru
                    </DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Bagikan pemikiran atau berita terbaru Anda
                    </DialogDescription>
                </DialogHeader>
                <PostForm onClose={() => onOpenChange(false)} />
            </DialogContent>
        </Dialog>
    );
}
