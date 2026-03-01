/**
 * ═══════════════════════════════════════════════════════════
 * FASTagRecharge — BBPS FASTag top-up
 * ═══════════════════════════════════════════════════════════
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fastagData, generateFastagTxnId } from '../utils/mockData';

export default function FASTagRecharge({ lang }) {
    const navigate = useNavigate();
    const [vehicleNo, setVehicleNo] = useState('');
    const [searched, setSearched] = useState(false);
    const [rechargeAmt, setRechargeAmt] = useState('');
    const [payMethod, setPayMethod] = useState(null);
    const [recharged, setRecharged] = useState(false);
    const [txnId, setTxnId] = useState('');

    const doSearch = () => {
        if (vehicleNo.length >= 4) setSearched(true);
    };

    const doRecharge = (method) => {
        setPayMethod(method);
        setTxnId(generateFastagTxnId());
        setTimeout(() => setRecharged(true), 1500);
    };

    return (
        <div className="min-h-[calc(100vh-160px)] flex flex-col items-center px-4 py-6 fast-fade-in">
            <div className="w-full max-w-xl">
                <div className="flex items-center gap-3 mb-6">
                    <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white cursor-pointer text-lg">←</button>
                    <div>
                        <h2 className="text-xl font-black text-white">🚗 FASTag Recharge</h2>
                        <p className="text-white/40 text-sm">BBPS — National Electronic Toll Collection</p>
                    </div>
                </div>

                {!searched && (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                        <label className="text-white/60 text-sm mb-2 block">Enter Vehicle Number or FASTag ID</label>
                        <div className="flex gap-2">
                            <input value={vehicleNo} onChange={e => setVehicleNo(e.target.value.toUpperCase())} placeholder="PB-10-AB-1234"
                                className="flex-1 bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 uppercase" />
                            <button onClick={doSearch} disabled={vehicleNo.length < 4}
                                className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all">
                                Search
                            </button>
                        </div>
                    </div>
                )}

                {searched && !recharged && (
                    <div className="space-y-4 fast-fade-in">
                        <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-2xl p-5">
                            <p className="text-cyan-400 font-bold mb-3">🚗 FASTag Details</p>
                            <Row label="Vehicle" value={fastagData.vehicleNo} />
                            <Row label="Tag ID" value={fastagData.tagId} />
                            <Row label="Issuer" value={fastagData.issuer} />
                            <Row label="Current Balance" value={`₹${fastagData.balance}`} bold />
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                            <label className="text-white/60 text-sm mb-2 block">Select Recharge Amount</label>
                            <div className="flex gap-2 mb-4 flex-wrap">
                                {[100, 200, 500, 1000, 2000].map(a => (
                                    <button key={a} onClick={() => setRechargeAmt(String(a))}
                                        className={`px-4 py-2 rounded-xl border cursor-pointer transition-all text-sm font-bold ${rechargeAmt === String(a) ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400' : 'bg-white/5 border-white/10 text-white/60 hover:text-white'}`}>
                                        ₹{a}
                                    </button>
                                ))}
                            </div>
                            {rechargeAmt && (
                                <div className="fast-fade-in">
                                    <p className="text-white/60 text-sm mb-2">Payment Method</p>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[{ key: 'upi', label: 'UPI', icon: '📱' }, { key: 'cash', label: 'Cash', icon: '💵' }, { key: 'card', label: 'Card', icon: '💳' }].map(m => (
                                            <button key={m.key} onClick={() => doRecharge(m.key)}
                                                className="py-4 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/30 text-white text-center cursor-pointer transition-all">
                                                <span className="text-2xl block mb-1">{m.icon}</span>
                                                <span className="text-sm font-medium">{m.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                            <p className="text-white font-bold mb-3">📋 Recent Recharges</p>
                            {fastagData.rechargeHistory.map((r, i) => (
                                <div key={i} className="flex justify-between py-2 border-b border-white/5 last:border-0">
                                    <span className="text-white/60 text-sm">{r.date} ({r.mode})</span>
                                    <span className="text-green-400 font-bold text-sm">+₹{r.amount}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {recharged && (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 text-center fast-fade-in">
                        <p className="text-green-400 text-5xl mb-3">✅</p>
                        <p className="text-green-400 font-bold text-xl">Recharge Successful!</p>
                        <p className="text-white/50 text-sm mt-2">₹{rechargeAmt} added to FASTag</p>
                        <p className="text-white font-medium mt-1">New Balance: ₹{fastagData.balance + Number(rechargeAmt)}</p>
                        <p className="text-white/30 text-xs mt-3">TXN: {txnId}</p>
                        <p className="text-white/20 text-xs">Via {payMethod?.toUpperCase()}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function Row({ label, value, bold }) {
    return (
        <div className="flex justify-between items-center py-1.5">
            <span className="text-white/50 text-sm">{label}</span>
            <span className={`text-sm ${bold ? 'text-green-400 font-bold text-lg' : 'text-white font-medium'}`}>{value}</span>
        </div>
    );
}
