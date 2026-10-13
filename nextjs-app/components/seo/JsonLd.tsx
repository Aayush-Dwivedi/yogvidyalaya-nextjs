import React from 'react';

export interface JsonLdProps {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
}

/**
 * Safely renders Schema.org JSON-LD structured data in server components.
 * Escapes script tags to prevent XSS / script-context injection.
 */
export const JsonLd: React.FC<JsonLdProps> = ({ data }) => {
  // Safely serialize and escape closing tags to prevent script injection
  const jsonString = JSON.stringify(data).replace(/</g, '\\u003c');

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonString }}
    />
  );
};
