/**
 * ═══════════════════════════════════════════════════════════
 * SuccessModal — Standardized Success Overlay
 * 
 * Reusable across all department workflows.
 * Green checkmark animation, bold reference ID,
 * configurable Print/SMS action buttons.
 * ═══════════════════════════════════════════════════════════
 */

import { useEffect } from 'react';

/**
 * @param {object} props
 * @param {string} props.title - e.g. "Payment Successful", "Ticket Issued"
 * @param {string} props.refLabel - e.g. "Transaction ID", "Tracking Number"
 * @param {string} props.refId - The actual ID value
 * @param {Array} [props.details] - Array of {label, value} for detail rows
 * @param {boolean} [props.showPrint] - Show "Print Receipt (Thermal)" button
 * @param {boolean} [props.showSMS] - Show "Send SMS" button
 * @param {function} [props.onClose] - Called when user dismisses
 * @param {function} [props.onHome] - Called when user taps Home
 * @param {string} [props.subtitle] - Optional subtitle text
 */
export default function SuccessModal({
    title = 'Success!',
    refLabel = 'Reference ID',
    refId = '',
    details = [],
    showPrint = true,
    showSMS = true,
    onClose,
    onHome,
    subtitle,
}) {
    // Lock body scroll while modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    return (
        <div
            className="fixed inset-0 z-[80] flex items-center justify-center p-4 success-modal-backdrop"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-label={title}
        >
            <div
                className="bg-slate-900 border border-white/10 rounded-3xl p-6 w-full max-w-md shadow-2xl fast-scale-in"
                onClick={e => e.stopPropagation()}
            >
                {/* Checkmark */}
                <div className="flex flex-col items-center mb-5">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4 success-check"
                        style={{ background: 'linear-gradient(135deg, #059669, #10B981)' }}>
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="checkmark-draw">
                            <path d="M10 20L17 27L30 13" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
                                style={{
                                    strokeDasharray: 40,
                                    strokeDashoffset: 40,
                                    animation: 'checkmarkDraw 0.5s ease-out 0.3s forwards',
                                }} />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-black text-green-400 mb-1">{title}</h3>
                    {subtitle && <p className="text-white/40 text-sm">{subtitle}</p>}
                </div>

                {/* Reference ID */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-4 text-center">
                    <p className="text-white/50 text-xs mb-1">{refLabel}</p>
                    <p className="text-white font-mono text-lg font-black tracking-wider">{refId}</p>
                </div>

                {/* Detail rows */}
                {details.length > 0 && (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-4 space-y-2">
                        {details.map((d, i) => (
                            <div key={i} className="flex justify-between text-sm">
                                <span className="text-white/50">{d.label}</span>
                                <span className="text-white font-medium">{d.value}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-2">
                    {(showPrint || showSMS) && (
                        <div className="flex gap-2">
                            {showPrint && (
                                <button
                                    onClick={() => alert(`🖨️ Printing receipt for ${refId}...`)}
                                    className="flex-1 py-3.5 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold cursor-pointer border-0 transition-all text-sm"
                                >
                                    🖨️ Print Receipt (Thermal)
                                </button>
                            )}
                            {showSMS && (
                                <button
                                    onClick={() => alert(`📱 SMS sent for ${refId} to registered mobile`)}
                                    className="flex-1 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold cursor-pointer border-0 transition-all text-sm"
                                >
                                    📱 Send SMS
                                </button>
                            )}
                        </div>
                    )}
                    {onHome && (
                        <button
                            onClick={onHome}
                            className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold cursor-pointer hover:bg-white/10 transition-all text-sm"
                        >
                            🏠 Back to Home
                        </button>
                    )}
                    {onClose && !onHome && (
                        <button
                            onClick={onClose}
                            className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold cursor-pointer hover:bg-white/10 transition-all text-sm"
                        >
                            ✕ Close
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
