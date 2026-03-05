/**
 * ═══════════════════════════════════════════════════════════
 * OCRScanner — Mock Camera Viewfinder with Scanning Animation
 * 
 * Simulates OCR meter reading:
 *   - Camera viewfinder box with crosshair corners
 *   - Horizontal laser line scanning top-to-bottom
 *   - Mock digital meter display
 *   - After ~3s: shows voice confirm prompt with scanned reading
 * ═══════════════════════════════════════════════════════════
 */

import { useState, useEffect } from 'react';

/**
 * @param {object} props
 * @param {function} props.onScanComplete - Called with the scanned reading value
 * @param {string} [props.mockReading] - Override the simulated reading
 */
export default function OCRScanner({ onScanComplete, mockReading = '45,763' }) {
    const [scanning, setScanning] = useState(true);
    const [scanned, setScanned] = useState(false);
    const [voiceConfirm, setVoiceConfirm] = useState(false);

    useEffect(() => {
        // Scan for 3 seconds then show result
        const t1 = setTimeout(() => {
            setScanning(false);
            setScanned(true);
        }, 3000);

        // After result, show voice confirm prompt
        const t2 = setTimeout(() => {
            setVoiceConfirm(true);
        }, 4000);

        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, []);

    return (
        <div className="space-y-4">
            {/* Camera Viewfinder */}
            <div className="relative w-full aspect-[4/3] max-w-sm mx-auto rounded-2xl overflow-hidden border-2 border-white/20 bg-black/40"
                style={{ boxShadow: '0 0 40px rgba(0,0,0,0.5)' }}>

                {/* Mock meter display */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-gray-800 border-2 border-gray-600 rounded-xl px-6 py-4 text-center" style={{ boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.5)' }}>
                        <p className="text-gray-500 text-xs mb-1 font-mono">DIGITAL METER</p>
                        <p className="text-green-400 text-3xl font-mono font-black tracking-widest"
                            style={{ textShadow: '0 0 10px rgba(74,222,128,0.5)' }}>
                            {mockReading}
                        </p>
                        <p className="text-gray-500 text-xs mt-1 font-mono">kWh</p>
                    </div>
                </div>

                {/* Corner marks */}
                <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-amber-400" />
                <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-amber-400" />
                <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-amber-400" />
                <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-amber-400" />

                {/* Scanning laser line */}
                {scanning && (
                    <div className="absolute left-0 right-0 h-0.5 ocr-scan-line"
                        style={{
                            background: 'linear-gradient(90deg, transparent 0%, #EF4444 20%, #F59E0B 50%, #EF4444 80%, transparent 100%)',
                            boxShadow: '0 0 12px rgba(239,68,68,0.6), 0 0 30px rgba(239,68,68,0.3)',
                        }} />
                )}

                {/* Scanned overlay */}
                {scanned && (
                    <div className="absolute inset-0 bg-green-500/10 flex items-center justify-center fast-fade-in">
                        <div className="bg-green-500/20 border border-green-500/40 rounded-xl px-4 py-2">
                            <p className="text-green-400 font-bold text-sm">✅ Reading Captured</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Status */}
            {scanning && (
                <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                    <p className="text-white/60 text-sm">Scanning meter reading...</p>
                </div>
            )}

            {/* Scanned result */}
            {scanned && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 text-center fast-fade-in">
                    <p className="text-amber-400 font-bold mb-1">📸 OCR Result</p>
                    <p className="text-white text-3xl font-mono font-black">{mockReading} <span className="text-white/40 text-lg">kWh</span></p>
                </div>
            )}

            {/* Voice confirm prompt */}
            {voiceConfirm && (
                <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-5 fast-fade-in">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                            <span className="text-xl">🎙️</span>
                        </div>
                        <div>
                            <p className="text-indigo-300 font-bold text-sm">Voice Confirm</p>
                            <p className="text-white/40 text-xs">Say "Confirm" or tap the button</p>
                        </div>
                    </div>
                    <p className="text-white/60 text-sm mb-3">
                        Is <span className="text-white font-bold">{mockReading} kWh</span> correct?
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => onScanComplete?.(mockReading)}
                            className="flex-1 py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold cursor-pointer border-0 transition-all"
                        >
                            ✅ Confirm Reading
                        </button>
                        <button
                            onClick={() => { setScanning(true); setScanned(false); setVoiceConfirm(false); }}
                            className="py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white cursor-pointer transition-all"
                        >
                            🔄 Rescan
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
