export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-600">
      {/* Un layout pulito, centrato e senza sidebar per il login */}
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}