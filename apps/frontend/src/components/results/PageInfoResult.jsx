import React from 'react';

export default function PageInfoResult({ info }) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold text-gray-700 mb-2">Title</h4>
        <p className="text-gray-600">{info.title}</p>
      </div>
      
      <div>
        <h4 className="font-semibold text-gray-700 mb-2">URL</h4>
        <p className="text-blue-600 break-all">{info.url}</p>
      </div>

      {info.metaDescription && (
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Meta Description</h4>
          <p className="text-gray-600">{info.metaDescription}</p>
        </div>
      )}

      {info.headings?.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Page Structure</h4>
          <ul className="space-y-1">
            {info.headings.map((h, i) => (
              <li key={i} className="text-gray-600">
                <span className="font-mono text-xs text-gray-500">{h.tag}</span>: {h.text}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
