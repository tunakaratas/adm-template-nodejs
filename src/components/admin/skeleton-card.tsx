export function SkeletonCard() {
    return (
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm animate-pulse">
            <div className="aspect-video bg-muted" />
            <div className="p-4 space-y-3">
                <div className="h-5 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-2/3" />
                <div className="flex gap-2 mt-4">
                    <div className="h-6 bg-muted rounded-full w-16" />
                    <div className="h-6 bg-muted rounded-full w-16" />
                    <div className="h-6 bg-muted rounded-full w-16" />
                </div>
            </div>
        </div>
    );
}

export function SkeletonRow() {
    return (
        <div className="flex items-center gap-4 p-4 border border-border rounded-lg animate-pulse">
            <div className="h-10 w-10 bg-muted rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-1/3" />
                <div className="h-3 bg-muted rounded w-1/2" />
            </div>
            <div className="h-8 w-20 bg-muted rounded" />
        </div>
    );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
    return (
        <div className="space-y-3">
            {Array.from({ length: rows }).map((_, i) => (
                <SkeletonRow key={i} />
            ))}
        </div>
    );
}
