export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-lg text-slate-700">Caricamento pazienti...</p>
    </div>
  );
}