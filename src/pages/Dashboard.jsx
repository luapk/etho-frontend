import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Eye, ChevronDown, ChevronUp, Download, AlertTriangle, MessageCircle, BookOpen, Subtitles, Lightbulb, Info, X, Sparkles } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import AudioWaveform from '../components/AudioWaveform';
import Footer from '../components/Footer';
import RatingWidget from '../components/RatingWidget';

const ZONE_CONFIG = {
  green: { label: 'LOW', color: '#22c55e', textClass: 'text-green-300' },
  yellow: { label: 'MODERATE', color: '#f59e0b', textClass: 'text-amber-300' },
  red: { label: 'ELEVATED', color: '#ef4444', textClass: 'text-red-300' }
};

// ============================================
// ENHANCED POV SUBTITLE SYSTEM
// Based on ethological research frameworks
// ============================================

// Object/Context translations through animal perception
const OBJECT_TRANSLATIONS = {
  // Food
  cake: "sweet-fat smell",
  treat: "the good thing",
  food: "food",
  chicken: "the best smell",
  meat: "prey smell",
  kibble: "my food",
  snack: "small good thing",
  
  // Technology
  phone: "the thing you stare at",
  tablet: "glowing rectangle",
  ipad: "flat light thing",
  tv: "moving picture box",
  vacuum: "LOUD FLOOR ENEMY",
  roomba: "floor creature that moves alone",
  camera: "eye thing pointing at me",
  
  // People
  stranger: "unknown human",
  visitor: "intruder at boundary",
  vet: "bad-place human",
  child: "small unpredictable human",
  mailman: "daily boundary intruder",
  delivery: "appears-then-vanishes human",
  
  // Animals
  squirrel: "SQUIRREL",
  bird: "flying prey",
  cat: "small non-dog",
  dog: "other dog",
  
  // Places/Objects
  leash: "outside happens",
  carrier: "trap box",
  car: "moving room",
  door: "boundary",
  window: "see-through barrier",
  bed: "my spot",
  couch: "the good sitting place",
  box: "perfect sitting container",
  toy: "play thing",
  ball: "chase thing"
};

