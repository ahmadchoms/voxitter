import { useCallback, useState, useEffect } from "react";
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
import Link from "next/link";

function UserResultList({ users }) {
    if (!users || users.length === 0) {
        return (
            <p className="text-gray-500 text-center mt-4">Tidak ada pengguna yang ditemukan.</p>
        );
    }

    return (
        <div className="mt-4 space-y-2">
            {users.map((user) => (
                <Link
                    key={user.id}
                    href={`/${user.username}`}
                    className="p-3 bg-gray-800 rounded-md flex items-center gap-3 hover:bg-gray-700 transition-colors cursor-pointer"
                >
                    {user.avatar_url ? (
                        <img
                            src={user.avatar_url}
                            alt={user.username}
                            className="w-8 h-8 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {user.username ? user.username.charAt(0).toUpperCase() : '?'}
                        </div>
                    )}
                    <div>
                        <p className="text-white font-semibold">{user.username}</p>
                        {user.full_name && (
                            <p className="text-gray-400 text-sm">{user.full_name}</p>
                        )}
                    </div>
                </Link>
            ))}
        </div>
    );
}

export function SearchSheet({ open, onOpenChange }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedQuery] = useDebounce(searchQuery, 300);
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleClearSearch = useCallback(() => {
        setSearchQuery("");
        setSearchResults([]);
        setError(null);
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            if (debouncedQuery.trim() === "") {
                setSearchResults([]);
                setError(null);
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`/api/users?search=${encodeURIComponent(debouncedQuery)}&limit=25&offset=0`);

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Gagal mengambil data pengguna.');
                }

                const data = await response.json();
                setSearchResults(data);
            } catch (err) {
                console.error("Client-side user search error:", err);
                setError(err.message);
                setSearchResults([]);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [debouncedQuery]);

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
                            placeholder="Cari orang..."
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
                <div className="flex-grow overflow-y-auto px-3 pb-4">
                    {loading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.2 }}
                            className="mt-4 text-gray-300 text-center"
                        >
                            Mencari...
                        </motion.div>
                    )}
                    {error && !loading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.2 }}
                            className="mt-4 text-red-500 text-center"
                        >
                            Error: {error}
                        </motion.div>
                    )}
                    {!loading && !error && debouncedQuery && searchResults.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.2 }}
                            className="mt-4 text-gray-300"
                        >
                            Hasil pencarian untuk:{" "}
                            <span className="font-medium">{debouncedQuery}</span>
                            <UserResultList users={searchResults} />
                        </motion.div>
                    )}
                    {!loading && !error && debouncedQuery && searchResults.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.2 }}
                            className="mt-4 text-gray-500 text-center"
                        >
                            Tidak ada hasil ditemukan untuk "{debouncedQuery}".
                        </motion.div>
                    )}
                    {!debouncedQuery && !loading && !error && (
                        <p className="mt-4 text-gray-500 text-center">
                            Masukkan kata kunci untuk mencari pengguna.
                        </p>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}