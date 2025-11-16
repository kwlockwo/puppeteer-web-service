import type { ScrapedData } from '../../types';

interface ScrapedDataResultProps {
  data: ScrapedData;
}

export default function ScrapedDataResult({ data }: ScrapedDataResultProps) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold text-gray-700 mb-2">Title</h4>
        <p className="text-gray-600">{data.title}</p>
      </div>

      {data.headings && data.headings.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Headings</h4>
          <ul className="space-y-1">
            {data.headings.map((h, i) => (
              <li key={i} className="text-gray-600">
                <span className="font-mono text-xs text-gray-500">{h.tag}</span>: {h.text}
              </li>
            ))}
          </ul>
        </div>
      )}

      {data.links && data.links.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Links (Top 10)</h4>
          <ul className="space-y-1">
            {data.links.map((link, i) => (
              <li key={i} className="text-blue-600 hover:underline">
                <a href={link.href} target="_blank" rel="noopener noreferrer">
                  {link.text || link.href}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