// Short, readable translations by zone and context
const POV_TRANSLATIONS = {
  dog: {
    green: {
      relaxed: [
        "This is nice.",
        "Safe here.",
        "Good place. Good moment.",
        "Could stay like this.",
        "All is well.",
        "Comfortable.",
        "My person is here.",
        "Nothing to worry about."
      ],
      content: [
        "Yes. This.",
        "Exactly what I needed.",
        "Life is good right now.",
        "Perfect.",
        "Keep doing that.",
        "I approve."
      ],
      affection: [
        "My human.",
        "I feel safe with you.",
        "You're my person.",
        "We're good.",
        "I trust you."
      ],
      sleepy: [
        "Rest time.",
        "Getting cozy...",
        "Eyes heavy...",
        "Maybe a nap.",
        "Drifting..."
      ]
    },
    yellow: {
      alert: [
        "What was that?",
        "Checking...",
        "Something's different.",
        "Paying attention now.",
        "I heard something.",
        "Watching.",
        "Hmm."
      ],
      curious: [
        "Interesting...",
        "What's this?",
        "Need to investigate.",
        "New smell.",
        "Let me see.",
        "Sniff sniff."
      ],
      wanting: [
        "I would like that.",
        "Please?",
        "Are you going to share?",
        "I'm here. Noticing.",
        "That looks good.",
        "Watching for drops."
      ],
      frustrated: [
        "Come ON.",
        "Why is this taking so long?",
        "I've been patient.",
        "Hello? I'm waiting.",
        "This is hard."
      ],
      excited: [
        "Is it happening?!",
        "Oh! OH!",
        "This could be good!",
        "I can barely wait!",
        "YES?"
      ]
    },
    red: {
      fear: [
        "Too much.",
        "I don't like this.",
        "Need this to stop.",
        "Scared.",
        "Please no.",
        "Want to leave.",
        "Not safe."
      ],
      warning: [
        "Back off.",
        "I mean it.",
        "Don't.",
        "Final warning.",
        "STOP.",
        "No closer."
      ],
      overwhelm: [
        "Can't handle this.",
        "Shutting down.",
        "Everything is too much.",
        "Need space NOW.",
        "Overloaded."
      ],
      pain: [
        "Something hurts.",
        "Not right.",
        "Ow.",
        "Be gentle.",
        "Pain."
      ]
    }
  },
  cat: {
    green: {
      relaxed: [
        "Acceptable.",
        "This will do.",
        "Correct temperature.",
        "Good spot.",
        "I'll allow it.",
        "Fine."
      ],
      content: [
        "Adequate.",
        "Continue.",
        "This is mine now.",
        "Purr.",
        "Yes, this spot."
      ],
      affection: [
        "You may stay.",
        "Tolerable human.",
        "I trust you. For now.",
        "My human.",
        "Slow blink."
      ],
      sleepy: [
        "Nap time.",
        "Do not disturb.",
        "Resting.",
        "Leave me.",
        "Zzz."
      ]
    },
    yellow: {
      alert: [
        "What.",
        "Monitoring.",
        "I see that.",
        "Noted.",
        "Watching you.",
        "Ears forward."
      ],
      curious: [
        "Hmm.",
        "Investigating.",
        "New thing.",
        "Requires inspection.",
        "Let me assess."
      ],
      wanting: [
        "I want that.",
        "Feed me.",
        "Now, please.",
        "You're late.",
        "I'm waiting.",
        "The bowl is visible and empty."
      ],
      frustrated: [
        "Unacceptable.",
        "Why is this closed?",
        "Open it.",
        "I said NOW.",
        "This barrier offends me."
      ],
      hunting: [
        "Prey.",
        "Must catch.",
        "Can't reach. Frustrating.",
        "SO close.",
        "Chatter chatter."
      ]
    },
    red: {
      fear: [
        "THREAT.",
        "Bad. Very bad.",
        "Hide.",
        "Escape needed.",
        "No no no.",
        "Danger."
      ],
      warning: [
        "HISS.",
        "Stay away.",
        "I WILL scratch.",
        "Back. Off.",
        "Ears flat for a reason."
      ],
      overwhelm: [
        "Too much.",
        "Overstimulated.",
        "Done.",
        "ENOUGH.",
        "Leave me alone."
      ],
      pain: [
        "Hurts.",
        "Something wrong.",
        "Pain.",
        "Don't touch there.",
        "Ow."
      ]
    }
  }
};

// Get contextual translation based on video context
const getContextualTranslation = (context, zone, species, timestamp) => {
  const ctx = (context || '').toLowerCase();
  const speciesKey = (species || 'dog').toLowerCase();
  const translations = POV_TRANSLATIONS[speciesKey] || POV_TRANSLATIONS.dog;
  const zoneTranslations = translations[zone] || translations.yellow;
  
  // Determine sub-category from context
  let category = 'alert';
  
  if (zone === 'green') {
    if (ctx.includes('sleep') || ctx.includes('rest') || ctx.includes('nap')) category = 'sleepy';
    else if (ctx.includes('pet') || ctx.includes('cuddle') || ctx.includes('lap')) category = 'affection';
    else if (ctx.includes('eat') || ctx.includes('treat')) category = 'content';
    else category = 'relaxed';
  } else if (zone === 'yellow') {
    if (ctx.includes('food') || ctx.includes('treat') || ctx.includes('eat') || ctx.includes('kitchen')) category = 'wanting';
    else if (ctx.includes('play') || ctx.includes('excit') || ctx.includes('walk') || ctx.includes('leash')) category = 'excited';
    else if (ctx.includes('wait') || ctx.includes('door') || ctx.includes('frustrat')) category = 'frustrated';
    else if (ctx.includes('bird') || ctx.includes('prey') || ctx.includes('hunt') || ctx.includes('squirrel')) category = speciesKey === 'cat' ? 'hunting' : 'excited';
    else if (ctx.includes('smell') || ctx.includes('sniff') || ctx.includes('new')) category = 'curious';
    else category = 'alert';
  } else { // red
    if (ctx.includes('pain') || ctx.includes('hurt') || ctx.includes('vet')) category = 'pain';
    else if (ctx.includes('growl') || ctx.includes('hiss') || ctx.includes('guard') || ctx.includes('aggress')) category = 'warning';
    else if (ctx.includes('overwhelm') || ctx.includes('too much') || ctx.includes('stimulat')) category = 'overwhelm';
    else category = 'fear';
  }
  
  const options = zoneTranslations[category] || zoneTranslations[Object.keys(zoneTranslations)[0]] || ["..."];
  
  // Use timestamp to get consistent but varied selection
  const index = Math.floor((parseFloat(timestamp) || 0) * 10) % options.length;
  return options[index];
};

