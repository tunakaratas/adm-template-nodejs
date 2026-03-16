'use client';

import { useEffect } from 'react';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <html>
            <body className="bg-[#dce0e6] font-sans text-[#37505d]">
                <div className="flex h-screen w-full flex-col items-center justify-center gap-4">
                    <h2 className="text-2xl font-bold">Kritik Hata</h2>
                    <p>Sistemsel bir sorun olustu.</p>
                    <button
                        className="rounded-lg bg-[#37505d] px-4 py-2 text-white"
                        onClick={() => reset()}
                    >
                        Yenile
                    </button>
                </div>
            </body>
        </html>
    );
}
