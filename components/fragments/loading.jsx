import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Loading() {
    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-4"
            >
                <div className="relative">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                    <div className="absolute inset-0 w-10 h-10 rounded-full border-2 border-blue-500/20"></div>
                </div>
                <p className="text-slate-400 text-sm">Memuat halaman...</p>
            </motion.div>
        </div>
    );
}