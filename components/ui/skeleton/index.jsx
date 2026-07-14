export function Skeleton({ className = "" }) {
  return (
    <div className={"animate-pulse rounded-cv bg-cv-border " + className} />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col bg-cv-surface border border-cv-border rounded-cv overflow-hidden">
      {/* Zdjęcie */}
      <div className="aspect-square bg-cv-elev animate-pulse" />

      <div className="p-4 flex flex-col gap-3">
        {/* Marka + status */}
        <div className="flex items-center justify-between">
          <div className="h-3 w-12 rounded-cv bg-cv-border animate-pulse" />
          <div className="h-3 w-16 rounded-cv bg-cv-border animate-pulse" />
        </div>

        {/* Nazwa — 2 linie */}
        <div className="flex flex-col gap-1.5">
          <div className="h-3.5 w-full rounded-cv bg-cv-border animate-pulse" />
          <div className="h-3.5 w-3/4 rounded-cv bg-cv-border animate-pulse" />
        </div>

        {/* Specyfikacje */}
        <div className="h-3 w-24 rounded-cv bg-cv-border animate-pulse" />

        {/* Cena + przycisk */}
        <div className="flex items-center justify-between mt-1">
          <div className="h-5 w-20 rounded-cv bg-cv-border animate-pulse" />
          <div className="h-9 w-9 rounded-cv bg-cv-border animate-pulse" />
        </div>
      </div>
    </div>
  );
}
