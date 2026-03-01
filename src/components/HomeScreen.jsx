/**
 * ═══════════════════════════════════════════════════════════
 * HomeScreen v8 — Category-Based Dashboard
 *
 * Organized by department: Bills, PM Schemes, Municipal,
 * Documents. Voice handled globally by VoiceAgent.
 * ═══════════════════════════════════════════════════════════
 */

import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { t } from '../utils/i18n';
import { useVoice } from './VoiceContext';

const CATEGORIES = [
    {
        key: 'bills', label: 'Bills & Payments', labelHi: 'बिल और भुगतान', icon: '💳',
        gradient: 'linear-gradient(135deg, rgba(251,191,36,0.08), rgba(251,191,36,0.02))',
        border: 'rgba(251,191,36,0.2)', color: '#FBBF24',
        services: [
            { key: 'electricity', icon: '⚡', label: 'Electricity', labelHi: 'बिजली बिल', route: '/electricity-services' },
            { key: 'water', icon: '💧', label: 'Water', labelHi: 'पानी बिल', route: '/bill/water' },
            { key: 'gas', icon: '🔥', label: 'Gas', labelHi: 'गैस सेवाएं', route: '/gas-services' },
            { key: 'property', icon: '🏠', label: 'Property Tax', labelHi: 'प्रॉपर्टी टैक्स', route: '/bill/property-tax' },
            { key: 'fastag', icon: '🚗', label: 'FASTag', labelHi: 'FASTag रिचार्ज', route: '/fastag' },
        ],
    },
    {
        key: 'schemes', label: 'PM Government Schemes', labelHi: 'PM सरकारी योजनाएं', icon: '🏛️',
        gradient: 'linear-gradient(135deg, rgba(34,197,94,0.08), rgba(34,197,94,0.02))',
        border: 'rgba(34,197,94,0.2)', color: '#22C55E',
        services: [
            { key: 'pm-kisan', icon: '🌾', label: 'PM-KISAN', labelHi: 'PM किसान', route: '/schemes/pm-kisan' },
            { key: 'ayushman', icon: '🏥', label: 'Ayushman Bharat', labelHi: 'आयुष्मान भारत', route: '/schemes/ayushman' },
            { key: 'jal-jeevan', icon: '🚰', label: 'Jal Jeevan', labelHi: 'जल जीवन', route: '/schemes/jal-jeevan' },
            { key: 'pm-awas', icon: '🏠', label: 'PM Awas', labelHi: 'PM आवास', route: '/schemes/pm-awas' },
            { key: 'ujjwala', icon: '🔥', label: 'PM Ujjwala', labelHi: 'PM उज्ज्वला', route: '/schemes/ujjwala' },
        ],
    },
    {
        key: 'municipal', label: 'Municipal Services', labelHi: 'नगरपालिका सेवाएं', icon: '🏢',
        gradient: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(139,92,246,0.02))',
        border: 'rgba(139,92,246,0.2)', color: '#8B5CF6',
        services: [
            { key: 'complaint', icon: '📝', label: 'File Complaint', labelHi: 'शिकायत दर्ज', route: '/complaint' },
            { key: 'municipal-hub', icon: '🏢', label: 'All Municipal', labelHi: 'सभी सेवाएं', route: '/municipal' },
            { key: 'new-connection', icon: '🔌', label: 'New Connection', labelHi: 'नया कनेक्शन', route: '/new-connection' },
            { key: 'name-change', icon: '✏️', label: 'Name Change', labelHi: 'नाम बदलें', route: '/name-change' },
        ],
    },
    {
        key: 'documents', label: 'Document Services', labelHi: 'दस्तावेज़ सेवाएं', icon: '📄',
        gradient: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(59,130,246,0.02))',
        border: 'rgba(59,130,246,0.2)', color: '#3B82F6',
        services: [
            { key: 'income', icon: '💰', label: 'Income Cert.', labelHi: 'आय प्रमाण पत्र', route: '/documents/income' },
            { key: 'residence', icon: '🏠', label: 'Residence Cert.', labelHi: 'निवास प्रमाण पत्र', route: '/documents/residence' },
            { key: 'caste', icon: '📜', label: 'Caste Cert.', labelHi: 'जाति प्रमाण पत्र', route: '/documents/caste' },
            { key: 'birth', icon: '👶', label: 'Birth Cert.', labelHi: 'जन्म प्रमाण पत्र', route: '/documents/birth' },
        ],
    },
];

