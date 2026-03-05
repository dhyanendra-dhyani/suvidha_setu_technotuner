/**
 * ═══════════════════════════════════════════════════════════
 * DigiLockerFetch — Animated DigiLocker / e-Pramaan Flow
 * 
 * Shows a 2-phase loading modal:
 *   Phase 1 (1s): "Authenticating with e-Pramaan..."
 *   Phase 2 (1s): "Fetching secure documents from DigiLocker..."
 * Then calls onComplete() to show the pre-filled form.
 * ═══════════════════════════════════════════════════════════
 */

import { useState, useEffect } from 'react';

const PHASES = [
    { text: 'Authenticating with e-Pramaan...', icon: '🔐' },
    { text: 'Fetching secure documents from DigiLocker...', icon: '📄' },
];

/**
 * @param {object} props
 * @param {boolean} props.active - Whether the modal is showing
 * @param {function} props.onComplete - Called after the 2-second animation
 * @param {string} [props.connectionType] - e.g. "Electricity", "Gas"
 */
export default function DigiLockerFetch({ active, onComplete, connectionType = '' }) {
    const [phase, setPhase] = useState(0);

    useEffect(() => {
        if (!active) { setPhase(0); return; }

        const t1 = setTimeout(() => setPhase(1), 1000);
        const t2 = setTimeout(() => {
            if (onComplete) onComplete();
        }, 2000);

        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, [active, onComplete]);

    if (!active) return null;

    const current = PHASES[phase] || PHASES[0];

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-6 success-modal-backdrop" role="dialog" aria-modal="true" aria-label="DigiLocker Authentication">
            <div className="bg-slate-900 border border-white/10 rounded-3xl p-8 w-full max-w-sm shadow-2xl fast-scale-in text-center">
                {/* DigiLocker icon */}
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-blue-600/20 border-2 border-blue-500/30 flex items-center justify-center">
                    <span className="text-4xl">{current.icon}</span>
                </div>

                {/* Spinner */}
                <div className="flex justify-center mb-5">
                    <div className="w-8 h-8 border-3 border-blue-500/30 border-t-blue-400 rounded-full"
                        style={{ animation: 'voSpin 0.7s linear infinite' }} />
                </div>

                {/* Phase text */}
                <p className="text-white font-semibold text-base mb-2 fast-fade-in" key={phase}>
                    {current.text}
                </p>
                {connectionType && (
                    <p className="text-white/30 text-xs">
                        Service: {connectionType}
                    </p>
                )}

                {/* Progress dots */}
                <div className="flex justify-center gap-2 mt-5">
                    {PHASES.map((_, i) => (
                        <div key={i} className="w-2.5 h-2.5 rounded-full transition-all duration-300"
                            style={{
                                background: i <= phase ? '#3B82F6' : 'rgba(255,255,255,0.1)',
                                transform: i === phase ? 'scale(1.3)' : 'scale(1)',
                            }} />
                    ))}
                </div>
            </div>
        </div>
    );
}