// Replace objects in context with animal-perception versions
const translateContext = (text) => {
  if (!text) return text;
  let result = text.toLowerCase();
  
  Object.entries(OBJECT_TRANSLATIONS).forEach(([human, animal]) => {
    const regex = new RegExp(`\\b${human}\\b`, 'gi');
    result = result.replace(regex, animal);
  });
  
  return result;
};

// Behavioral markers library
const MARKERS_LIBRARY = {
  dog: {
    stress: [
      { text: 'Whale Eye', zone: 'red', desc: 'Visible sclera - fear' },
      { text: 'Lip Licking', zone: 'yellow', desc: 'Displacement behavior' },
      { text: 'Stress Yawn', zone: 'yellow', desc: 'Non-fatigue tension' },
      { text: 'Ears Back', zone: 'red', desc: 'Fear signal' },
      { text: 'Body Tense', zone: 'yellow', desc: 'Arousal posture' },
      { text: 'Tail Tucked', zone: 'red', desc: 'Fear/submission' }
    ],
    alert: [
      { text: 'Ears Forward', zone: 'yellow', desc: 'Alert attention' },
      { text: 'Hard Stare', zone: 'yellow', desc: 'Fixed gaze' },
      { text: 'Tail High', zone: 'yellow', desc: 'Aroused posture' },
      { text: 'Weight Forward', zone: 'yellow', desc: 'Engaged' }
    ],
    relaxed: [
      { text: 'Soft Eyes', zone: 'green', desc: 'Relaxed facial muscles' },
      { text: 'Loose Body', zone: 'green', desc: 'No tension' },
      { text: 'Open Mouth', zone: 'green', desc: 'Relaxed breathing' },
      { text: 'Play Bow', zone: 'green', desc: 'Play invitation' }
    ]
  },
  cat: {
    stress: [
      { text: 'Ears Flat', zone: 'red', desc: 'Defensive posture' },
      { text: 'Dilated Pupils', zone: 'red', desc: 'Fear response' },
      { text: 'Tail Puffed', zone: 'red', desc: 'Fear piloerection' },
      { text: 'Back Arched', zone: 'red', desc: 'Defensive' }
    ],
    alert: [
      { text: 'Ears Forward', zone: 'yellow', desc: 'Alert' },
      { text: 'Tail Twitching', zone: 'yellow', desc: 'Agitation' },
      { text: 'Whiskers Forward', zone: 'yellow', desc: 'Hunting mode' }
    ],
    relaxed: [
      { text: 'Slow Blink', zone: 'green', desc: 'Trust signal' },
      { text: 'Kneading', zone: 'green', desc: 'Contentment' },
      { text: 'Purring', zone: 'green', desc: 'Self-soothing' },
      { text: 'Tail Up', zone: 'green', desc: 'Friendly' }
    ]
  }
};

// Breed facts database (condensed)
const BREED_FACTS = {
  'german shepherd': "German Shepherds can learn a command in under 5 repetitions.",
  'labrador': "Labs have webbed toes — bred for swimming after waterfowl.",
  'golden retriever': "Goldens have a 'soft mouth' — can carry eggs without breaking them.",
  'beagle': "Beagles have 220 million scent receptors vs. humans' 5 million.",
  'bulldog': "Bulldogs can't swim — their body shape makes them sink.",
  'poodle': "Poodles were originally water retrievers in Germany.",
  'husky': "Huskies can run 100+ miles per day in sled teams.",
  'siamese': "Siamese cats' color points are temperature-sensitive.",
  'persian': "Persians need daily grooming — their fur mats easily.",
  'maine coon': "Maine Coons are the largest domestic cat breed."
};

const getBreedFact = (breed) => {
  if (!breed) return null;
  const key = breed.toLowerCase();
  for (const [k, v] of Object.entries(BREED_FACTS)) {
    if (key.includes(k) || k.includes(key)) return v;
  }
  return null;
};

