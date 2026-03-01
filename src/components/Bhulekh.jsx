/**
 * ═══════════════════════════════════════════════════════════
 * Bhulekh — Land Records Download & Print
 * 18+ state land record portals, QR-verifiable
 * ═══════════════════════════════════════════════════════════
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bhulekhData } from '../utils/mockData';

const STATES = [
    { key: 'up', label: 'Uttar Pradesh', portal: 'Bhulekh UP' },
    { key: 'pb', label: 'Punjab', portal: 'PLRS Punjab' },
    { key: 'hr', label: 'Haryana', portal: 'Jamabandi' },
    { key: 'rj', label: 'Rajasthan', portal: 'Apna Khata' },
    { key: 'mp', label: 'Madhya Pradesh', portal: 'Bhulekh MP' },
    { key: 'mh', label: 'Maharashtra', portal: 'Mahabhulekh' },
    { key: 'ka', label: 'Karnataka', portal: 'Bhoomi' },
    { key: 'tn', label: 'Tamil Nadu', portal: 'Patta Chitta' },
    { key: 'wb', label: 'West Bengal', portal: 'Banglarbhumi' },
    { key: 'bh', label: 'Bihar', portal: 'Bhumi Jankari' },
    { key: 'gj', label: 'Gujarat', portal: 'AnyROR' },
    { key: 'ap', label: 'Andhra Pradesh', portal: 'Meebhoomi' },
    { key: 'ts', label: 'Telangana', portal: 'Dharani' },
    { key: 'od', label: 'Odisha', portal: 'Bhulekh Odisha' },
    { key: 'jh', label: 'Jharkhand', portal: 'Jharbhoomi' },
    { key: 'cg', label: 'Chhattisgarh', portal: 'Bhuiyan' },
    { key: 'uk', label: 'Uttarakhand', portal: 'Bhulekh UK' },
    { key: 'dl', label: 'Delhi', portal: 'DORIS' },
];

export default function Bhulekh({ lang }) {
    const navigate = useNavigate();
    const [selectedState, setSelectedState] = useState(null);
    const [searched, setSearched] = useState(false);
    const [khasraNo, setKhasraNo] = useState('');

    if (!selectedState) {
        return (
            <div className="min-h-[calc(100vh-160px)] flex flex-col items-center px-4 py-6 fast-fade-in">
                <div className="w-full max-w-2xl">
                    <div className="flex items-center gap-3 mb-6">
                        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white cursor-pointer text-lg">←</button>
                        <div>
                            <h2 className="text-2xl font-black text-white">🗺️ Bhulekh — Land Records</h2>
                            <p className="text-white/40 text-sm">Download & print land records from 18+ states</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {STATES.map(s => (
                            <button key={s.key} onClick={() => setSelectedState(s)}
                                className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-green-500/30 hover:bg-white/8 transition-all cursor-pointer text-left">
                                <p className="text-white font-medium text-sm">{s.label}</p>
                                <p className="text-white/30 text-xs">{s.portal}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-160px)] flex flex-col items-center px-4 py-6 fast-fade-in">
            <div className="w-full max-w-2xl">
                <div className="flex items-center gap-3 mb-6">
                    <button onClick={() => { setSelectedState(null); setSearched(false); setKhasraNo(''); }}
                        className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white cursor-pointer text-lg">←</button>
                    <div>
                        <h2 className="text-xl font-black text-white">🗺️ {selectedState.label} — {selectedState.portal}</h2>
                        <p className="text-white/40 text-sm">Land record lookup</p>
                    </div>
                </div>

                {!searched ? (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                        <label className="text-white/60 text-sm mb-2 block">Enter Khasra / Khatauni / Survey Number</label>
                        <input value={khasraNo} onChange={e => setKhasraNo(e.target.value)} placeholder="e.g. 123/456"
                            className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-green-500/50 mb-3" />
                        <label className="text-white/60 text-sm mb-2 block">Or enter Owner Name</label>
                        <input placeholder="e.g. Ramesh Kumar"
                            className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-green-500/50 mb-3" />
                        <button onClick={() => setSearched(true)} disabled={khasraNo.length < 2}
                            className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold disabled:opacity-30 cursor-pointer transition-all">
                            🔍 Search Land Record
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4 fast-fade-in">
                        {/* Land record preview */}
                        <div className="bg-white/[0.03] border-2 border-white/10 rounded-2xl p-6 relative overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                                <span className="text-[100px] font-black text-white rotate-[-30deg]">BHULEKH</span>
                            </div>

                            <div className="text-center mb-4 pb-4 border-b border-white/10">
                                <p className="text-green-400 text-xs font-bold tracking-widest mb-1">GOVERNMENT OF {selectedState.label.toUpperCase()} — LAND RECORD</p>
                                <h3 className="text-white font-black text-lg">Khatauni / Jamabandi</h3>
                                <p className="text-white/30 text-xs">Record ID: {bhulekhData.recordId}</p>
                            </div>

                            <div className="grid gap-2 mb-4">
                                <Row label="Owner Name" value={bhulekhData.ownerName} />
                                <Row label="Father's Name" value={bhulekhData.fatherName} />
                                <Row label="Khasra No." value={bhulekhData.khasraNo} />
                                <Row label="Khata No." value={bhulekhData.khataNo} />
                                <Row label="Village" value={bhulekhData.village} />
                                <Row label="Tehsil" value={bhulekhData.tehsil} />
                                <Row label="District" value={bhulekhData.district} />
                                <Row label="Area" value={bhulekhData.area} />
                                <Row label="Land Type" value={bhulekhData.landType} />
                                <Row label="Last Mutation" value={bhulekhData.lastMutation} />
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                <div>
                                    <p className="text-green-400 text-xs font-bold">✅ Digitally Verified</p>
                                    <p className="text-white/30 text-xs">QR: {bhulekhData.qrCode}</p>
                                </div>
                                <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center border border-white/20">
                                    <span className="text-3xl">📱</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button className="flex-1 py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold cursor-pointer transition-all">
                                🖨️ Print Record
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
