"use client";

import { FileText, Download, Image, Receipt, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ProjectDocument } from '@/types/api';

const DOC_ICONS: Record<string, React.ElementType> = {
  devis: FileText,
  facture: Receipt,
  photo: Image,
  attestation: ShieldCheck,
};

const DOC_LABELS: Record<string, string> = {
  devis: 'Devis',
  facture: 'Facture',
  photo: 'Photo',
  attestation: 'Attestation',
};

export function DocumentList({ documents }: { documents: ProjectDocument[] }) {
  if (!documents || documents.length === 0) {
    return (
      <p className="text-gray-500 text-sm py-4">Aucun document pour le moment.</p>
    );
  }

  return (
    <div className="space-y-3">
      {documents.map((doc) => {
        const Icon = DOC_ICONS[doc.document_type] || FileText;
        return (
          <div
            key={doc.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Icon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-sm">{doc.name}</p>
                <p className="text-xs text-gray-500">
                  {DOC_LABELS[doc.document_type] || doc.document_type} &middot;{' '}
                  {new Date(doc.created_at).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                <Download className="h-4 w-4" />
              </a>
            </Button>
          </div>
        );
      })}
    </div>
  );
}
