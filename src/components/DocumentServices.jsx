/**
 * ═══════════════════════════════════════════════════════════
 * DocumentServices — e-Hastakshar Certificate Portal
 * Income, Residence, Caste, Birth certificates
 * Digitally signed, QR-verifiable, printable
 * ═══════════════════════════════════════════════════════════
 */
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { certificateData, generateCertNo } from '../utils/mockData';

const DOC_TYPES = [
    { key: 'income', label: 'Income Certificate', labelHi: 'आय प्रमाण पत्र', icon: '💰', color: '#22C55E' },
    { key: 'caste', label: 'Caste Certificate', labelHi: 'जाति प्रमाण पत्र', icon: '📜', color: '#8B5CF6' },
    { key: 'domicile', label: 'Domicile Certificate', labelHi: 'अधिवास प्रमाण पत्र', icon: '🗺️', color: '#06B6D4' },
    { key: 'residence', label: 'Residence Certificate', labelHi: 'निवास प्रमाण पत्र', icon: '🏠', color: '#3B82F6' },
    { key: 'birth', label: 'Birth Certificate Reprint', labelHi: 'जन्म प्रमाण पत्र', icon: '👶', color: '#F97316' },
];

export default function DocumentServices({ lang }) {
    const { docType } = useParams();
    const navigate = useNavigate();
    const [activeDoc, setActiveDoc] = useState(docType || null);
    const [searched, setSearched] = useState(false);
    const [inputId, setInputId] = useState('');

    if (!activeDoc) {
        return (
            <div className="min-h-[calc(100vh-160px)] flex flex-col items-center px-4 py-6 fast-fade-in">
                <div className="w-full max-w-2xl">
                    <div className="flex items-center gap-3 mb-6">
                        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white cursor-pointer text-lg">←</button>
                        <div>
                            <h2 className="text-2xl font-black text-white">📄 Document Services</h2>
                            <p className="text-white/40 text-sm">e-Hastakshar — Digitally signed, QR-verifiable</p>
                        </div>
                    </div>
                    <div className="grid gap-3">
                        {DOC_TYPES.map(d => (
                            <button key={d.key} onClick={() => setActiveDoc(d.key)}
                                className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/8 transition-all cursor-pointer text-left">
                                <span className="text-3xl">{d.icon}</span>
                                <div className="flex-1">
                                    <p className="text-white font-bold">{d.label}</p>
                                    <p className="text-white/40 text-sm">{d.labelHi}</p>
                                </div>
                                <div className="w-2 h-8 rounded-full" style={{ background: d.color }} />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const meta = DOC_TYPES.find(d => d.key === activeDoc);
    const cert = certificateData[activeDoc];

    return (
        <div className="min-h-[calc(100vh-160px)] flex flex-col items-center px-4 py-6 fast-fade-in">
            <div className="w-full max-w-2xl">
                <div className="flex items-center gap-3 mb-6">
                    <button onClick={() => { setActiveDoc(null); setSearched(false); setInputId(''); }}
                        className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white cursor-pointer text-lg">←</button>
                    <div>
                        <h2 className="text-xl font-black text-white">{meta?.icon} {meta?.label}</h2>
                        <p className="text-white/40 text-sm">e-Hastakshar verified</p>
                    </div>
                </div>

                {!searched ? (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                        <label className="text-white/60 text-sm mb-2 block">Enter Aadhaar or Application Number</label>
                        <div className="flex gap-2">
                            <input value={inputId} onChange={e => setInputId(e.target.value)} placeholder="XXXX-XXXX-XXXX"
                                className="flex-1 bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50" />
                            <button onClick={() => setSearched(true)} disabled={inputId.length < 4}
                                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all">
                                Fetch
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="fast-fade-in">
                        {/* Certificate Preview */}
                        <div className="bg-white/[0.03] border-2 border-white/10 rounded-2xl p-6 relative overflow-hidden">
                            {/* Watermark */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                                <span className="text-[120px] font-black text-white rotate-[-30deg]">e-HASTAKSHAR</span>
                            </div>

                            <div className="text-center mb-4 pb-4 border-b border-white/10">
                                <p className="text-amber-400 text-xs font-bold tracking-widest mb-1">GOVERNMENT OF INDIA — DIGITAL CERTIFICATE</p>
                                <h3 className="text-white font-black text-lg">{meta?.label}</h3>
                                <p className="text-white/30 text-xs">Certificate No: {cert.certNo}</p>
                            </div>

                            <div className="grid gap-2 mb-4">
                                <Row label="Name" value={cert.name} />
                                <Row label="Father's Name" value={cert.fatherName} />
                                {cert.motherName && <Row label="Mother's Name" value={cert.motherName} />}
                                <Row label="Address" value={cert.address || cert.placeOfBirth} />
                                {cert.annualIncome && <Row label="Annual Income" value={`₹${cert.annualIncome.toLocaleString()}`} />}
                                {cert.caste && <Row label="Caste" value={`${cert.caste} (${cert.subCaste})`} />}
                                {cert.dob && <Row label="Date of Birth" value={cert.dob} />}
                                {cert.residingSince && <Row label="Residing Since" value={cert.residingSince} />}
                                <Row label="Issued Date" value={cert.issuedDate} />
                                <Row label="Issuing Authority" value={cert.issuingAuthority} />
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                <div>
                                    <p className="text-green-400 text-xs font-bold">✅ Digitally Signed</p>
                                    <p className="text-white/30 text-xs">QR: {cert.qrCode}</p>
                                </div>
                                <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center border border-white/20">
                                    <span className="text-3xl">📱</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-4">
                            <button className="flex-1 py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold cursor-pointer transition-all">
                                🖨️ Print Certificate
                            </button>
                            <button className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold cursor-pointer transition-all">
                                📥 Download PDF
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function Row({ label, value }) {
    return (
        <div className="flex justify-between items-center py-1.5">
            <span className="text-white/50 text-sm">{label}</span>
            <span className="text-white font-medium text-sm text-right max-w-[60%]">{value}</span>
        </div>
    );
}
