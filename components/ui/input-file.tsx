import { Input } from "@/components/ui/input"
import { useState } from "react";

export function InputFile() {
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && selectedFile.size <= 2 * 1024 * 1024) {
            setError(null);
        } else {
            setError('Максимальный размер файла 2 Мб');
        }
    };
    return (
        <div className="grid w-full max-w-sm items-center gap-1.5">
            <Input type="file" onChange={handleFileChange} />
            {error && (
                <div className="text-red-900 text-sm mb-2">{error}</div>
            )}
        </div>
    )
}
