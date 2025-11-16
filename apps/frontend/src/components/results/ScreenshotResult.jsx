import React from 'react';
import { Download } from 'lucide-react';

export default function ScreenshotResult({ screenshot }) {
  const downloadScreenshot = () => {
    const blob = new Blob(
      [Uint8Array.from(atob(screenshot), c => c.charCodeAt(0))],
      { type: 'image/png' }
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'screenshot.png';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <img
        src={`data:image/png;base64,${screenshot}`}
        alt="Screenshot"
        className="w-full rounded-lg border border-gray-300 mb-4"
      />
      <button
        onClick={downloadScreenshot}
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        <Download className="w-4 h-4" />
        Download Screenshot
      </button>
    </div>
  );
}
