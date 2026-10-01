import React, { useState, useEffect } from 'react';
import {
  Award,
  Download,
  Share2,
  ExternalLink,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  Printer,
  X,
  Copy,
  Check,
} from 'lucide-react';
import { Certificate } from '../types';
import { initialCertificates } from '../server/seed';
import { api } from '../services/api';

interface CertificatesViewProps {
  onShowToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const CertificatesView: React.FC<CertificatesViewProps> = ({ onShowToast }) => {
  const [certificates, setCertificates] = useState<Certificate[]>(initialCertificates);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api.getCertificates().then((data) => {
      if (data && data.length > 0) setCertificates(data);
    }).catch(() => {});
  }, []);

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    onShowToast('Verification link copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white">Verified Career Credentials</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Cryptographically signed accreditation certificates recognized by 400+ hiring partners.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
          <ShieldCheck className="w-4 h-4" />
          <span>{certificates.length} Verified Certificates Issued</span>
        </div>
      </div>

      {/* Certificate Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((cert) => (
          <div
            key={cert.id}
            className="group bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 shadow-xl space-y-5 relative overflow-hidden"
          >
            {/* Top Certificate Header */}
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-md">
                <Award className="w-6 h-6" />
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                Verified
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                {cert.title}
              </h3>
              <p className="text-xs text-slate-400">
                Issued by <strong className="text-slate-300">{cert.issuedBy}</strong>
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <Calendar className="w-3.5 h-3.5" />
                <span>{cert.issueDate}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 text-[11px] space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Grade:</span>
                <span className="font-bold text-emerald-400">{cert.grade}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>ID:</span>
                <span className="font-mono text-slate-300">{cert.certificateNumber}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => setSelectedCert(cert)}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-all text-center"
              >
                View Certificate
              </button>
              <button
                onClick={() => handleCopyLink(cert.verificationUrl)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-all"
                title="Share Verification Link"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Official Certificate Full View Modal */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col my-8">
            {/* Modal Controls */}
            <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">
                Official Credential Verification
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / PDF</span>
                </button>
                <button
                  onClick={() => handleCopyLink(selectedCert.verificationUrl)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Link'}</span>
                </button>
                <button
                  onClick={() => setSelectedCert(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Certificate Canvas / Document */}
            <div className="p-8 sm:p-12 bg-slate-950 m-4 rounded-2xl border-4 border-amber-500/30 text-center space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-amber-400">
                  {selectedCert.issuedBy}
                </span>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">
                  Certificate of Technical Competency
                </h1>
                <p className="text-xs text-slate-400 italic">This is to certify that</p>
              </div>

              <div className="py-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-white to-cyan-300 font-sans">
                  {selectedCert.recipientName}
                </span>
                <div className="w-48 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mt-2" />
              </div>

              <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
                has successfully completed all rigorous assessment modules and project benchmarks for{' '}
                <strong className="text-white">{selectedCert.title}</strong> with a standing of{' '}
                <strong className="text-emerald-400">{selectedCert.grade}</strong>.
              </p>

              {/* Skills Tags */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
                {selectedCert.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-slate-300 text-[10px] font-semibold"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Footer Meta */}
              <div className="pt-8 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-xs text-slate-400">
                <div>
                  <span className="block text-[10px] text-slate-500 uppercase">Issue Date</span>
                  <span className="font-semibold text-slate-200">{selectedCert.issueDate}</span>
                </div>
                <div>
                  <div className="w-12 h-12 rounded-full border-2 border-amber-400/50 mx-auto flex items-center justify-center text-amber-400 text-xs font-bold font-serif mb-1">
                    SEAL
                  </div>
                  <span className="text-[10px] text-amber-400/80 font-bold uppercase">
                    Official Verified
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-500 uppercase">Verification ID</span>
                  <span className="font-mono font-semibold text-slate-200 text-[11px]">
                    {selectedCert.certificateNumber}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