export default function HomeScreen({ lang, setLang, onBack }) {
    const navigate = useNavigate();
    const { voiceMode, isActive, setPageData, blindMode } = useVoice();
    const [expandedCat, setExpandedCat] = useState(null);

    // Report available services for blind mode
    useEffect(() => {
        const allServices = CATEGORIES.flatMap(c => c.services.map(s => ({ ...s, category: c.key })));
        setPageData?.({
            page: 'home_services',
            categories: CATEGORIES.map(c => ({ key: c.key, label: c.label, serviceCount: c.services.length })),
            availableServices: allServices,
            canFileComplaint: true,
        });
        return () => setPageData?.(null);
    }, [setPageData]);

    return (
        <div className="min-h-[calc(100vh-160px)] flex flex-col items-center px-4 py-6 gap-4 fast-fade-in">
            {/* Header */}
            <div className="w-full max-w-3xl flex items-center gap-4 mb-1">
                {onBack && (
                    <button onClick={onBack} className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white cursor-pointer text-lg hover:scale-105 transition-transform" aria-label="Back">←</button>
                )}
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-white">
                        {lang === 'hi' ? 'सेवा चुनें' : lang === 'pa' ? 'ਸੇਵਾ ਚੁਣੋ' : 'Select a Service'}
                    </h1>
                    <p className="text-white/40 text-sm">
                        {voiceMode
                            ? (lang === 'hi' ? 'बोलें या नीचे से चुनें' : 'Speak or tap below')
                            : (lang === 'hi' ? 'नीचे से सेवा चुनें' : 'Tap below to choose')}
                    </p>
                </div>
            </div>

            {/* Voice mode indicator */}
            {voiceMode && isActive && (
                <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl px-4 py-2 w-full max-w-3xl">
                    <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                    <span className="text-indigo-300 text-sm font-medium">
                        {lang === 'hi' ? '🎙️ बोलें — बिजली बिल, PM किसान, FASTag, शिकायत' : '🎙️ Say — electricity bill, PM KISAN, FASTag, complaint'}
                    </span>
                </div>
            )}

            {/* Category sections */}
            <div className="w-full max-w-3xl space-y-3">
                {CATEGORIES.map((cat, ci) => {
                    const isExpanded = expandedCat === cat.key || expandedCat === null;
                    return (
                        <div key={cat.key}
                            className="rounded-2xl border overflow-hidden transition-all fast-scale-in"
                            style={{
                                background: cat.gradient,
                                borderColor: isExpanded ? cat.border : 'rgba(255,255,255,0.05)',
                                animationDelay: `${ci * 0.08}s`,
                            }}>
                            <button onClick={() => setExpandedCat(expandedCat === cat.key ? null : cat.key)}
                                className="w-full flex items-center gap-3 px-5 py-4 cursor-pointer text-left">
                                <span className="text-2xl">{cat.icon}</span>
                                <div className="flex-1">
                                    <p className="text-white font-bold text-base">{lang === 'hi' ? cat.labelHi : cat.label}</p>
                                    <p className="text-white/30 text-xs">{cat.services.length} services</p>
                                </div>
                                <span className={`text-white/30 text-lg transition-transform ${isExpanded ? 'rotate-180' : ''}`}>▾</span>
                            </button>
                            {isExpanded && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 px-4 pb-4">
                                    {cat.services.map((svc, si) => (
                                        <button key={svc.key} onClick={() => navigate(svc.route)}
                                            className="group rounded-xl p-3 cursor-pointer border border-transparent hover:border-white/10 flex flex-col items-center gap-2 transition-all hover:bg-white/5 active:scale-95 fast-scale-in"
                                            style={{ animationDelay: `${(ci * 0.08) + (si * 0.04)}s` }}>
                                            <span className="text-2xl group-hover:scale-110 transition-transform">{svc.icon}</span>
                                            <span className="text-white/80 text-xs font-medium text-center leading-tight">
                                                {lang === 'hi' ? svc.labelHi : svc.label}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
