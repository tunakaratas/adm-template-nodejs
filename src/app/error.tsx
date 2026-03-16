'use client';

import { useEffect } from 'react';

export default function Error({
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
        <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background text-foreground">
            <h2 className="text-2xl font-bold">Bir hata olustu!</h2>
            <p className="text-muted-foreground">Gecici bir durum olabilir.</p>
            <button
                className="rounded-lg bg-foreground px-4 py-2 text-background hover:opacity-90"
                onClick={() => reset()}
            >
                Tekrar Dene
            </button>
        </div>
    );
}
