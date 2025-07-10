import { useCallback, useState } from "react";
import { useDebounce } from "use-debounce";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { motion } from "framer-motion";

export function SearchSheet({ open, onOpenChange }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedQuery] = useDebounce(searchQuery, 300);

    const handleClearSearch = useCallback(() => {
        setSearchQuery("");
    }, []);

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                side="left"
                className="bg-gray-950 border-gray-800 w-[90vw] sm:w-[400px] flex flex-col gap-4"
            >
                <SheetHeader>
                    <SheetTitle className="text-white text-xl font-semibold">
                        Pencarian
                    </SheetTitle>
                    <SheetDescription className="text-gray-400">
                        Temukan topik, orang, atau tag yang Anda cari
                    </SheetDescription>
                </SheetHeader>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="mt-4 px-3"
                >
                    <div className="relative">
                        <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"
                            aria-hidden="true"
                        />
                        <Input
                            type="text"
                            placeholder="Cari topik, orang, atau tag..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-10 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-lg py-6 transition-all duration-200"
                            aria-label="Kolom pencarian"
                        />
                        {searchQuery && (
                            <button
                                onClick={handleClearSearch}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                                aria-label="Hapus pencarian"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </motion.div>
                {debouncedQuery && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                        className="mt-4 text-gray-300"
                    >
                        Hasil pencarian untuk:{" "}
                        <span className="font-medium">{debouncedQuery}</span>
                    </motion.div>
                )}
            </SheetContent>
        </Sheet>
    );
}
