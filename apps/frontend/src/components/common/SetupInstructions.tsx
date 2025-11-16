
export default function SetupInstructions() {
  return (
    <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
      <h3 className="font-semibold text-blue-900 mb-2">Setup Instructions</h3>
      <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
        <li>Install dependencies: <code className="bg-blue-100 px-1 rounded">npm install</code></li>
        <li>Start backend: <code className="bg-blue-100 px-1 rounded">cd apps/backend && npm start</code></li>
        <li>Start frontend: <code className="bg-blue-100 px-1 rounded">cd apps/frontend && npm run dev</code></li>
        <li>Or use Turbo: <code className="bg-blue-100 px-1 rounded">npm run dev</code></li>
      </ol>
    </div>
  );
}