// Distress info modal
const DistressInfoModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card rounded-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-roboto font-bold text-xl text-white">Understanding the Distress Score</h3>
          <button onClick={onClose} className="text-white/50 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="space-y-4 text-sm">
          <div className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: 'rgba(34,197,94,0.15)' }}>
            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold flex-shrink-0">0-33</div>
            <div><p className="font-medium text-green-400">Low Distress</p><p className="text-white/70">Relaxed, content. Parasympathetic dominance.</p></div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: 'rgba(245,158,11,0.15)' }}>
            <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold flex-shrink-0">34-66</div>
            <div><p className="font-medium text-amber-400">Moderate</p><p className="text-white/70">Alert, aroused. Could be excitement or mild stress.</p></div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: 'rgba(239,68,68,0.15)' }}>
            <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-bold flex-shrink-0">67+</div>
            <div><p className="font-medium text-red-400">Elevated</p><p className="text-white/70">Clear distress signals. Consider intervention.</p></div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Simple subtitle toggle (on/off only)
const SubtitleToggle = ({ enabled, onChange }) => (
  <button
    onClick={() => onChange(!enabled)}
    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-roboto transition-all ${
      enabled 
        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500' 
        : 'bg-white/10 text-white/60 border border-white/20'
    }`}
  >
    <Subtitles className="w-4 h-4" />
    {enabled ? 'On' : 'Off'}
  </button>
);

// Main Dashboard component
function Dashboard({ analysisData, videoUrl }) {
  const videoRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [expandedSections, setExpandedSections] = useState({ audio: false, research: false, perspective: true });
  const [showDistressInfo, setShowDistressInfo] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(true);
  const [currentSubtitle, setCurrentSubtitle] = useState(null);

  // Extract data
  const { overall_assessment = {}, visual_analysis = {}, audio_analysis = {}, timeline = [], interpret_lines = [], advisory = {}, species, breed_detected, breed_confidence, video_context, video_type } = analysisData || {};
  const distressScore = overall_assessment?.distress_score ?? 50;
  const zone = overall_assessment?.zone || (distressScore <= 33 ? 'green' : distressScore <= 66 ? 'yellow' : 'red');
  const zoneConfig = ZONE_CONFIG[zone] || ZONE_CONFIG.yellow;
  const zoneLabel = ZONE_CONFIG[zone]?.label || 'MODERATE';

  // Video time tracking
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const handleTime = () => setCurrentTime(video.currentTime);
    const handleMeta = () => setDuration(video.duration);
    video.addEventListener('timeupdate', handleTime);
    video.addEventListener('loadedmetadata', handleMeta);
    return () => {
      video.removeEventListener('timeupdate', handleTime);
      video.removeEventListener('loadedmetadata', handleMeta);
    };
  }, [videoUrl]);

  // Subtitle logic
  useEffect(() => {
    if (!subtitlesEnabled || !analysisData?.interpret_lines) {
      setCurrentSubtitle(null);
      return;
    }

    const lines = analysisData.interpret_lines;
    const timelineData = analysisData.timeline || [];
    
    // Find current interpret line
    let currentLine = null;
    for (const line of lines) {
      const ts = parseTimestamp(line.timestamp);
      if (currentTime >= ts && currentTime < ts + 4) {
        currentLine = line;
        break;
      }
    }

    if (currentLine) {
      // Get zone from timeline or line
      const lineZone = currentLine.zone || zone;
      
      // Get contextual subtitle
      const context = currentLine.context || video_context || '';
      const translatedContext = translateContext(context);
      
      // Get POV translation
      const povText = getContextualTranslation(
        translatedContext,
        lineZone,
        species,
        currentLine.timestamp
      );
      
      setCurrentSubtitle({
        text: povText,
        zone: lineZone,
        key: currentLine.timestamp
      });
    } else {
      setCurrentSubtitle(null);
    }
  }, [currentTime, subtitlesEnabled, analysisData, zone, species, video_context]);

  // Parse timestamp helper
  const parseTimestamp = (ts) => {
    if (typeof ts === 'number') return ts;
    if (!ts) return 0;
    const parts = ts.split(':').map(Number);
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    return parseFloat(ts) || 0;
  };

  // Timeline markers for chart
  const markers = useMemo(() => {
    return timeline.map(t => ({
      time: parseTimestamp(t.timestamp),
      score: t.distress_score ?? distressScore,
      zone: t.zone || zone,
      label: t.context_tag || t.observation
    }));
  }, [timeline, distressScore, zone]);

  // Chart data
  const chartData = useMemo(() => {
    if (!duration || duration <= 0) return [];
    const points = [];
    const interval = Math.max(duration / 15, 1);
    for (let i = 0; i <= 15; i++) {
      const t = Math.min(i * interval, duration);
      const timeLabel = `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;
      const nearby = markers.filter(m => Math.abs(m.time - t) < interval);
      let score = nearby.length > 0 ? nearby.reduce((s, m) => s + m.score, 0) / nearby.length : distressScore;
      score = Math.max(5, Math.min(95, score + Math.sin(i * 0.3) * 5));
      const exact = markers.find(m => Math.abs(m.time - t) < 0.5);
      points.push({ time: timeLabel, timeSeconds: t, score: Math.round(score), marker: exact?.label || null, markerZone: exact?.zone || null });
    }
    return points;
  }, [duration, distressScore, markers]);

  // Behavior markers
  const behaviorMarkers = useMemo(() => {
    const lib = MARKERS_LIBRARY[(species || 'dog').toLowerCase()] || MARKERS_LIBRARY.dog;
    const matched = new Set();
    const result = [];
    
    // Match from analysis
    const texts = [
      ...(visual_analysis?.key_observations || []),
      ...(visual_analysis?.action_units_detected || []),
      ...(audio_analysis?.vocalizations_detected?.map(v => v.type) || [])
    ];
    
    texts.forEach(txt => {
      const l = (txt || '').toLowerCase();
      ['stress', 'alert', 'relaxed'].forEach(cat => {
        lib[cat]?.forEach(m => {
          if (!matched.has(m.text) && l.includes(m.text.toLowerCase().split(' ')[0])) {
            matched.add(m.text);
            result.push(m);
          }
        });
      });
    });
    
    // Fill with zone-appropriate markers
    const catMap = { red: 'stress', yellow: 'alert', green: 'relaxed' };
    lib[catMap[zone]]?.forEach(m => {
      if (result.length < 6 && !matched.has(m.text)) {
        matched.add(m.text);
        result.push(m);
      }
    });
    
    return result.slice(0, 6);
  }, [visual_analysis, audio_analysis, species, zone]);

  // Summary text
  const summary = useMemo(() => {
    return overall_assessment?.summary || 
      `Your ${species || 'pet'} shows ${zone === 'green' ? 'calm, relaxed behavior' : zone === 'yellow' ? 'alert, attentive behavior' : 'signs of distress'}.`;
  }, [overall_assessment, species, zone]);

  // Recommendation
  const recommendation = useMemo(() => {
    if (advisory?.detailed_recommendations?.length) return advisory.detailed_recommendations[0];
    if (zone === 'red') return `These signals indicate genuine discomfort. Give your ${species || 'pet'} space and consider consulting a behaviorist.`;
    if (zone === 'yellow') return `Your ${species || 'pet'} is alert and engaged. This is normal in many contexts.`;
    return `Your ${species || 'pet'} looks wonderfully content. Whatever you're doing, it's working!`;
  }, [zone, species, advisory]);

  const breedFact = getBreedFact(breed_detected);
  const breedDisplay = breed_detected ? (breed_confidence ? `${breed_detected} (${breed_confidence})` : breed_detected) : null;

  // PDF download
  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const html = `<!DOCTYPE html><html><head><title>Etho Report</title><style>body{font-family:sans-serif;max-width:700px;margin:0 auto;padding:40px}</style></head><body><h1 style="color:#3b82f6">ETHO</h1><p>Pet Behavior Analysis - ${new Date().toLocaleDateString()}</p><hr><p><b>Score:</b> ${distressScore}/100 (${zoneLabel})</p><p><b>Species:</b> ${species || 'Unknown'}${breedDisplay ? ` • ${breedDisplay}` : ''}</p><p>${summary}</p><p><b>Recommendation:</b> ${recommendation}</p></body></html>`;
      const blob = new Blob([html], { type: 'text/html' });
      const win = window.open(URL.createObjectURL(blob), '_blank');
      if (win) win.onload = () => win.print();
    } finally { setIsGeneratingPDF(false); }
  };

  // Jump to time
  const jumpToTime = (seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
      videoRef.current.play();
    }
  };

  return (
    <div className="min-h-screen">
      <DistressInfoModal isOpen={showDistressInfo} onClose={() => setShowDistressInfo(false)} />
      
      {/* Header */}
      <header className="py-6 px-6">
        <div className="max-w-5xl mx-auto flex flex-col items-center">
          <img src="/etho-logo.png" alt="Etho" className="h-10" onError={(e) => { e.target.style.display = 'none'; }} />
          <p className="font-roboto text-white/60 text-sm mt-2">AI-powered pet behavior analysis</p>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 pb-12 space-y-6">
        
        {/* Video with Subtitles */}
        {videoUrl && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl overflow-hidden">
            <div className="relative">
              <video 
                ref={videoRef} 
                src={videoUrl} 
                controls 
                className="w-full" 
                style={{ maxHeight: '450px', objectFit: 'contain', backgroundColor: 'rgba(0,0,0,0.3)' }} 
              />
              
              {/* POV Subtitle */}
              <AnimatePresence mode="wait">
                {subtitlesEnabled && currentSubtitle && (
                  <motion.div
                    key={currentSubtitle.key}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="absolute bottom-16 left-1/2 -translate-x-1/2 px-5 py-3 rounded-lg max-w-[85%] text-center"
                    style={{
                      backgroundColor: 'rgba(0,0,0,0.9)',
                      border: `2px solid ${ZONE_CONFIG[currentSubtitle.zone]?.color || '#fff'}`,
                      boxShadow: `0 0 20px ${ZONE_CONFIG[currentSubtitle.zone]?.color}50`
                    }}
                  >
                    <p className="font-roboto text-white text-base font-medium">
                      "{currentSubtitle.text}"
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Subtitle Toggle */}
            <div className="p-4 flex items-center justify-between border-t border-white/10">
              <div className="flex items-center gap-3">
                <Subtitles className="w-5 h-5 text-white/70" />
                <span className="font-roboto text-white text-sm">Pet's POV</span>
              </div>
              <SubtitleToggle enabled={subtitlesEnabled} onChange={setSubtitlesEnabled} />
            </div>
          </motion.div>
        )}

        {/* Assessment Panel */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-2xl overflow-hidden">
          <div className="px-6 py-3 flex items-center gap-3 border-b border-white/10" style={{ backgroundColor: `${zoneConfig.color}15` }}>
            <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: zoneConfig.color }}></span>
            <span className="font-roboto font-bold text-sm uppercase tracking-wider" style={{ color: zoneConfig.color }}>{zoneLabel} Distress</span>
            {species && <><span className="text-white/30">•</span><span className="text-white/70 text-sm">{species.charAt(0).toUpperCase() + species.slice(1)}{breedDisplay && ` • ${breedDisplay}`}</span></>}
          </div>
          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex flex-col items-center lg:items-start">
                <div className="w-24 h-24 rounded-xl border-2 flex flex-col items-center justify-center" style={{ borderColor: zoneConfig.color, backgroundColor: `${zoneConfig.color}15` }}>
                  <span className="font-roboto font-black text-4xl" style={{ color: zoneConfig.color }}>{distressScore}</span>
                  <span className="font-roboto text-[10px] uppercase tracking-wider text-white/60">{zoneLabel}</span>
                </div>
                <button onClick={() => setShowDistressInfo(true)} className="mt-2 flex items-center gap-1 text-white/40 hover:text-white/70 text-xs">
                  <Info className="w-3.5 h-3.5" />What's this?
                </button>
              </div>
              <div className="flex-1 space-y-4">
                <p className="font-roboto text-white leading-relaxed">{summary}</p>
                <div className="p-4 rounded-xl flex gap-3" style={{ backgroundColor: `${zoneConfig.color}10`, borderLeft: `3px solid ${zoneConfig.color}` }}>
                  <Lightbulb className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: zoneConfig.color }} />
                  <div>
                    <span className="font-roboto font-semibold text-white text-sm">Recommendation</span>
                    <p className="font-roboto text-white/75 text-sm leading-relaxed mt-1">{recommendation}</p>
                  </div>
                </div>
                <button onClick={handleDownloadPDF} disabled={isGeneratingPDF}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm border border-white/20 disabled:opacity-50">
                  <Download className="w-4 h-4" />{isGeneratingPDF ? 'Generating...' : 'Download Report'}
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Visual Timeline */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-roboto font-bold text-xl text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-white/70" />Visual Analysis
            </h2>
            <span className="text-xs text-white/50">Click chart to jump</span>
          </div>
          
          {/* Chart */}
          <div className="relative h-48 rounded-xl overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
            <div className="absolute inset-0 flex flex-col">
              <div className="flex-1" style={{ backgroundColor: 'rgba(239,68,68,0.15)' }}></div>
              <div className="flex-1" style={{ backgroundColor: 'rgba(245,158,11,0.15)' }}></div>
              <div className="flex-1" style={{ backgroundColor: 'rgba(34,197,94,0.15)' }}></div>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 15, right: 15, left: -20, bottom: 5 }} onClick={(e) => e?.activePayload?.[0] && jumpToTime(e.activePayload[0].payload.timeSeconds)}>
                <XAxis dataKey="time" stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 100]} stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} axisLine={false} ticks={[0, 33, 66, 100]} />
                <Tooltip content={({ active, payload }) => active && payload?.[0] ? (
                  <div className="bg-black/90 px-3 py-2 rounded-lg border border-white/20">
                    <p className="text-white text-sm font-bold">{payload[0].value}</p>
                    {payload[0].payload.marker && <p className="text-white/70 text-xs">{payload[0].payload.marker}</p>}
                  </div>
                ) : null} />
                <Line type="monotone" dataKey="score" stroke={zoneConfig.color} strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Behavior Markers */}
          <div className="mt-4">
            <h3 className="font-roboto text-white/70 text-sm mb-3">Detected Signals</h3>
            <div className="flex flex-wrap gap-2">
              {behaviorMarkers.map((marker, i) => (
                <span key={i} className="px-3 py-1.5 rounded-full text-xs font-roboto" style={{
                  backgroundColor: `${ZONE_CONFIG[marker.zone]?.color || '#94a3b8'}20`,
                  border: `1px solid ${ZONE_CONFIG[marker.zone]?.color || '#94a3b8'}`,
                  color: ZONE_CONFIG[marker.zone]?.color || '#94a3b8'
                }}>
                  {marker.text}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Pet's Perspective Panel */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-2xl overflow-hidden">
          <button onClick={() => setExpandedSections(s => ({ ...s, perspective: !s.perspective }))} className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-colors">
            <h2 className="font-roboto font-bold text-xl text-white flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-cyan-400" />Pet's Perspective
            </h2>
            {expandedSections.perspective ? <ChevronUp className="w-5 h-5 text-white/50" /> : <ChevronDown className="w-5 h-5 text-white/50" />}
          </button>
          {expandedSections.perspective && (
            <div className="px-6 pb-6 space-y-3">
              {interpret_lines.length > 0 ? interpret_lines.slice(0, 6).map((line, i) => {
                const lineZone = line.zone || zone;
                const context = line.context || video_context || '';
                const povText = getContextualTranslation(translateContext(context), lineZone, species, line.timestamp);
                return (
                  <button key={i} onClick={() => jumpToTime(parseTimestamp(line.timestamp))} className="w-full text-left p-3 rounded-lg hover:bg-white/5 transition-colors flex items-start gap-3">
                    <span className="font-mono text-white/50 text-xs mt-1">{line.timestamp}</span>
                    <div className="flex-1">
                      <p className="font-roboto text-white italic">"{povText}"</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-xs" style={{
                      backgroundColor: `${ZONE_CONFIG[lineZone]?.color}20`,
                      color: ZONE_CONFIG[lineZone]?.color
                    }}>{ZONE_CONFIG[lineZone]?.label}</span>
                  </button>
                );
              }) : (
                <p className="text-white/50 text-sm">No specific moments captured in this video.</p>
              )}
            </div>
          )}
        </motion.div>

        {/* Did You Know */}
        {breedFact && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card rounded-2xl p-6">
            <h2 className="font-roboto font-bold text-xl text-white flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-amber-400" />Did You Know?
            </h2>
            <p className="font-roboto text-white/80">{breedFact}</p>
          </motion.div>
        )}

        {/* Rating Widget */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex justify-center">
          <RatingWidget analysisId={Date.now().toString()} species={species} breed={breed_detected} distressScore={distressScore} />
        </motion.div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}

export default Dashboard;
