export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <div className="text-lg font-semibold">Loading Inference Studio...</div>
        <div className="text-sm text-gray-500 mt-2">Initializing AI models and camera systems</div>
      </div>
    </div>
  );
}