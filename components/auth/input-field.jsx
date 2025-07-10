"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function InputField({
    id,
    label,
    type = "text",
    placeholder,
    trailingIcon,
    disabled,
    error,
    register,
    helperText,
    className = "",
    onChange,
}) {
    return (
        <div className="space-y-2">
            <Label htmlFor={id} className="text-white">
                {label}
            </Label>
            <div className="relative">
                <Input
                    id={id}
                    type={type}
                    placeholder={placeholder}
                    {...register(id)}
                    onChange={onChange}
                    disabled={disabled}
                    className={`${trailingIcon ? "pr-10" : ""
                        } bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 ${className}`}
                />
                {trailingIcon && (
                    <div className="absolute right-0 top-0 h-full flex items-center pr-3">
                        {trailingIcon}
                    </div>
                )}
            </div>
            {error && <p className="text-sm text-red-400">{error.message}</p>}
            {helperText && !error && (
                <p className="text-xs text-gray-500">{helperText}</p>
            )}
        </div>
    );
}
