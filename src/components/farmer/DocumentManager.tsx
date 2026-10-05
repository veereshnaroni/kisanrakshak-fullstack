import React, { useState } from 'react';
import { FileText, Upload, CheckCircle2, Clock, Trash2, Shield, Eye } from 'lucide-react';
import { DocumentRecord } from '../../types';
import { db } from '../../services/mockBackendApi';

export const DocumentManager: React.FC = () => {
  const [docs, setDocs] = useState<DocumentRecord[]>(() => db.getDocuments());
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [docToDelete, setDocToDelete] = useState<DocumentRecord | null>(null);
  const [previewDoc, setPreviewDoc] = useState<DocumentRecord | null>(null);
  const [docTitle, setDocTitle] = useState('');
  const [docType, setDocType] = useState<DocumentRecord['docType']>('RTC / Pahani (Land Record)');
  const [fileName, setFileName] = useState('');

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle) return;

    const newDoc: DocumentRecord = {
      id: `doc-${Date.now()}`,
      userId: 'usr-farmer-1',
      title: docTitle,
      docType,
      fileName: fileName || `${docTitle.toLowerCase().replace(/\s+/g, '_')}.pdf`,
      uploadDate: new Date().toISOString().slice(0, 10),
      verificationStatus: 'UNDER_REVIEW',
      fileSizeKb: Math.floor(Math.random() * 400) + 120,
    };

    db.saveDocument(newDoc);
    setDocs(db.getDocuments());
    setShowUploadModal(false);
    setDocTitle('');
    setFileName('');
  };

  const handleConfirmDelete = () => {
    if (!docToDelete) return;
    db.deleteDocument(docToDelete.id);
    setDocs((prev) => prev.filter((d) => d.id !== docToDelete.id));
    setDocToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white rounded-2xl border border-[#E2E8E4] p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#17211B] flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#146B3A]" /> Farm Digital Document Vault
          </h1>
          <p className="text-xs sm:text-sm text-[#65736B] mt-1 max-w-2xl">
            Keep digitized copies of Pahani (RTC), PMFBY Crop Insurance policies, and Aadhaar safe from physical flood or fire loss.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="bg-[#146B3A] hover:bg-[#1F8A4C] text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
        >
          <Upload className="w-4 h-4" /> Upload Document
        </button>
      </div>

      {/* Docs List */}
      <div className="bg-white rounded-2xl border border-[#E2E8E4] overflow-hidden shadow-xs">
        <div className="p-4 border-b border-[#E2E8E4] bg-[#F7F9F8] flex items-center justify-between">
          <span className="text-xs font-bold text-[#17211B]">SECURED ENCRYPTED RECORDS</span>
          <span className="text-xs text-[#65736B] flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-[#146B3A]" /> 256-Bit Storage
          </span>
        </div>

        <div className="divide-y divide-[#E2E8E4]">
          {docs.map((d) => (
            <div
              key={d.id}
              className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 hover:bg-[#F5FBF7] transition-colors"
            >
              <div className="flex items-center space-x-3.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#EAF6EE] text-[#146B3A] flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-[#17211B] truncate">{d.title}</h4>
                  <div className="text-xs text-[#65736B] flex flex-wrap items-center gap-2 mt-0.5">
                    <span>{d.docType}</span>
                    <span>•</span>
                    <span>{d.fileName}</span>
                    <span>•</span>
                    <span>{d.fileSizeKb} KB</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <span
                  className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full ${
                    d.verificationStatus === 'VERIFIED'
                      ? 'bg-[#EAF6EE] text-[#146B3A]'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {d.verificationStatus}
                </span>

                <span className="text-xs text-[#65736B] hidden sm:inline">
                  Uploaded: {d.uploadDate}
                </span>

                <button
                  type="button"
                  onClick={() => setPreviewDoc(d)}
                  className="p-1.5 text-[#65736B] hover:text-[#146B3A] rounded hover:bg-white cursor-pointer"
                  title="View Document"
                >
                  <Eye className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setDocToDelete(d)}
                  className="p-1.5 text-red-500 hover:text-red-700 rounded hover:bg-white cursor-pointer"
                  title="Delete Document"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {docToDelete && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E2E8E4] p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-base font-bold text-[#17211B]">Delete Document Record?</h3>
            <p className="text-xs text-[#65736B] mt-1.5 leading-relaxed">
              Are you sure you want to remove <strong>{docToDelete.title}</strong> ({docToDelete.fileName})?
            </p>
            <div className="flex items-center justify-end space-x-2 mt-5">
              <button
                type="button"
                onClick={() => setDocToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#65736B] hover:bg-[#F7F9F8] border border-[#E2E8E4] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#DC4444] hover:bg-red-700 transition-colors shadow-xs cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E2E8E4] p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8E4]">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-[#146B3A]" />
                <h3 className="text-sm font-bold text-[#17211B]">{previewDoc.title}</h3>
              </div>
              <span className="text-[10px] bg-[#EAF6EE] text-[#146B3A] font-bold px-2 py-0.5 rounded">
                {previewDoc.verificationStatus}
              </span>
            </div>
            <div className="my-6 p-4 bg-[#F7F9F8] rounded-xl border border-[#E2E8E4] text-center">
              <FileText className="w-12 h-12 text-[#146B3A] mx-auto mb-2 opacity-80" />
              <p className="text-xs font-bold text-[#17211B]">{previewDoc.fileName}</p>
              <p className="text-[11px] text-[#65736B] mt-1">{previewDoc.docType} • {previewDoc.fileSizeKb} KB</p>
              <p className="text-[10px] text-[#146B3A] font-semibold mt-2">✓ Verified via Bhoomi Karnataka Land Registry</p>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#146B3A] hover:bg-[#1F8A4C] cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#E2E8E4] w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-[#17211B] mb-1">Upload Farm Document</h2>
            <p className="text-xs text-[#65736B] mb-4">Upload PDF or image copies for quick loss assessment proof.</p>

            <form onSubmit={handleUpload} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#17211B] mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2026 Pahani / RTC Sy 142"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  className="w-full border border-[#E2E8E4] rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#17211B] mb-1">Document Type</label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as any)}
                  className="w-full border border-[#E2E8E4] rounded-lg px-2 py-2 text-xs"
                >
                  <option value="RTC / Pahani (Land Record)">RTC / Pahani (Land Record)</option>
                  <option value="Crop Insurance (PMFBY)">Crop Insurance (PMFBY)</option>
                  <option value="Kisan Credit Card (KCC)">Kisan Credit Card (KCC)</option>
                  <option value="Aadhaar Card">Aadhaar Card</option>
                  <option value="Bank Passbook">Bank Passbook</option>
                  <option value="Soil Health Card">Soil Health Card</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#17211B] mb-1">Select File (PDF / Image)</label>
                <input
                  type="file"
                  onChange={(e) => setFileName(e.target.files?.[0]?.name || '')}
                  className="w-full border border-[#E2E8E4] rounded-lg px-2 py-1.5 text-xs bg-[#F7F9F8]"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-[#E2E8E4]">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 font-semibold text-[#65736B] hover:text-[#17211B]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#146B3A] hover:bg-[#1F8A4C] text-white px-5 py-2 rounded-xl font-bold shadow-xs cursor-pointer"
                >
                  Upload & Secure
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
