import React from "react";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ErrorMessage = ({
    message,
    onRetry,
}) => {
    return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center max-w-md"
            >
                <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Terjadi Kesalahan</h2>
                <p className="text-slate-400 mb-6">{message}</p>
                {onRetry && (
                    <Button onClick={onRetry} className="bg-blue-600 hover:bg-blue-700">
                        Coba Lagi
                    </Button>
                )}
            </motion.div>
        </div>
    );
};
