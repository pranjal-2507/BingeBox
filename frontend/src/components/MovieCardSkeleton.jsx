const MovieCardSkeleton = () => {
  return (
    <div className="relative min-w-[200px] md:min-w-[240px] h-[300px] md:h-[360px] rounded-md overflow-hidden bg-gray-800 border border-gray-700 animate-pulse flex flex-col justify-end p-4">
      {/* Shimmer effect overlay */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent shimmer-animation" />
      
      {/* Fake Title */}
      <div className="w-3/4 h-6 bg-gray-600 rounded mb-2"></div>
      
      {/* Fake Badges */}
      <div className="flex gap-2">
        <div className="w-1/3 h-4 bg-gray-600 rounded"></div>
        <div className="w-1/4 h-4 bg-gray-600 rounded"></div>
      </div>
    </div>
  );
};

export default MovieCardSkeleton;
