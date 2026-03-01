/**
 * ═══════════════════════════════════════════════════════════
 * VoiceAgent v21 — Direct Gemini Architecture
 *
 * ALL queries go directly to Gemini 2.5. No local KB, no quick lookup.
 * 15 API keys in round-robin. Fastest possible response.
 *
 * Architecture:
 *   - Clean input
 *   - Send directly to Gemini
 *   - Execute action + speak response
 * ═══════════════════════════════════════════════════════════
 */

import { useState, useCallback, useRef, useEffect, memo } from 'react';
import { useLocation } from 'react-router-dom';
import VoiceContext from './VoiceContext';
import { getAssistantGuidance, getProactiveHelp, resetChatSession } from '../utils/geminiService';
import { playClickSound, playSuccessSound } from '../utils/audioService';

const SPEECH_LANGS = {
    en: 'en-IN', hi: 'hi-IN', pa: 'pa-IN', bn: 'bn-IN',
    ta: 'ta-IN', te: 'te-IN', kn: 'kn-IN', mr: 'mr-IN',
    gu: 'gu-IN', ml: 'ml-IN', ur: 'ur-IN',
};

const VoiceAgent = memo(function VoiceAgent({
    lang, setLang, screen, setScreen, voiceMode,
    navigate, setCitizen, addLog, blindMode: blindModeProp, setBlindMode: setBlindModeProp, setPendingIntent, citizen, children,
}) {
    const [isActive, setIsActive] = useState(false);
    const [status, setStatus] = useState('idle');
    const [lastTranscript, setLastTranscript] = useState('');
    const [lastReply, setLastReply] = useState('');
    const [interimText, setInterimText] = useState('');
    const [pageData, setPageData] = useState(null);

    const isActiveRef = useRef(false);
    const isSpeakingRef = useRef(false);
    const recognitionRef = useRef(null);
    const langRef = useRef(lang);
    const screenRef = useRef(screen);
    const processingRef = useRef(false);
    const bargedInRef = useRef(false);
    const pendingTranscriptRef = useRef(null);
    const silenceTimerRef = useRef(null);
    const lastInterimRef = useRef('');
    const lastRouteRef = useRef('');
    const lastScreenRef = useRef(screen);
    const restartCountRef = useRef(0);
    const historyRef = useRef([]);
    const rePromptTimerRef = useRef(null);
    const rePromptCountRef = useRef(0);
    const hasInteractedRef = useRef(false);
    const isRecognizingRef = useRef(false);  // TRUE = recognition is actually running
    const recGenRef = useRef(0);  // generation counter prevents stale callbacks
    const geminiTtsAudioRef = useRef(null);
    const ttsResolverRef = useRef(null);
    const pageDataRef = useRef(null);
    const blindModeRef = useRef(blindModeProp || false);
    // Guard against double-greeting on initial mount
    const initialGreetingDoneRef = useRef(false);
    // Flag to skip next proactive help (set after voice-initiated navigation)
    const skipNextProactiveRef = useRef(false);
    // Track when TTS ended for post-TTS echo filtering
    const ttsEndTimeRef = useRef(0);

    // Simple transcript deduplication
    const lastProcessedRef = useRef('');
    const lastProcessedTimeRef = useRef(0);

    const location = useLocation();

    useEffect(() => { langRef.current = lang; }, [lang]);
    useEffect(() => { screenRef.current = screen; }, [screen]);
    useEffect(() => { pageDataRef.current = pageData; }, [pageData]);
    useEffect(() => { blindModeRef.current = blindModeProp || false; }, [blindModeProp]);

    const log = useCallback((msg) => {
        console.log(`[VA] ${msg}`);
        addLog?.(msg);
    }, [addLog]);

    // ══════════════════════════════════════════════════
    // STOP ALL TTS — resolves pending promises
    // ══════════════════════════════════════════════════

    const stopAllTTS = useCallback(() => {
        window.speechSynthesis?.cancel();
        if (geminiTtsAudioRef.current) {
            try {
                geminiTtsAudioRef.current.pause();
                geminiTtsAudioRef.current.currentTime = 0;
            } catch { }
            geminiTtsAudioRef.current = null;
        }
        isSpeakingRef.current = false;
        // Resolve any pending TTS promise so pipeline doesn't hang
        if (ttsResolverRef.current) {
            ttsResolverRef.current();
            ttsResolverRef.current = null;
        }
    }, []);

    // ══════════════════════════════════════════════════
    // TTS — Direct browser SpeechSynthesis (fast, reliable)
    // Gemini TTS SDK was removed: it always fails, blocks for
    // seconds, and kills recognition while waiting.
    // ══════════════════════════════════════════════════

    const ttsSpeak = useCallback((text, langCode) => {
        return new Promise((resolve) => {
            if (!text || bargedInRef.current) {
                isSpeakingRef.current = false;
                resolve();
                return;
            }

            isSpeakingRef.current = true;
            setStatus('speaking');
            ttsResolverRef.current = resolve;

            if (!window.speechSynthesis) {
                isSpeakingRef.current = false;
                ttsResolverRef.current = null;
                resolve();
                return;
            }

            // SELF-LISTENING PREVENTION: Kill recognition completely before TTS plays
            // Increment gen FIRST so the stale onend handler is blocked from restarting
            recGenRef.current++;
            try { recognitionRef.current?.abort(); } catch { }
            recognitionRef.current = null;
            isRecognizingRef.current = false;

            // Cancel any ongoing speech
            window.speechSynthesis.cancel();

            const u = new SpeechSynthesisUtterance(text);
            u.lang = SPEECH_LANGS[langCode] || 'hi-IN';
            u.rate = 1.05;
            u.pitch = 1;
            u.volume = 1;

            const voices = window.speechSynthesis.getVoices();
            const v = voices.find(v => v.lang === u.lang) || voices.find(v => v.lang.startsWith(langCode));
            if (v) u.voice = v;

            const finish = () => {
                ttsEndTimeRef.current = Date.now();
                ttsResolverRef.current = null;
                setStatus('listening');
                // Keep isSpeakingRef TRUE for 500ms after TTS ends
                // This prevents recognition from processing its own echo
                // (recognition results lag behind actual audio by 200-500ms)
                setTimeout(() => {
                    isSpeakingRef.current = false;
                }, 500);
                // Restart recognition AFTER TTS + cooldown
                if (isActiveRef.current) {
                    setTimeout(() => {
                        if (isActiveRef.current && !isRecognizingRef.current) {
                            window.dispatchEvent(new CustomEvent('va-restart-recognition'));
                        }
                    }, 600);
                }
                resolve();
            };

            u.onend = finish;
            u.onerror = finish;

            // Safety: if onend never fires (Chrome bug), force-resolve after text length * 80ms + 3s
            const safetyMs = Math.max(text.length * 80, 3000) + 3000;
            const safetyTimer = setTimeout(() => {
                if (isSpeakingRef.current) {
                    console.warn('[VA] TTS safety timeout — force finishing');
                    window.speechSynthesis.cancel();
                    finish();
                }
            }, safetyMs);

            const origFinish = finish;
            u.onend = () => { clearTimeout(safetyTimer); origFinish(); };
            u.onerror = () => { clearTimeout(safetyTimer); origFinish(); };

            window.speechSynthesis.speak(u);
        });
    }, []);

    // ═══ RE-PROMPT ═══════════════════════════════════

    const RE_PROMPTS = [
        { hi: 'बोलिए, मैं सुन रहा हूँ। क्या करना है बताइए।', en: 'I\'m listening. What would you like to do?' },
        { hi: 'अभी भी यहाँ हूँ। बताइए क्या मदद चाहिए?', en: 'Still here. How can I help?' },
        { hi: 'कोई बात नहीं, जब चाहें बोलिए।', en: 'No worries, speak whenever you\'re ready.' },
    ];

    const startRePromptTimer = useCallback(() => {
        clearTimeout(rePromptTimerRef.current);
        if (!isActiveRef.current) return;
        rePromptTimerRef.current = setTimeout(async () => {
            if (!isActiveRef.current || processingRef.current || isSpeakingRef.current) return;
            const idx = Math.min(rePromptCountRef.current, RE_PROMPTS.length - 1);
            const rp = RE_PROMPTS[idx];
            const text = rp[langRef.current] || rp.en;
            log(`🔁 Re-prompt #${rePromptCountRef.current + 1}`);
            setLastReply(text);
            await ttsSpeak(text, langRef.current);
            rePromptCountRef.current++;
            if (isActiveRef.current && rePromptCountRef.current < 3) startRePromptTimer();
        }, 15000);
    }, [log, ttsSpeak]);

    // ══════════════════════════════════════════════════
    // RECOGNITION — Continuous, never paused
    // Barge-in processes transcript immediately
    // ══════════════════════════════════════════════════

    const startRecognition = useCallback(() => {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR || !isActiveRef.current) return;

        // Kill any existing recognition
        try { recognitionRef.current?.abort(); } catch { }
        recognitionRef.current = null;
        isRecognizingRef.current = false;

        // Generation counter prevents stale onend/onerror from restarting old instances
        const gen = ++recGenRef.current;

        const r = new SR();
        r.lang = SPEECH_LANGS[langRef.current] || 'hi-IN';
        r.continuous = true;
        r.interimResults = true;
        r.maxAlternatives = 1;

        r.onstart = () => {
            if (gen !== recGenRef.current) return; // stale
            log('🎧 Recognition started');
            isRecognizingRef.current = true;
            restartCountRef.current = 0;
            if (!isSpeakingRef.current) setStatus('listening');
        };

        r.onresult = (e) => {
            if (gen !== recGenRef.current) return; // stale

            const last = e.results[e.results.length - 1];

            // ═══ BARGE-IN (only on FINAL results, high confidence) ═══
            // NEVER barge-in on interim — assistant's own voice triggers false positives
            if (isSpeakingRef.current) {
                if (last.isFinal) {
                    const conf = last[0].confidence || 0;
                    const txt = last[0].transcript.trim();
                    const lastSpoken = (lastReply || '').toLowerCase();
                    const isSelfEcho = lastSpoken && lastSpoken.includes(txt.toLowerCase());
                    // Calculate overlap ratio between assistant reply and transcript
                    const lastWords = lastSpoken.split(/\s+/).filter(w => w.length > 2);
                    const tWords = txt.toLowerCase().split(/\s+/).filter(w => w.length > 2);
                    let matchRatio = 0;
                    if (lastWords.length > 0 && tWords.length > 0) {
                        const matchCount = tWords.filter(w => lastWords.includes(w)).length;
                        matchRatio = matchCount / tWords.length;
                    }
                    // Barge-in only when extremely confident, short overlap with assistant speech,
                    // and transcript isn't likely the assistant's own words.
                    if (conf > 0.85 && txt.length >= 3 && !isSelfEcho && matchRatio < 0.3) {
                        log(`🔇 Barge-in: "${txt}" (${(conf * 100).toFixed(0)}%) match=${(matchRatio * 100).toFixed(0)}%`);
                        stopAllTTS();
                        bargedInRef.current = true;
                        setStatus('listening');
                    } else {
                        log(`🔇 Ignored during TTS: "${txt}" conf=${(conf * 100).toFixed(0)}% match=${(matchRatio * 100).toFixed(0)}% selfEcho=${isSelfEcho}`);
                    }
                }
                // During TTS we ignore interim and most final results — do not process further
                return;
            }

            clearTimeout(rePromptTimerRef.current);

            if (last.isFinal) {
                const t = last[0].transcript.trim();
                const confidence = last[0].confidence || 0;

                // ═══ BILL PAGE CONFIRMATION BYPASS ═══
                // On bill pages, short confirmation words MUST pass through
                // (otherwise "hn", "haan", "ok" get filtered by length/noise checks)
                const onBillPage = window.location.pathname.includes('/bill/');
                // Match single or repeated confirm words (e.g., "hn", "hn hn", "haan haan", "हाँ") + payment words
                const confirmRegex = /^(hn|hnn|hm|ha|han|haan|ha+n|yes|theek|thik|ok|ji|pay|jama|bharo|karo|kar do|kr do|paisa|hnji|हाँ|हां|हँ)(?:\s+(hn|hnn|hm|ha|han|haan|ha+n|yes|theek|thik|ok|ji|pay|jama|bharo|karo|kar do|kr do|paisa|hnji|हाँ|हां|हँ))*$/i;
                const isConfirmOnBill = onBillPage && (confirmRegex.test(t) || t.toLowerCase().includes('upi') || t.toLowerCase().includes('cash') || t.toLowerCase().includes('card') || t.toLowerCase().includes('naqd'));

                if (!isConfirmOnBill) {
                    if (t.length < 3) return;
                    if (confidence > 0 && confidence < 0.5) { log(`🔇 Low conf: "${t}" (${(confidence * 100).toFixed(0)}%)`); return; }
                }

                // Expanded noise filter — catches ambient sounds, self-echo, filler, and digit TTS
                // (confirmation words on bill pages skip this filter)
                const NOISE = [
                    'hmm', 'hm', 'uh', 'uhh', 'ah', 'ahh', 'um', 'umm', 'oh', 'mm', 'aah',
                    'huh', 'aha', 'hehe', 'hmm hmm', 'ahem', 'tch', 'shh', 'ugh', 'ooh', 'eeh',
                    'the', 'a', 'an', 'is', 'it', 'i', 'me', 'my', 'so', 'but', 'and', 'or',
                    'na', 'nah', 'hmm hmm',
                    // Digit names (blind mode TTS — in case they leak through)
                    'ek', 'do', 'teen', 'char', 'paanch', 'chhah', 'saat', 'aath', 'nau', 'zero',
                    'saaf', 'mita diya', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
                ];
                if (!isConfirmOnBill && NOISE.includes(t.toLowerCase())) { log(`🔇 Noise: "${t}"`); return; }

                // ═══ SELF-ECHO DETECTION ═══
                // If transcript arrived within 800ms of TTS ending, likely self-echo
                if (Date.now() - ttsEndTimeRef.current < 800) {
                    log(`🔇 Post-TTS echo (${Date.now() - ttsEndTimeRef.current}ms): "${t}"`);
                    return;
                }
                // Check if transcript words significantly overlap with last spoken reply
                const lastWords = (lastReply || '').toLowerCase().split(/\s+/).filter(w => w.length > 2);
                const transcriptWords = t.toLowerCase().split(/\s+/).filter(w => w.length > 2);
                if (lastWords.length > 0 && transcriptWords.length > 0) {
                    const matchCount = transcriptWords.filter(w => lastWords.includes(w)).length;
                    const matchRatio = matchCount / transcriptWords.length;
                    if (matchRatio > 0.4) {
                        log(`🔇 Self-echo (${(matchRatio * 100).toFixed(0)}% match): "${t}"`);
                        return;
                    }
                }

                log(`📝 "${t}" (${(confidence * 100).toFixed(0)}%)`);
                lastInterimRef.current = '';
                setInterimText('');
                clearTimeout(silenceTimerRef.current);

                if (processingRef.current) {
                    log(`📥 Queued: "${t}"`);
                    pendingTranscriptRef.current = t;
                } else {
                    handleTranscript(t);
                }
            } else {
                lastInterimRef.current = last[0].transcript;
                setInterimText(last[0].transcript);
                if (!isSpeakingRef.current) setStatus('listening');

                clearTimeout(silenceTimerRef.current);
                silenceTimerRef.current = setTimeout(() => {
                    const t = lastInterimRef.current?.trim();
                    if (t && t.length > 2 && !processingRef.current && !isSpeakingRef.current) {
                        log(`⏱️ Silence commit: "${t}"`);
                        handleTranscript(t);
                        lastInterimRef.current = '';
                        setInterimText('');
                    }
                }, 1800);
            }
        };

        r.onerror = (e) => {
            if (gen !== recGenRef.current) return; // stale
            isRecognizingRef.current = false;
            // no-speech and aborted are normal — restart quickly
            if (['no-speech', 'aborted'].includes(e.error)) {
                if (isActiveRef.current) setTimeout(() => startRecognition(), 150);
                return;
            }
            log(`⚠️ Rec error: ${e.error}`);
            if (isActiveRef.current) setTimeout(() => startRecognition(), 300);
        };

        r.onend = () => {
            if (gen !== recGenRef.current) return; // stale — new instance superseded us
            isRecognizingRef.current = false;
            recognitionRef.current = null;
            // NEVER restart during TTS — prevents self-listening
            if (isActiveRef.current && !isSpeakingRef.current) {
                setTimeout(() => startRecognition(), 80);
            }
        };

        recognitionRef.current = r;
        try {
            r.start();
        } catch (err) {
            log(`⚠️ Rec start fail: ${err.message}`);
            isRecognizingRef.current = false;
            recognitionRef.current = null;
            if (isActiveRef.current) setTimeout(() => startRecognition(), 300);
        }
    }, [log, stopAllTTS]);

    // ═══ BRIDGE: Restart recognition after TTS via custom event ═══
    // This avoids circular dependency between ttsSpeak and startRecognition
    useEffect(() => {
        const handler = () => {
            if (isActiveRef.current && !isRecognizingRef.current && !isSpeakingRef.current) {
                startRecognition();
            }
        };
        window.addEventListener('va-restart-recognition', handler);
        return () => window.removeEventListener('va-restart-recognition', handler);
    }, [startRecognition]);

    // ══════════════════════════════════════════════════
    // HANDLE TRANSCRIPT — Direct to Gemini
    // ══════════════════════════════════════════════════
    // 1. Clean & deduplicate input
    // 2. Filter noise
    // 3. Send directly to Gemini

    const handleTranscript = useCallback(async (rawTranscript) => {
        const L = langRef.current;

        // ═══ STEP 1: Clean input ═══
        const cleaned = rawTranscript.toLowerCase().trim()
            .replace(/^[?!.,:;'"]+|[?!.,:;'"]+$/g, '')  // remove edge punctuation
            .split(/\s+/).filter((w, i, arr) => w !== arr[i - 1]).join(' ')  // deduplicate consecutive words
            .trim();

        if (!cleaned || cleaned.length < 3) return;

        // Extended noise filter at transcript level too
        const NOISE_WORDS = [
            'hmm', 'hm', 'uh', 'uhh', 'ah', 'ahh', 'um', 'umm', 'oh', 'mm', 'ha', 'aah',
            'huh', 'the', 'a', 'an', 'is', 'it', 'so', 'but', 'and',
        ];
        if (NOISE_WORDS.includes(cleaned)) return;

        // Simple deduplication: skip if same text within 500ms
        const now = Date.now();
        if (cleaned === lastProcessedRef.current && (now - lastProcessedTimeRef.current) < 500) {
            log(`🔇 Duplicate: "${cleaned}"`);
            return;
        }
        lastProcessedRef.current = cleaned;
        lastProcessedTimeRef.current = now;

        if (processingRef.current) return;
        processingRef.current = true;
        bargedInRef.current = false;
        pendingTranscriptRef.current = null;
        clearTimeout(rePromptTimerRef.current);

        setLastTranscript(cleaned);
        setInterimText('');
        lastInterimRef.current = '';
        setStatus('processing');
        log(`🎤 "${cleaned}"`);

        // Helper: speak and check barge-in
        const say = async (text) => {
            if (!text || bargedInRef.current) return;
            setLastReply(text);
            await ttsSpeak(text, L);
        };

        // Helper: finish processing and check pending queue
        const done = () => {
            processingRef.current = false;
            isSpeakingRef.current = false;
            const pending = pendingTranscriptRef.current;
            if (pending && isActiveRef.current) {
                pendingTranscriptRef.current = null;
                log(`📤 Pending: "${pending}"`);
                setTimeout(() => handleTranscript(pending), 50);
                return;
            }
            if (isActiveRef.current && !bargedInRef.current) {
                setStatus('listening');
                startRePromptTimer();
                log('🔄 Restarting recognition...');
                recGenRef.current++;
                try {
                    if (recognitionRef.current) {
                        recognitionRef.current.abort();
                    }
                } catch (e) {
                    log(`⚠️ Abort error: ${e.message}`);
                }
                recognitionRef.current = null;
                isRecognizingRef.current = false;
                setTimeout(() => {
                    if (isActiveRef.current) {
                        startRecognition();
                    }
                }, 50);
            }
        };

        // ═══ DIRECT GEMINI — All queries go here ═══
        try {
            log(`🌐 Gemini...`);
            playClickSound();
            hasInteractedRef.current = true;

            const result = await getAssistantGuidance(
                cleaned,
                screenRef.current,
                window.location.pathname,
                L,
                historyRef.current,
                blindModeRef.current,
                pageDataRef.current
            );

            historyRef.current = [
                ...historyRef.current.slice(-8),
                `User: ${cleaned}`,
                `Assistant: ${result.text || ''}`
            ];

            if (result.text && !bargedInRef.current) {
                await say(result.text);
            }

            if (!bargedInRef.current && result.action) {
                executeAction(result.action, result.params);
            }

        } catch (err) {
            log(`❌ Error: ${err.message}`);
            if (!bargedInRef.current) {
                const msg = L === 'hi'
                    ? 'माफ़ कीजिए, कुछ समस्या हुई। कृपया फिर से बोलिए।'
                    : 'Sorry, there was an issue. Please try again.';
                await say(msg);
            }
        }

        done();
    }, [log, ttsSpeak, startRePromptTimer]);

    // ═══ FORCE RESTART RECOGNITION ═══
    // Unconditional: abort whatever exists, start fresh
    const forceRestartRecognition = useCallback(() => {
        if (!isActiveRef.current) return;
        log('🔄 Force-restarting recognition');
        try { recognitionRef.current?.abort(); } catch { }
        recognitionRef.current = null;
        isRecognizingRef.current = false;
        setTimeout(() => startRecognition(), 150);
    }, [log, startRecognition]);

    // ═══ ENSURE RECOGNITION IS ALIVE ═══
    // Checks the ACTUAL running state, not just object existence
    const ensureRecognitionAlive = useCallback(() => {
        if (!isActiveRef.current) return;
        if (!isRecognizingRef.current) {
            log('🔄 Recognition not running, force-restarting');
            forceRestartRecognition();
        }
    }, [log, forceRestartRecognition]);

    // ══════════════════════════════════════════════════
    // ACTION EXECUTOR — maps Gemini actions to navigation
    // ══════════════════════════════════════════════════

    const executeAction = useCallback((action, params) => {
        // Set skip flag for ALL navigation actions — prevents double page announcements
        const NAV_ACTIONS = [
            'navigate_to_gateway', 'set_screen_guest', 'set_screen_citizen_auth',
            'navigate_bill_electricity', 'navigate_bill_water', 'navigate_bill_gas',
            'navigate_complaint', 'navigate_property_tax', 'navigate_naam_change',
            'navigate_new_connection', 'navigate_home', 'navigate_admin', 'go_back',
            'navigate', 'set_screen',
            'navigate_schemes', 'navigate_pm_kisan', 'navigate_ayushman',
            'navigate_jal_jeevan', 'navigate_pm_awas', 'navigate_ujjwala',
            'navigate_documents', 'navigate_income_cert', 'navigate_residence_cert',
            'navigate_caste_cert', 'navigate_birth_cert',
            'navigate_gas_services', 'navigate_electricity_services',
            'navigate_municipal', 'navigate_fastag',
        ];
        if (NAV_ACTIONS.includes(action)) {
            skipNextProactiveRef.current = true;
        }

        switch (action) {
            case 'navigate_to_gateway':
                setScreen('gateway');
                break;
            case 'set_screen_guest':
                setScreen('guest');
                navigate('/');
                break;
            case 'set_screen_citizen_auth':
                setScreen('citizen-auth');
                break;
            case 'navigate_bill_electricity':
                setScreen('guest');
                navigate('/bill/electricity');
                break;
            case 'navigate_bill_water':
                setScreen('guest');
                navigate('/bill/water');
                break;
            case 'navigate_bill_gas':
                setScreen('guest');
                navigate('/bill/gas');
                break;
            case 'navigate_complaint':
                // Complaint requires citizen login
                setPendingIntent?.('complaint');
                if (citizen) {
                    setScreen('guest');
                    navigate('/complaint');
                    log('📝 Redirecting to complaint (already logged in)');
                } else {
                    setScreen('citizen-auth');
                    log('🔐 Redirecting to citizen login for complaint');
                }
                break;
            case 'navigate_property_tax':
                setScreen('guest');
                navigate('/bill/property-tax');
                log('🏠 Redirecting to property tax');
                break;
            case 'navigate_naam_change':
                setPendingIntent?.('naam_change');
                if (citizen) {
                    setScreen('guest');
                    navigate('/name-change');
                    log('✨ Redirecting to name change form (already logged in)');
                } else {
                    setScreen('citizen-auth');
                    log('🔐 Redirecting to citizen login for name change');
                }
                break;
            case 'navigate_new_connection':
                setPendingIntent?.('new_connection');
                if (citizen) {
                    setScreen('guest');
                    navigate('/new-connection');
                    log('✨ Redirecting to new connection form (already logged in)');
                } else {
                    setScreen('citizen-auth');
                    log('🔐 Redirecting to citizen login for new connection');
                }
                break;
            case 'navigate_home':
                navigate('/');
                log('🏠 Redirecting to home');
                break;
            case 'navigate_admin':
                navigate('/admin');
                log('⚙️ Redirecting to admin');
                break;
            case 'go_back':
                navigate(-1);
                break;

            // ═══ NEW DEPARTMENT NAVIGATION ═══
            case 'navigate_schemes': setScreen('guest'); navigate('/schemes'); break;
            case 'navigate_pm_kisan': setScreen('guest'); navigate('/schemes/pm-kisan'); break;
            case 'navigate_ayushman': setScreen('guest'); navigate('/schemes/ayushman'); break;
            case 'navigate_jal_jeevan': setScreen('guest'); navigate('/schemes/jal-jeevan'); break;
            case 'navigate_pm_awas': setScreen('guest'); navigate('/schemes/pm-awas'); break;
            case 'navigate_ujjwala': setScreen('guest'); navigate('/schemes/ujjwala'); break;
            case 'navigate_documents': setScreen('guest'); navigate('/documents'); break;
            case 'navigate_income_cert': setScreen('guest'); navigate('/documents/income'); break;
            case 'navigate_residence_cert': setScreen('guest'); navigate('/documents/residence'); break;
            case 'navigate_caste_cert': setScreen('guest'); navigate('/documents/caste'); break;
            case 'navigate_birth_cert': setScreen('guest'); navigate('/documents/birth'); break;
            case 'navigate_gas_services': setScreen('guest'); navigate('/gas-services'); break;
            case 'navigate_electricity_services': setScreen('guest'); navigate('/electricity-services'); break;
            case 'navigate_municipal': setScreen('guest'); navigate('/municipal'); break;
            case 'navigate_fastag': setScreen('guest'); navigate('/fastag'); break;
            case 'stop_voice':
                deactivateVoice();
                break;

            // ═══ BILL FLOW ACTIONS ═══
            case 'confirm_pay':
            case 'confirm_yes':
                // Dispatch to BillPayment (it will ignore the one that doesn't apply to its current step)
                window.dispatchEvent(new CustomEvent('va-bill-action', { detail: { action: 'confirm_pay' } }));
                window.dispatchEvent(new CustomEvent('va-bill-action', { detail: { action: 'fetch_bill' } }));
                break;
            case 'confirm_no':
                break; // Do nothing, just acknowledge
            case 'pay_upi':
                window.dispatchEvent(new CustomEvent('va-bill-action', { detail: { action: 'pay_upi' } }));
                break;
            case 'pay_cash':
                window.dispatchEvent(new CustomEvent('va-bill-action', { detail: { action: 'pay_cash' } }));
                break;
            case 'pay_card':
                window.dispatchEvent(new CustomEvent('va-bill-action', { detail: { action: 'pay_card' } }));
                break;
            case 'fetch_bill':
                window.dispatchEvent(new CustomEvent('va-bill-action', { detail: { action: 'fetch_bill' } }));
                break;

            default:
                if (action === 'navigate' && params?.route) {
                    navigate(params.route);
                } else if (action === 'set_screen' && params?.screen) {
                    setScreen(params.screen);
                }
                break;
        }
    }, [navigate, setScreen, citizen, setPendingIntent]);

    // ══════════════════════════════════════════════════
    // SCREEN/ROUTE CHANGE → Proactive help
    // Ensures recognition stays alive after changes
    // ══════════════════════════════════════════════════

    useEffect(() => {
        if (!isActiveRef.current || !voiceMode) return;
        if (screen === lastScreenRef.current) return;

        const prevScreen = lastScreenRef.current;
        lastScreenRef.current = screen;
        log(`📺 Screen: ${prevScreen} → ${screen}`);

        if (!prevScreen || screen === 'idle') return;

        // Skip if voice-initiated navigation already spoke guidance
        if (skipNextProactiveRef.current) {
            skipNextProactiveRef.current = false;
            log('📺 Skipping proactive help (voice-initiated)');
            return;
        }

        // Cancel old TTS immediately
        stopAllTTS();
        bargedInRef.current = true;

        // Success sound on auth completion
        if (prevScreen === 'citizen-auth' && screen === 'citizen-dashboard') {
            playSuccessSound();
        }

        const speakGuidance = async () => {
            if (!isActiveRef.current) return;
            bargedInRef.current = false;

            // ALWAYS ensure recognition is running after screen change
            ensureRecognitionAlive();

            try {
                const proactive = await getProactiveHelp(
                    screen,
                    window.location.pathname,
                    langRef.current,
                    historyRef.current,
                    blindModeRef.current,
                    pageDataRef.current
                );
                if (proactive.text && isActiveRef.current && !bargedInRef.current) {
                    setLastReply(proactive.text);
                    await ttsSpeak(proactive.text, langRef.current);
                    if (isActiveRef.current) {
                        setStatus('listening');
                        startRePromptTimer();
                        ensureRecognitionAlive();
                    }
                } else if (isActiveRef.current) {
                    setStatus('listening');
                    startRePromptTimer();
                    ensureRecognitionAlive();
                }
            } catch (err) {
                log(`⚠️ Proactive help error: ${err.message}`);
                if (isActiveRef.current) {
                    setStatus('listening');
                    startRePromptTimer();
                    ensureRecognitionAlive();
                }
            }
        };

        setTimeout(speakGuidance, 600);
    }, [screen, voiceMode, log, ttsSpeak, stopAllTTS, startRePromptTimer, startRecognition, ensureRecognitionAlive]);

    // Route change → proactive help
    useEffect(() => {
        if (!isActiveRef.current || !voiceMode) return;
        const currentPath = location.pathname;
        if (currentPath === lastRouteRef.current) return;

        const prevPath = lastRouteRef.current;
        lastRouteRef.current = currentPath;
        log(`📍 Route: ${prevPath} → ${currentPath}`);

        // Skip if voice-initiated navigation already spoke guidance
        if (skipNextProactiveRef.current) {
            skipNextProactiveRef.current = false;
            log('📍 Skipping proactive help (voice-initiated)');
            return;
        }

        stopAllTTS();
        bargedInRef.current = true;

        const speakGuidance = async () => {
            if (!isActiveRef.current) return;
            bargedInRef.current = false;

            // ALWAYS ensure recognition is running after route change
            ensureRecognitionAlive();

            try {
                const proactive = await getProactiveHelp(
                    screenRef.current,
                    currentPath,
                    langRef.current,
                    historyRef.current,
                    blindModeRef.current,
                    pageDataRef.current
                );
                if (proactive.text && isActiveRef.current && !bargedInRef.current) {
                    setLastReply(proactive.text);
                    await ttsSpeak(proactive.text, langRef.current);
                    if (isActiveRef.current) {
                        setStatus('listening');
                        startRePromptTimer();
                        ensureRecognitionAlive();
                    }
                } else if (isActiveRef.current) {
                    setStatus('listening');
                    ensureRecognitionAlive();
                }
            } catch (err) {
                log(`⚠️ Route guidance error: ${err.message}`);
                if (isActiveRef.current) {
                    setStatus('listening');
                    ensureRecognitionAlive();
                }
            }
        };

        setTimeout(speakGuidance, 400);
    }, [location.pathname, voiceMode, log, ttsSpeak, stopAllTTS, startRecognition, startRePromptTimer, ensureRecognitionAlive]);

    // ═══ BILL STEP VOICE GUIDE ═══
    // Listens for bill payment step changes and speaks relevant details
    useEffect(() => {
        if (!isActive || !voiceMode) return;

        const handler = async (e) => {
            const d = e.detail;
            if (!d || !isActiveRef.current) return;
            // Skip initial mount (input step) — no need to speak
            if (d.currentStep === 'input') return;
            const L = langRef.current;
            const isHi = L !== 'en';

            let text = '';

            if (d.currentStep === 'bill' && d.billFound) {
                // Bill details page — read the bill
                const firstChar = d.consumerName.charAt(0).toUpperCase();
                const spokenId = d.consumerId ? d.consumerId.split('').join(' ') : '';

                if (citizen) {
                    text = isHi
                        ? `बिल मिल गया। खाता संख्या ${spokenId}। धारक का नाम ${d.consumerName} है। कुल राशि ${d.amount} रुपये है। क्या आप इसे जमा करना चाहते हैं? हाँ या ना बोलिए।`
                        : `Bill found. Account ${spokenId}. Name is ${d.consumerName}. Amount to pay is ₹${d.amount}. Would you like to pay? Say yes or no.`;
                } else {
                    text = isHi
                        ? `बिल मिल गया। खाता संख्या ${spokenId}। सुरक्षा के लिए नाम छिपाया गया है, जिसके नाम का पहला अक्षर ${firstChar} है। कुल राशि ${d.amount} रुपये है। क्या यह आपका बिल है? हाँ या ना बोलिए।`
                        : `Bill found. Account ${spokenId}. For security, the name is hidden, starting with letter ${firstChar}. Amount is ₹${d.amount}. Is this your bill? Say yes or no.`;
                }
            } else if (d.currentStep === 'pay' && !d.paymentMethod) {
                // Payment method selection
                text = isHi
                    ? `ठीक है, पैसा भुगतान करें, आप कैश, कार्ड, और UPI बोल कर सेलेक्ट कर सकते हैं।`
                    : `Okay, proceed to payment. You can select Cash, Card, or UPI by speaking.`;
            } else if (d.currentStep === 'success' && d.paymentComplete) {
                // Payment success
                text = isHi
                    ? `पेमेंट सफल हो गई! लेन-देन नंबर ${d.transactionId}। रसीद डाउनलोड कर सकते हैं। होम पेज पर जाने के लिए बोलिए।`
                    : `Payment successful! Transaction ID: ${d.transactionId}. You can download the receipt. Say home to go back.`;
            }

            if (text) {
                // Small delay to let UI render first
                await new Promise(r => setTimeout(r, 500));
                if (isActiveRef.current && !bargedInRef.current) {
                    stopAllTTS();
                    setLastReply(text);
                    await ttsSpeak(text, L);
                    if (isActiveRef.current) {
                        setStatus('listening');
                        startRePromptTimer();
                    }
                }
            }
        };

        window.addEventListener('va-bill-step', handler);
        return () => window.removeEventListener('va-bill-step', handler);
    }, [isActive, voiceMode, ttsSpeak, stopAllTTS, startRePromptTimer, log]);

    // ═══ DIGIT TTS GUARD ═══
    // When BillPayment/AuthScreen speaks a digit, mark as speaking
    // so recognition ignores the sound
    useEffect(() => {
        const onStart = () => { isSpeakingRef.current = true; };
        const onEnd = () => {
            // Small delay to let audio fully stop before allowing recognition
            setTimeout(() => { isSpeakingRef.current = false; }, 200);
        };
        window.addEventListener('va-digit-start', onStart);
        window.addEventListener('va-digit-end', onEnd);
        return () => {
            window.removeEventListener('va-digit-start', onStart);
            window.removeEventListener('va-digit-end', onEnd);
        };
    }, []);

    // ═══ PERIODIC RECOGNITION HEALTH CHECK (1.5s) ═══
    // Runs ALWAYS while active — checks every 1.5s and force-restarts if dead
    useEffect(() => {
        if (!isActive) return;
        const interval = setInterval(() => {
            if (!isActiveRef.current) return;
            // NEVER restart during TTS — prevents self-listening
            if (!isRecognizingRef.current && !processingRef.current && !isSpeakingRef.current) {
                log('🔄 Health check: recognition dead → force-restarting');
                try { recognitionRef.current?.abort(); } catch { }
                recognitionRef.current = null;
                isRecognizingRef.current = false;
                startRecognition();
            }
        }, 1500);
        return () => clearInterval(interval);
    }, [isActive, startRecognition, log]);

    // ═══ ACTIVATE ═══════════════════════════════════

    const activateVoice = useCallback(async () => {
        if (isActiveRef.current) return;
        isActiveRef.current = true;
        setIsActive(true);
        setLastTranscript('');
        setLastReply('');
        setInterimText('');
        stopAllTTS();
        restartCountRef.current = 0;
        rePromptCountRef.current = 0;
        lastRouteRef.current = window.location.pathname;
        lastScreenRef.current = screen;
        pendingTranscriptRef.current = null;
        historyRef.current = [];
        initialGreetingDoneRef.current = false;
        log('🟢 Activated');

        // Start recognition FIRST so it's ready when greeting ends
        startRecognition();

        // Feature-listing greeting — tells user what services are available
        // Barge-in is active so user can interrupt as soon as they hear their need
        const isBlind = blindModeRef.current;
        let greeting;
        if (isBlind) {
            greeting = langRef.current === 'hi'
                ? 'नमस्ते! मैं सुविधा हूँ, आपकी सहायक। यहाँ आप ये सब कर सकते हैं — बिजली, पानी, गैस का बिल भरना, नया कनेक्शन लेना, नाम बदलवाना, Property Tax भरना, शिकायत दर्ज करना, और रसीद डाउनलोड करना। जब चाहें बीच में बोल दीजिए, मैं सुन रही हूँ। बताइए क्या करना है?'
                : 'Hello! I\'m SUVIDHA, your assistant. Here you can pay electricity, water, gas bills, apply for new connections, change names, pay property tax, file complaints, and download receipts. Feel free to interrupt anytime — I\'m listening. What would you like to do?';
        } else {
            greeting = langRef.current === 'hi'
                ? 'नमस्ते! मैं सुविधा हूँ। यहाँ आप बिजली, पानी, गैस बिल भर सकते हैं, शिकायत दर्ज कर सकते हैं, नया कनेक्शन ले सकते हैं, नाम बदलवा सकते हैं, और Property Tax भर सकते हैं। बताइए क्या करना है?'
                : 'Hello! I\'m SUVIDHA. You can pay electricity, water, gas bills, file complaints, apply for new connections, change names, and pay property tax. What would you like to do?';
        }

        setLastReply(greeting);
        setStatus('speaking');
        await ttsSpeak(greeting, langRef.current);

        if (isActiveRef.current) {
            initialGreetingDoneRef.current = true;
            log('📢 Listening');
            setStatus('listening');
            // Force-restart recognition after greeting TTS
            startRecognition();
            startRePromptTimer();
        }
    }, [screen, startRecognition, startRePromptTimer, log, ttsSpeak, stopAllTTS]);

    // ═══ DEACTIVATE ═════════════════════════════════

    const deactivateVoice = useCallback(() => {
        isActiveRef.current = false;
        setIsActive(false);
        setStatus('idle');
        setInterimText('');
        isSpeakingRef.current = false;
        processingRef.current = false;
        pendingTranscriptRef.current = null;
        stopAllTTS();
        clearTimeout(silenceTimerRef.current);
        clearTimeout(rePromptTimerRef.current);
        try { recognitionRef.current?.abort(); } catch { }
        recognitionRef.current = null;
        resetChatSession();
        log('🔴 Deactivated');
    }, [log, stopAllTTS]);

    // Auto-activate
    useEffect(() => {
        if (voiceMode && !isActiveRef.current && screen !== 'idle') {
            log('🔄 Auto-activate');
            activateVoice();
        }
    }, [voiceMode, screen, activateVoice, log]);

    // Cleanup
    useEffect(() => {
        return () => {
            isActiveRef.current = false;
            try { recognitionRef.current?.abort(); } catch { }
            recognitionRef.current = null;
            stopAllTTS();
            clearTimeout(rePromptTimerRef.current);
            clearTimeout(silenceTimerRef.current);
        };
    }, [stopAllTTS]);

    const ctx = {
        voiceMode, isActive, status, lastTranscript, lastReply,
        blindMode: blindModeProp || false,
        setBlindMode: setBlindModeProp || (() => { }),
        pageData, setPageData,
        activate: activateVoice, deactivate: deactivateVoice,
    };

    return (
        <VoiceContext.Provider value={ctx}>
            {children}

            {isActive && (
                <div className={`vo-bar vo-bar-${status}`}>
                    <div className="vo-bar-left">
                        {status === 'listening' && (
                            <>
                                <div className="vo-pulse" />
                                <span className="vo-bar-label">
                                    {interimText ? `"${interimText}"` : (lang === 'hi' ? '🎧 बोलिए...' : '🎧 Speak...')}
                                </span>
                            </>
                        )}
                        {status === 'processing' && (
                            <>
                                <div className="vo-spinner" />
                                <span className="vo-bar-label">{lang === 'hi' ? '🧠 समझ रहा हूँ...' : '🧠 Thinking...'}</span>
                            </>
                        )}
                        {status === 'speaking' && (
                            <>
                                <div className="vo-waves">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className="vo-wave" style={{ animationDelay: `${i * 0.12}s` }} />
                                    ))}
                                </div>
                                <span className="vo-bar-reply">
                                    {lastReply?.substring(0, 90)}{lastReply?.length > 90 ? '...' : ''}
                                </span>
                            </>
                        )}
                    </div>
                    <button className="vo-bar-close"
                        onClick={status === 'speaking'
                            ? () => { stopAllTTS(); bargedInRef.current = true; setStatus('listening'); }
                            : deactivateVoice}>
                        {status === 'speaking' ? '⏭' : '✕'}
                    </button>
                </div>
            )}
        </VoiceContext.Provider>
    );
});

export default VoiceAgent;
