import React, { useState, useRef, useEffect } from 'react';
import {
  Film,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Heart,
  Share2,
  MapPin,
  AlertTriangle,
  ShieldCheck,
  Plus,
  Filter,
  CheckCircle2,
  MessageCircle,
  Eye,
  Trash2,
  Sparkles,
  Upload,
  Calendar,
  Layers,
  ChevronDown,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Info
} from 'lucide-react';
import { DisasterReel } from '../../types';
import { db } from '../../services/mockBackendApi';
import { permanentMediaDb } from '../../services/indexedDbMedia';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export const KARNATAKA_DISTRICTS_LIST = [
  { name: 'Kalaburagi', kannadaName: 'ಕಲಬುರಗಿ' },
  { name: 'Belagavi', kannadaName: 'ಬೆಳಗಾವಿ' },
  { name: 'Vijayapura', kannadaName: 'ವಿಜಯಪುರ' },
  { name: 'Raichur', kannadaName: 'ರಾಯಚೂರು' },
  { name: 'Bagalkot', kannadaName: 'ಬಾಗಲಕೋಟೆ' },
  { name: 'Ballari', kannadaName: 'ಬಳ್ಳಾರಿ' },
  { name: 'Bidar', kannadaName: 'ಬೀದರ್' },
  { name: 'Dharwad', kannadaName: 'ಧಾರವಾಡ' },
  { name: 'Gadag', kannadaName: 'ಗದಗ' },
  { name: 'Haveri', kannadaName: 'ಹಾವೇರಿ' },
  { name: 'Koppal', kannadaName: 'ಕೊಪ್ಪಳ' },
  { name: 'Vijayanagara', kannadaName: 'ವಿಜಯನಗರ' },
  { name: 'Yadgir', kannadaName: 'ಯಾದಗಿರಿ' },
  { name: 'Shivamogga', kannadaName: 'ಶಿವಮೊಗ್ಗ' },
  { name: 'Uttara Kannada', kannadaName: 'ಉತ್ತರ ಕನ್ನಡ' },
  { name: 'Udupi', kannadaName: 'ಉಡುಪಿ' },
  { name: 'Dakshina Kannada', kannadaName: 'ದಕ್ಷಿಣ ಕನ್ನಡ' },
  { name: 'Kodagu', kannadaName: 'ಕೊಡಗು' },
  { name: 'Chikkamagaluru', kannadaName: 'ಚಿಕ್ಕಮಗಳೂರು' },
  { name: 'Hassan', kannadaName: 'ಹಾಸನ' },
  { name: 'Mysuru', kannadaName: 'ಮೈಸೂರು' },
  { name: 'Mandya', kannadaName: 'ಮಂಡ್ಯ' },
  { name: 'Chamarajanagar', kannadaName: 'ಚಾಮರಾಜನಗರ' },
  { name: 'Tumakuru', kannadaName: 'ತುಮಕೂರು' },
  { name: 'Chitradurga', kannadaName: 'ಚಿತ್ರದುರ್ಗ' },
  { name: 'Davanagere', kannadaName: 'ದಾವಣಗೆರೆ' },
  { name: 'Kolar', kannadaName: 'ಕೋಲಾರ' },
  { name: 'Chikkaballapura', kannadaName: 'ಚಿಕ್ಕಬಳ್ಳಾಪುರ' },
  { name: 'Ramanagara', kannadaName: 'ರಾಮನಗರ' },
  { name: 'Bengaluru Rural', kannadaName: 'ಬೆಂಗಳೂರು ಗ್ರಾಮಾಂತರ' },
  { name: 'Bengaluru Urban', kannadaName: 'ಬೆಂಗಳೂರು ನಗರ' },
];

interface DisasterReelsViewProps {
  onReportLoss?: () => void;
  onRequestHelp?: () => void;
}

export const DisasterReelsView: React.FC<DisasterReelsViewProps> = ({
  onReportLoss,
  onRequestHelp,
}) => {
  const { currentUser, isFarmer, isAdmin } = useAuth();
  const { language } = useLanguage();

  const [reels, setReels] = useState<DisasterReel[]>(() => db.getDisasterReels());
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');
  const [selectedDisaster, setSelectedDisaster] = useState<string>('ALL');
  const [showVerifiedOnly, setShowVerifiedOnly] = useState<boolean>(false);
  const [selectedFileBlob, setSelectedFileBlob] = useState<Blob | File | null>(null);

  // Load permanent IndexedDB reels on mount
  useEffect(() => {
    const loadPermanentReels = async () => {
      try {
        const storedCustom = await permanentMediaDb.loadAllPermanentReels();
        const initial = db.getDisasterReels();
        if (storedCustom && storedCustom.length > 0) {
          // Merge custom permanent reels at the top
          const combined = [
            ...storedCustom,
            ...initial.filter((r) => !storedCustom.some((c) => c.id === r.id)),
          ];
          setReels(combined);
        }
      } catch (e) {
        console.warn('Failed to load permanent media db', e);
      }
    };
    loadPermanentReels();
  }, []);
  
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'feed' | 'grid'>('feed');
  
  // Upload modal state
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [activeCommentsReel, setActiveCommentsReel] = useState<DisasterReel | null>(null);
  const [commentText, setCommentText] = useState('');
  const [commentsList, setCommentsList] = useState<{ [reelId: string]: Array<{ user: string; text: string; time: string }> }>({
    'reel-kal-01': [
      { user: 'Mallikarjun (Farmer)', text: 'Our adjacent field in Sy 89 is also flooded. We need SDRF survey immediately.', time: '2h ago' },
      { user: 'Agriculture Officer Kalaburagi', text: 'SDRF joint survey team dispatched to Mashal village today at 11 AM.', time: '1h ago' },
    ],
  });

  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form state for new upload
  const [newReel, setNewReel] = useState<{
    title: string;
    titleKn: string;
    district: string;
    taluk: string;
    village: string;
    surveyNumber: string;
    disasterType: DisasterReel['disasterType'];
    cropAffected: string;
    estimatedLoss: string;
    description: string;
    mediaUrl: string;
    mediaType: 'video' | 'image';
  }>({
    title: '',
    titleKn: '',
    district: currentUser?.district || 'Kalaburagi',
    taluk: currentUser?.taluk || 'Kalaburagi',
    village: currentUser?.village || '',
    surveyNumber: '',
    disasterType: 'FLOOD_INUNDATION',
    cropAffected: 'Tur (Pigeon Pea / ತೊಗರಿ)',
    estimatedLoss: '3.5 Acres Submerged (₹1,50,000 Loss)',
    description: '',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    mediaType: 'video',
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(0);
  const [durationSec, setDurationSec] = useState<number>(15);
  const [videoError, setVideoError] = useState<boolean>(false);
  const [isSpeakingVoice, setIsSpeakingVoice] = useState<boolean>(false);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(false);
  const audioSynthRef = useRef<{ start: () => void; stop: () => void } | null>(null);

  // Initialize Web Audio ambient sound synthesizer
  useEffect(() => {
    let ctx: AudioContext | null = null;
    let noiseNode: AudioBufferSourceNode | null = null;
    let gainNode: GainNode | null = null;
    let isRunning = false;

    audioSynthRef.current = {
      start: () => {
        try {
          if (!ctx) {
            const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
            ctx = new AudioCtx();
          }
          if (ctx.state === 'suspended') {
            ctx.resume();
          }
          if (isRunning) return;

          const bufferSize = ctx.sampleRate * 2;
          const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const data = buffer.getChannelData(0);
          let lastOut = 0.0;
          for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            data[i] = (lastOut + 0.03 * white) / 1.02; // Brown noise for river flood rush
            lastOut = data[i];
            data[i] *= 3.0;
          }

          noiseNode = ctx.createBufferSource();
          noiseNode.buffer = buffer;
          noiseNode.loop = true;

          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(550, ctx.currentTime);

          gainNode = ctx.createGain();
          gainNode.gain.setValueAtTime(0.12, ctx.currentTime);

          noiseNode.connect(filter);
          filter.connect(gainNode);
          gainNode.connect(ctx.destination);

          noiseNode.start();
          isRunning = true;
        } catch {
          // audio context not allowed without interaction
        }
      },
      stop: () => {
        try {
          if (noiseNode) {
            noiseNode.stop();
            noiseNode.disconnect();
            noiseNode = null;
          }
          isRunning = false;
        } catch {
          isRunning = false;
        }
      },
    };

    return () => {
      if (audioSynthRef.current) {
        audioSynthRef.current.stop();
      }
      if (ctx) {
        ctx.close().catch(() => {});
      }
    };
  }, []);

  // Filtered reels list
  const filteredReels = reels.filter((r) => {
    if (selectedDistrict !== 'ALL' && r.district !== selectedDistrict) return false;
    if (selectedDisaster !== 'ALL' && r.disasterType !== selectedDisaster) return false;
    if (showVerifiedOnly && !r.verifiedByGovt) return false;
    return true;
  });

  const currentReel = filteredReels[activeIndex] || filteredReels[0];

  // Function to speak the ground news report with Kannada / Indian voice
  const speakCurrentReport = () => {
    if (!('speechSynthesis' in window) || !currentReel) return;
    window.speechSynthesis.cancel();

    const text = language === 'kn'
      ? `${currentReel.titleKn || currentReel.title}. ${currentReel.village}, ${currentReel.district} ಜಿಲ್ಲೆ. ${currentReel.cropAffected} ಬೆಳೆ ಸಂಪೂರ್ಣ ಹಾನಿ. ಅಂದಾಜು ನಷ್ಟ ${currentReel.estimatedLoss}. ಎಸ್‌ಡಿಆರ್‌ಎಫ್ ಪರಿಹಾರ ಸಮೀಕ್ಷೆ ಜಾರಿಯಲ್ಲಿದೆ.`
      : `Karnataka Ground Disaster Alert. ${currentReel.title}. Location: ${currentReel.village}, ${currentReel.district}. Crop damaged: ${currentReel.cropAffected}. Estimated loss: ${currentReel.estimatedLoss}. Rapid disaster relief survey active.`;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.92;
    utterance.pitch = 1.0;
    
    // Check available voices
    const voices = window.speechSynthesis.getVoices();
    const matchVoice = voices.find(
      (v) =>
        v.lang.includes('kn') ||
        v.lang.includes('hi') ||
        v.lang.includes('en-IN') ||
        v.name.includes('India') ||
        v.name.includes('Indian')
    );
    if (matchVoice) {
      utterance.voice = matchVoice;
    }

    utterance.onstart = () => setIsSpeakingVoice(true);
    utterance.onend = () => setIsSpeakingVoice(false);
    utterance.onerror = () => setIsSpeakingVoice(false);

    window.speechSynthesis.speak(utterance);
    setVoiceEnabled(true);
  };

  const stopVoice = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeakingVoice(false);
  };

  useEffect(() => {
    if (activeIndex >= filteredReels.length && filteredReels.length > 0) {
      setActiveIndex(0);
    }
  }, [filteredReels.length, activeIndex]);

  // Robust video playback effect on reel switch
  useEffect(() => {
    setVideoError(false);
    setProgress(0);
    setCurrentTimeSec(0);
    setIsPlaying(true);

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.muted = isMuted;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {
            // If autoplay with sound failed, try muted
            if (videoRef.current) {
              videoRef.current.muted = true;
              videoRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(() => setIsPlaying(true)); // Continue with canvas animation
            }
          });
      }
    }
  }, [currentReel?.id, activeIndex]);

  // Simulation timer loop for progress when playing
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        if (videoRef.current && videoRef.current.duration && !isNaN(videoRef.current.duration)) {
          setCurrentTimeSec(videoRef.current.currentTime);
          setDurationSec(videoRef.current.duration);
          setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
        } else {
          setCurrentTimeSec((prev) => {
            const next = prev + 0.25;
            if (next >= 15) return 0;
            return next;
          });
          setProgress((prev) => (prev >= 100 ? 0 : prev + 1.66));
        }
      }, 250);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  // Dynamic canvas wave & rain simulation for live ground effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let step = 0;

    const render = () => {
      if (isPlaying) {
        step += 0.08;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 1. Dynamic Rising Muddy Flood Torrent
        const baseWaterY = canvas.height - 180 + Math.sin(step * 0.5) * 15;
        
        // Deep muddy undercurrent
        ctx.fillStyle = 'rgba(120, 53, 15, 0.4)';
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);
        for (let x = 0; x <= canvas.width; x += 15) {
          const y = baseWaterY + Math.sin(x * 0.015 + step) * 14 + Math.cos(x * 0.03 - step * 0.8) * 8;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(canvas.width, canvas.height);
        ctx.closePath();
        ctx.fill();

        // Secondary surface churning foam wave
        ctx.fillStyle = 'rgba(180, 83, 9, 0.35)';
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);
        for (let x = 0; x <= canvas.width; x += 15) {
          const y = baseWaterY + 15 + Math.cos(x * 0.02 + step * 1.2) * 12 + Math.sin(x * 0.04 - step) * 6;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(canvas.width, canvas.height);
        ctx.closePath();
        ctx.fill();

        // White foam crests on wave peaks
        ctx.strokeStyle = 'rgba(254, 243, 199, 0.6)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (let x = 0; x <= canvas.width; x += 30) {
          const waveY = baseWaterY + Math.sin(x * 0.015 + step) * 14;
          ctx.moveTo(x - 12, waveY);
          ctx.lineTo(x + 12, waveY + Math.sin(step * 2) * 3);
        }
        ctx.stroke();

        // 2. Heavy Torrential Rain Streaks with Wind Angle
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
        ctx.lineWidth = 1.6;
        for (let i = 0; i < 35; i++) {
          const rx = (i * 29 + step * 320) % (canvas.width + 40) - 20;
          const ry = (i * 47 + step * 580) % canvas.height;
          ctx.beginPath();
          ctx.moveTo(rx, ry);
          ctx.lineTo(rx - 8, ry + 24);
          ctx.stroke();

          // Water splash rings where rain hits the floodwater surface
          if (ry > baseWaterY - 20 && ry < baseWaterY + 40 && i % 3 === 0) {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.beginPath();
            ctx.ellipse(rx, ry + 10, 6, 2, 0, 0, Math.PI * 2);
            ctx.stroke();
          }
        }

        // 3. Drone Sonar / Radar Sweep Indicator (Top Right)
        const radarCenterX = canvas.width - 35;
        const radarCenterY = 45;
        const radarRadius = 22;

        ctx.strokeStyle = 'rgba(16, 185, 129, 0.6)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(radarCenterX, radarCenterY, radarRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(radarCenterX, radarCenterY, radarRadius * 0.5, 0, Math.PI * 2);
        ctx.stroke();

        // Rotating radar beam
        const beamAngle = step * 1.5;
        ctx.strokeStyle = 'rgba(52, 211, 153, 0.9)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(radarCenterX, radarCenterY);
        ctx.lineTo(
          radarCenterX + Math.cos(beamAngle) * radarRadius,
          radarCenterY + Math.sin(beamAngle) * radarRadius
        );
        ctx.stroke();

        // Radar text label
        ctx.fillStyle = 'rgba(16, 185, 129, 0.9)';
        ctx.font = 'bold 8px monospace';
        ctx.fillText('DRONE SURVEILLANCE', radarCenterX - 45, radarCenterY + 34);

        // 4. Live Ground Water Level Telemetry Badge
        ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
        ctx.fillRect(12, 45, 130, 20);
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)';
        ctx.lineWidth = 1;
        ctx.strokeRect(12, 45, 130, 20);

        ctx.fillStyle = '#EF4444';
        ctx.beginPath();
        ctx.arc(22, 55, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 9px monospace';
        const waterRise = (4.2 + Math.sin(step * 0.2) * 0.6).toFixed(1);
        ctx.fillText(`WATER: +${waterRise} FT RISING`, 32, 58);
      }
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  // Handle Play/Pause
  const togglePlay = () => {
    if (isPlaying) {
      if (videoRef.current) {
        videoRef.current.pause();
      }
      setIsPlaying(false);
      stopVoice();
      if (audioSynthRef.current) {
        audioSynthRef.current.stop();
      }
    } else {
      setIsPlaying(true);
      if (videoRef.current) {
        videoRef.current.muted = isMuted;
        videoRef.current.volume = isMuted ? 0 : 1.0;
        videoRef.current.play().catch(() => {
          if (videoRef.current) {
            videoRef.current.muted = true;
            setIsMuted(true);
            videoRef.current.play().catch(() => {});
          }
        });
      }
    }
  };

  const toggleMute = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    if (videoRef.current) {
      videoRef.current.muted = newMuted;
      videoRef.current.volume = newMuted ? 0 : 1.0;
    }
    // If user unmuted to hear real video audio, ensure voice synthesis stops
    if (!newMuted) {
      stopVoice();
      if (audioSynthRef.current) {
        audioSynthRef.current.stop();
      }
    }
  };

  const handleLike = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const result = db.toggleLikeReel(id);
    setReels((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, isLiked: result.isLiked, likesCount: result.count } : r
      )
    );
  };

  const handleShare = (reel: DisasterReel, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard?.writeText(
      `🚨 [KisanRakshak Karnataka Disaster Alert] ${reel.title} at ${reel.village}, ${reel.taluk}, ${reel.district}. Loss: ${reel.estimatedLoss}`
    );
    setCopiedId(reel.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDeleteReel = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      await permanentMediaDb.deleteReelPermanently(id);
    } catch (err) {
      console.warn(err);
    }
    db.deleteDisasterReel(id);
    setReels((prev) => prev.filter((r) => r.id !== id));
  };

  const handleNextReel = () => {
    if (activeIndex < filteredReels.length - 1) {
      setActiveIndex(activeIndex + 1);
      setIsPlaying(true);
    }
  };

  const handlePrevReel = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
      setIsPlaying(true);
    }
  };

  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      setSelectedFileBlob(file);
      const isVid = file.type.startsWith('video');
      
      // Auto-suggest title based on file and location
      if (!newReel.title) {
        setNewReel((prev) => ({
          ...prev,
          title: `Ground Disaster Video: ${prev.village || prev.taluk || 'Karnataka'} ${prev.cropAffected}`,
          titleKn: `ಕ್ಷೇತ್ರ ವಿಪತ್ತು ವರದಿ: ${prev.village || prev.taluk || 'ಕರ್ನಾಟಕ'} ${prev.cropAffected}`,
        }));
      }

      // Create object URL for instant zero-lag playback
      const objectUrl = URL.createObjectURL(file);
      setNewReel((prev) => ({
        ...prev,
        mediaUrl: objectUrl,
        mediaType: isVid ? 'video' : 'image',
      }));

      // Also read as Data URL for fallback persistence
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result && typeof reader.result === 'string') {
          if (file.size < 5 * 1024 * 1024) {
            setNewReel((prev) => ({
              ...prev,
              mediaUrl: reader.result as string,
              mediaType: isVid ? 'video' : 'image',
            }));
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateReel = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Auto-generate title if farmer left it blank
    const finalTitle =
      newReel.title.trim() ||
      `${newReel.village || newReel.taluk || newReel.district} ${newReel.cropAffected} Disaster Alert`;
    const finalTitleKn =
      newReel.titleKn.trim() ||
      `${newReel.village || newReel.taluk || newReel.district} ${newReel.cropAffected} ವಿಪತ್ತು ವರದಿ`;

    const created: DisasterReel = {
      id: `reel-${Date.now()}`,
      authorName: currentUser?.name || (isAdmin ? 'Disaster Control Officer' : 'Karnataka Farmer'),
      authorRole: isAdmin ? 'OFFICER' : 'FARMER',
      district: newReel.district || currentUser?.district || 'Kalaburagi',
      taluk: newReel.taluk || currentUser?.taluk || 'Kalaburagi',
      village: newReel.village || currentUser?.village || 'Gram Panchayat Field',
      disasterType: newReel.disasterType,
      mediaType: newReel.mediaType,
      mediaUrl: newReel.mediaUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      thumbnailUrl:
        newReel.mediaType === 'image'
          ? newReel.mediaUrl
          : 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800&auto=format&fit=crop&q=80',
      title: finalTitle,
      titleKn: finalTitleKn,
      description: newReel.description || `${newReel.cropAffected} crop severely affected due to ${newReel.disasterType} at ${newReel.village}.`,
      descriptionKn: newReel.description || `${newReel.village} ಗ್ರಾಮದಲ್ಲಿ ${newReel.cropAffected} ಬೆಳೆಗೆ ಹಾನಿ ಉಂಟಾಗಿದೆ.`,
      cropAffected: newReel.cropAffected || 'Standing Crops',
      estimatedLoss: newReel.estimatedLoss || '3.5 Acres Affected',
      surveyNumber: newReel.surveyNumber || 'Sy. No. Pending Inspection',
      timestamp: 'Just now',
      likesCount: 1,
      isLiked: true,
      sharesCount: 0,
      verifiedByGovt: isAdmin,
      reliefStatus: isAdmin ? 'SDRF Survey Underway' : 'Immediate Action Needed',
      tags: [`#${newReel.district}Disaster`, `#${newReel.disasterType}`, `#CropDamage`],
    };

    // 1. Save permanently to IndexedDB (supports unlimited gigabyte video files)
    try {
      await permanentMediaDb.saveReelPermanently(created, selectedFileBlob);
    } catch (err) {
      console.warn('Permanent media save error', err);
    }

    // 2. Save to in-memory state & backend storage
    db.saveDisasterReel(created);
    setReels((prev) => [created, ...prev.filter((p) => p.id !== created.id)]);
    setShowUploadModal(false);
    
    // Clear filters so the new reel is always visible at index 0
    setSelectedDistrict('ALL');
    setSelectedDisaster('ALL');
    setShowVerifiedOnly(false);
    setViewMode('feed');
    setActiveIndex(0);
    setIsPlaying(true);

    // Show success message
    setUploadSuccessMsg('✅ Ground Reel saved permanently! It will remain available in your Reels feed across all sessions.');
    setTimeout(() => setUploadSuccessMsg(null), 6000);

    // Reset form
    setSelectedFileBlob(null);
    setUploadedFileName(null);
    setNewReel({
      title: '',
      titleKn: '',
      district: currentUser?.district || 'Kalaburagi',
      taluk: currentUser?.taluk || 'Kalaburagi',
      village: '',
      surveyNumber: '',
      disasterType: 'FLOOD_INUNDATION',
      cropAffected: 'Tur (Pigeon Pea / ತೊಗರಿ)',
      estimatedLoss: '3.5 Acres Submerged (₹1,50,000 Loss)',
      description: '',
      mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      mediaType: 'video',
    });
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !activeCommentsReel) return;

    const reelId = activeCommentsReel.id;
    const newEntry = {
      user: currentUser?.name || 'Local Farmer',
      text: commentText.trim(),
      time: 'Just now',
    };

    setCommentsList((prev) => ({
      ...prev,
      [reelId]: [newEntry, ...(prev[reelId] || [])],
    }));

    setCommentText('');
  };

  const getDisasterBadge = (type: DisasterReel['disasterType']) => {
    switch (type) {
      case 'FLOOD_INUNDATION':
        return { label: '🌊 Flood Inundation', bg: 'bg-blue-600 text-white' };
      case 'CLOUDBURST_RAIN':
        return { label: '🌧️ Cloudburst (100mm+)', bg: 'bg-sky-600 text-white' };
      case 'HAILSTORM_DAMAGE':
        return { label: '⛈️ Hailstorm Damage', bg: 'bg-amber-600 text-white' };
      case 'CANAL_BREACH':
        return { label: '🌊 Canal Breach Overwash', bg: 'bg-indigo-600 text-white' };
      case 'LANDSLIDE':
        return { label: '⛰️ Hillside Landslide', bg: 'bg-orange-600 text-white' };
      case 'DROUGHT_WITHERING':
        return { label: '☀️ Drought & Crop Withering', bg: 'bg-amber-700 text-white' };
      default:
        return { label: '⚠️ Disaster Alert', bg: 'bg-red-600 text-white' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Success Alert Banner */}
      {uploadSuccessMsg && (
        <div className="bg-emerald-600 text-white p-4 rounded-2xl shadow-lg flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex items-center space-x-3">
            <CheckCircle2 className="w-6 h-6 text-white shrink-0 animate-bounce" />
            <div>
              <p className="text-sm font-extrabold">{uploadSuccessMsg}</p>
              <p className="text-xs text-emerald-100">Disaster response teams and fellow farmers can now view your ground report.</p>
            </div>
          </div>
          <button
            onClick={() => setUploadSuccessMsg(null)}
            className="text-white hover:text-emerald-200 text-lg font-bold px-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-[#E2E8E4] p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-red-100 text-red-700 border border-red-200 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-red-600"></span> LIVE GROUND ZERO
            </span>
            <span className="text-xs text-[#65736B]">Karnataka Field Disaster Monitor</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#17211B] mt-1 flex items-center gap-2">
            <Film className="w-6 h-6 text-[#146B3A]" /> Disaster Ground Reels & Field Stories
          </h1>
          <p className="text-xs sm:text-sm text-[#65736B] mt-1 max-w-2xl">
            Real-time vertical video and photo reports of floods, crop submergence, canal breaches, and hailstorms uploaded directly by Karnataka farmers and district field officers.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex bg-[#F7F9F8] p-1 rounded-xl border border-[#E2E8E4]">
            <button
              onClick={() => setViewMode('feed')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'feed'
                  ? 'bg-white text-[#146B3A] shadow-xs'
                  : 'text-[#65736B] hover:text-[#17211B]'
              }`}
            >
              📱 Reels Player
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-[#146B3A] shadow-xs'
                  : 'text-[#65736B] hover:text-[#17211B]'
              }`}
            >
              ⊞ Grid View
            </button>
          </div>

          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-[#146B3A] hover:bg-[#1F8A4C] text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Upload Ground Reel
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-[#E2E8E4] p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-[#65736B] font-bold">
            <Filter className="w-3.5 h-3.5 text-[#146B3A]" /> District:
          </div>
          <select
            value={selectedDistrict}
            onChange={(e) => {
              setSelectedDistrict(e.target.value);
              setActiveIndex(0);
            }}
            className="border border-[#E2E8E4] rounded-xl px-3 py-1.5 font-semibold text-[#17211B] bg-[#F7F9F8] focus:bg-white text-xs"
          >
            <option value="ALL">All 31 Karnataka Districts</option>
            {KARNATAKA_DISTRICTS_LIST.map((d) => (
              <option key={d.name} value={d.name}>
                {d.name} ({d.kannadaName})
              </option>
            ))}
          </select>

          <div className="flex items-center gap-1.5 text-[#65736B] font-bold ml-2">
            Disaster:
          </div>
          <select
            value={selectedDisaster}
            onChange={(e) => {
              setSelectedDisaster(e.target.value);
              setActiveIndex(0);
            }}
            className="border border-[#E2E8E4] rounded-xl px-3 py-1.5 font-semibold text-[#17211B] bg-[#F7F9F8] focus:bg-white text-xs"
          >
            <option value="ALL">All Disasters</option>
            <option value="FLOOD_INUNDATION">🌊 River Flood Inundation</option>
            <option value="CLOUDBURST_RAIN">🌧️ Cloudburst Rainfall</option>
            <option value="HAILSTORM_DAMAGE">⛈️ Hailstorm Crop Damage</option>
            <option value="CANAL_BREACH">🌊 Canal Breach</option>
            <option value="LANDSLIDE">⛰️ Hillside Landslide</option>
            <option value="DROUGHT_WITHERING">☀️ Drought & Moisture Deficit</option>
          </select>

          <label className="flex items-center space-x-2 cursor-pointer ml-2">
            <input
              type="checkbox"
              checked={showVerifiedOnly}
              onChange={(e) => setShowVerifiedOnly(e.target.checked)}
              className="rounded text-[#146B3A] focus:ring-[#146B3A]"
            />
            <span className="font-semibold text-[#17211B]">Govt / SDRF Verified Only</span>
          </label>
        </div>

        <div className="text-xs text-[#65736B]">
          Showing <strong>{filteredReels.length}</strong> active ground reports
        </div>
      </div>

      {/* FEED / PLAYER VIEW */}
      {viewMode === 'feed' && (
        <div className="max-w-4xl mx-auto">
          {filteredReels.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E2E8E4] p-12 text-center">
              <Film className="w-12 h-12 text-[#65736B] mx-auto mb-3 opacity-40" />
              <h3 className="text-base font-bold text-[#17211B]">No Disaster Reels Found</h3>
              <p className="text-xs text-[#65736B] mt-1">
                No ground video reports match the selected district or disaster filter.
              </p>
              <button
                onClick={() => {
                  setSelectedDistrict('ALL');
                  setSelectedDisaster('ALL');
                  setShowVerifiedOnly(false);
                }}
                className="mt-4 px-4 py-2 bg-[#EAF6EE] text-[#146B3A] font-bold rounded-xl text-xs"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Main Vertical Reel Player Frame (9:16 Aspect Ratio) */}
              <div className="lg:col-span-7 bg-black rounded-3xl overflow-hidden shadow-2xl relative border-4 border-[#17211B] flex flex-col items-center justify-center max-h-[720px] aspect-[9/16] mx-auto w-full group select-none">
                {/* Top Reel Progress Indicator Bar */}
                <div className="absolute top-1.5 left-2 right-2 h-1 bg-white/30 rounded-full z-30 overflow-hidden cursor-pointer"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const pct = (clickX / rect.width) * 100;
                    setProgress(pct);
                    if (videoRef.current && videoRef.current.duration) {
                      videoRef.current.currentTime = (pct / 100) * videoRef.current.duration;
                    }
                  }}
                >
                  <div
                    className="h-full bg-emerald-400 transition-all duration-100 ease-linear rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Media Element */}
                {currentReel.mediaType === 'video' && !videoError ? (
                  <video
                    ref={videoRef}
                    key={currentReel.id}
                    src={currentReel.mediaUrl}
                    className="w-full h-full object-cover cursor-pointer"
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    preload="auto"
                    crossOrigin="anonymous"
                    onTimeUpdate={() => {
                      if (videoRef.current && videoRef.current.duration) {
                        setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
                        setCurrentTimeSec(videoRef.current.currentTime);
                      }
                    }}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onError={() => setVideoError(true)}
                    onClick={togglePlay}
                  />
                ) : (
                  <div
                    className="w-full h-full relative cursor-pointer flex items-center justify-center overflow-hidden"
                    onClick={togglePlay}
                  >
                    <img
                      src={currentReel.thumbnailUrl || currentReel.mediaUrl}
                      alt={currentReel.title}
                      className="w-full h-full object-cover scale-105"
                    />
                  </div>
                )}

                {/* Live Ground Simulation Overlay Canvas */}
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={700}
                  className="absolute inset-0 w-full h-full pointer-events-none z-10"
                />

                {/* Top Overlay: Disaster Badge & Verified Tag */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20 pointer-events-none">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-md ${
                        getDisasterBadge(currentReel.disasterType).bg
                      }`}
                    >
                      {getDisasterBadge(currentReel.disasterType).label}
                    </span>
                    {currentReel.verifiedByGovt && (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500 text-white shadow-md flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> SDRF Verified
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 pointer-events-auto">
                    {/* Real Video Sound Toggle Button */}
                    <button
                      onClick={toggleMute}
                      className={`px-3 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1.5 shadow-md backdrop-blur-xs transition-all cursor-pointer ${
                        !isMuted
                          ? 'bg-emerald-600 text-white ring-2 ring-emerald-300 animate-pulse'
                          : 'bg-black/70 text-white hover:bg-black/90 border border-white/20'
                      }`}
                      title={isMuted ? 'Click to turn ON real video voice/audio' : 'Click to mute video sound'}
                    >
                      {!isMuted ? (
                        <>
                          <Volume2 className="w-3.5 h-3.5 text-white" />
                          <span>🔊 Real Video Sound: ON</span>
                        </>
                      ) : (
                        <>
                          <VolumeX className="w-3.5 h-3.5 text-amber-300" />
                          <span>🔇 Tap to Unmute Real Voice</span>
                        </>
                      )}
                    </button>

                    {/* Optional AI Voice Summary Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isSpeakingVoice) {
                          stopVoice();
                        } else {
                          speakCurrentReport();
                        }
                      }}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1.5 shadow-md transition-all cursor-pointer ${
                        isSpeakingVoice
                          ? 'bg-amber-500 text-black animate-pulse ring-2 ring-amber-300'
                          : 'bg-black/50 text-white hover:bg-black/70'
                      }`}
                      title="Read AI Summary in Kannada / English"
                    >
                      <span>🎙️</span>
                      <span>{isSpeakingVoice ? 'Reading Summary...' : 'AI Summary'}</span>
                    </button>
                  </div>
                </div>

                {/* Center Play/Pause indicator */}
                {!isPlaying && (
                  <button
                    onClick={togglePlay}
                    className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur-xs z-20 pointer-events-auto cursor-pointer animate-in zoom-in-75 duration-150"
                  >
                    <Play className="w-8 h-8 fill-current ml-1" />
                  </button>
                )}

                {/* Right Side Action Floating Bar */}
                <div className="absolute right-3 bottom-24 flex flex-col items-center space-y-4 z-20 pointer-events-auto">
                  {/* Like Button */}
                  <button
                    onClick={(e) => handleLike(currentReel.id, e)}
                    className="flex flex-col items-center text-white drop-shadow-md group/btn cursor-pointer"
                  >
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                        currentReel.isLiked
                          ? 'bg-red-500 text-white scale-110'
                          : 'bg-black/50 text-white hover:bg-black/70'
                      }`}
                    >
                      <Heart
                        className={`w-5 h-5 ${currentReel.isLiked ? 'fill-current' : ''}`}
                      />
                    </div>
                    <span className="text-[10px] font-bold mt-1">{currentReel.likesCount}</span>
                  </button>

                  {/* Comment / Discussion Button */}
                  <button
                    onClick={() => setActiveCommentsReel(currentReel)}
                    className="flex flex-col items-center text-white drop-shadow-md cursor-pointer"
                  >
                    <div className="w-11 h-11 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold mt-1">
                      {(commentsList[currentReel.id] || []).length}
                    </span>
                  </button>

                  {/* Share Button */}
                  <button
                    onClick={(e) => handleShare(currentReel, e)}
                    className="flex flex-col items-center text-white drop-shadow-md cursor-pointer"
                  >
                    <div className="w-11 h-11 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center">
                      <Share2 className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold mt-1">
                      {copiedId === currentReel.id ? 'Copied!' : currentReel.sharesCount}
                    </span>
                  </button>

                  {/* Author / Admin delete */}
                  {(isAdmin || currentReel.authorName.includes(currentUser?.name || '')) && (
                    <button
                      onClick={(e) => handleDeleteReel(currentReel.id, e)}
                      className="w-9 h-9 rounded-full bg-red-600/80 hover:bg-red-700 text-white flex items-center justify-center cursor-pointer"
                      title="Delete Reel"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Bottom Information Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/95 via-black/70 to-transparent text-white z-20 pointer-events-none">
                  <div className="pointer-events-auto space-y-2 max-w-[85%]">
                    {/* Author & Location */}
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center border border-white/40">
                        {currentReel.authorName.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-extrabold truncate flex items-center gap-1">
                          {currentReel.authorName}
                          <span className="text-[9px] font-normal px-1.5 py-0.2 bg-white/20 rounded">
                            {currentReel.authorRole}
                          </span>
                        </p>
                        <p className="text-[10px] text-white/80 flex items-center gap-1">
                          <MapPin className="w-2.5 h-2.5 text-emerald-400" />
                          {currentReel.village}, {currentReel.taluk}, {currentReel.district}
                        </p>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xs sm:text-sm font-bold text-white line-clamp-2 leading-snug">
                      {language === 'kn' ? currentReel.titleKn || currentReel.title : currentReel.title}
                    </h3>

                    {/* Crop & Loss Stats Pill */}
                    <div className="flex flex-wrap gap-1 text-[10px]">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-bold">
                        🌾 {currentReel.cropAffected}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-red-500/30 text-red-200 border border-red-500/40 font-bold">
                        ⚠️ {currentReel.estimatedLoss}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-[11px] text-white/90 line-clamp-2 leading-relaxed">
                      {language === 'kn'
                        ? currentReel.descriptionKn || currentReel.description
                        : currentReel.description}
                    </p>

                    {/* Interactive Player Controls Ribbon */}
                    <div className="pt-2 flex items-center space-x-2 bg-black/60 backdrop-blur-md rounded-xl p-2 border border-white/10">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePlay();
                        }}
                        className="w-8 h-8 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center font-bold transition-transform active:scale-95 cursor-pointer shrink-0 shadow-sm"
                        title={isPlaying ? 'Pause' : 'Play'}
                      >
                        {isPlaying ? (
                          <Pause className="w-4 h-4 fill-current" />
                        ) : (
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (videoRef.current) {
                            videoRef.current.currentTime = 0;
                            videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
                          } else {
                            setProgress(0);
                            setCurrentTimeSec(0);
                            setIsPlaying(true);
                          }
                        }}
                        className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs font-bold cursor-pointer shrink-0"
                        title="Replay"
                      >
                        ↺
                      </button>

                      <div className="flex-1 flex items-center space-x-2">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={progress}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            setProgress(val);
                            if (videoRef.current && videoRef.current.duration) {
                              videoRef.current.currentTime = (val / 100) * videoRef.current.duration;
                            }
                          }}
                          className="w-full accent-emerald-400 h-1.5 bg-white/20 rounded-lg cursor-pointer"
                        />
                        <span className="text-[10px] font-mono text-emerald-300 font-bold shrink-0">
                          {Math.floor(currentTimeSec)}s
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => toggleMute(e)}
                        className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer shrink-0"
                        title={isMuted ? 'Unmute' : 'Mute'}
                      >
                        {isMuted ? (
                          <VolumeX className="w-3.5 h-3.5 text-red-400" />
                        ) : (
                          <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Navigation Arrows for desktop */}
                <div className="absolute left-2 top-1/2 -translate-y-1/2 z-30 pointer-events-auto">
                  {activeIndex > 0 && (
                    <button
                      onClick={handlePrevReel}
                      className="w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-all cursor-pointer shadow-lg"
                      title="Previous Reel"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                  )}
                </div>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 z-30 pointer-events-auto">
                  {activeIndex < filteredReels.length - 1 && (
                    <button
                      onClick={handleNextReel}
                      className="w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-all cursor-pointer shadow-lg"
                      title="Next Reel"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Side Details & Relief Action Panel */}
              <div className="lg:col-span-5 space-y-4">
                {/* Reel Index Indicator */}
                <div className="bg-white rounded-2xl border border-[#E2E8E4] p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#65736B]">
                      REEL {activeIndex + 1} OF {filteredReels.length}
                    </span>
                    <span className="text-xs text-[#65736B] flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {currentReel.timestamp}
                    </span>
                  </div>

                  {/* Survey Details & Government Relief Status */}
                  <div className="bg-[#F7F9F8] rounded-xl p-3.5 border border-[#E2E8E4] space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[#65736B]">Survey Number:</span>
                      <span className="font-bold text-[#17211B]">{currentReel.surveyNumber || 'Pending'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#65736B]">SDRF Relief Status:</span>
                      <span className="font-extrabold text-[#146B3A] bg-[#EAF6EE] px-2 py-0.5 rounded">
                        {currentReel.reliefStatus}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#65736B]">Reported Crop Loss:</span>
                      <span className="font-extrabold text-red-600">{currentReel.estimatedLoss}</span>
                    </div>
                  </div>

                  {/* Fast Track Action Buttons for Farmers & Officers */}
                  <div className="space-y-2 pt-1">
                    <button
                      onClick={onReportLoss}
                      className="w-full bg-[#146B3A] hover:bg-[#1F8A4C] text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-colors"
                    >
                      <span>📝 Claim Government SDRF Compensation</span>
                    </button>

                    <button
                      onClick={onRequestHelp}
                      className="w-full bg-[#DC4444] hover:bg-red-700 text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-colors"
                    >
                      <span>🚨 Dispatch Emergency Dewatering / Relief</span>
                    </button>
                  </div>
                </div>

                {/* Up Next Preview List */}
                <div className="bg-white rounded-2xl border border-[#E2E8E4] p-4 shadow-xs">
                  <h4 className="text-xs font-bold text-[#17211B] uppercase tracking-wider mb-3">
                    Karnataka Ground Stories ({filteredReels.length})
                  </h4>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {filteredReels.map((r, idx) => (
                      <div
                        key={r.id}
                        onClick={() => {
                          setActiveIndex(idx);
                          setIsPlaying(true);
                        }}
                        className={`p-2.5 rounded-xl border flex items-center space-x-3 cursor-pointer transition-all ${
                          activeIndex === idx
                            ? 'bg-[#EAF6EE] border-[#146B3A] shadow-xs'
                            : 'border-[#E2E8E4] hover:bg-[#F7F9F8]'
                        }`}
                      >
                        <div className="w-12 h-14 rounded-lg bg-black shrink-0 overflow-hidden relative">
                          <img
                            src={r.thumbnailUrl || r.mediaUrl}
                            alt={r.title}
                            className="w-full h-full object-cover opacity-80"
                          />
                          <Play className="w-3.5 h-3.5 fill-white text-white absolute inset-0 m-auto" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-[#17211B] truncate">{r.title}</p>
                          <p className="text-[10px] text-[#65736B] truncate">
                            📍 {r.village}, {r.district} • {r.cropAffected}
                          </p>
                          <span className="text-[9px] font-bold text-red-600">{r.estimatedLoss}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* GRID VIEW */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredReels.map((reel, idx) => (
            <div
              key={reel.id}
              onClick={() => {
                setActiveIndex(idx);
                setViewMode('feed');
              }}
              className="group bg-black rounded-2xl overflow-hidden aspect-[9/16] relative shadow-md cursor-pointer border border-[#E2E8E4] hover:scale-[1.02] transition-all"
            >
              {reel.mediaType === 'video' ? (
                <video
                  src={reel.mediaUrl}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  muted
                  playsInline
                />
              ) : (
                <img
                  src={reel.mediaUrl}
                  alt={reel.title}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                />
              )}

              {/* Top Badge */}
              <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    getDisasterBadge(reel.disasterType).bg
                  }`}
                >
                  {getDisasterBadge(reel.disasterType).label}
                </span>
                <span className="text-[10px] font-bold text-white bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-xs flex items-center gap-1">
                  <Heart className="w-3 h-3 fill-red-500 text-red-500" /> {reel.likesCount}
                </span>
              </div>

              {/* Bottom Gradient with Information */}
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/95 via-black/60 to-transparent text-white z-10">
                <p className="text-[10px] text-emerald-300 font-bold flex items-center gap-1">
                  <MapPin className="w-2.5 h-2.5" /> {reel.village}, {reel.district}
                </p>
                <h4 className="text-xs font-bold line-clamp-2 mt-0.5 leading-snug">{reel.title}</h4>
                <p className="text-[10px] text-red-300 font-semibold mt-1 truncate">
                  🌾 {reel.cropAffected} • {reel.estimatedLoss}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* COMMENTS / FIELD DISCUSSION MODAL */}
      {activeCommentsReel && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E2E8E4] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-[#E2E8E4] flex items-center justify-between bg-[#F7F9F8]">
              <div>
                <h3 className="text-sm font-bold text-[#17211B]">Field Discussion & Support</h3>
                <p className="text-[11px] text-[#65736B]">
                  📍 {activeCommentsReel.village}, {activeCommentsReel.district}
                </p>
              </div>
              <button
                onClick={() => setActiveCommentsReel(null)}
                className="text-[#65736B] hover:text-[#17211B] text-lg font-bold px-2 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* List */}
            <div className="p-4 max-h-72 overflow-y-auto space-y-3 divide-y divide-[#E2E8E4]">
              {((commentsList[activeCommentsReel.id] || [])).length === 0 ? (
                <p className="text-xs text-[#65736B] text-center py-6">
                  No comments yet. Farmers and Agriculture Officers can leave ground updates here.
                </p>
              ) : (
                (commentsList[activeCommentsReel.id] || []).map((c, i) => (
                  <div key={i} className="pt-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#17211B]">{c.user}</span>
                      <span className="text-[10px] text-[#65736B]">{c.time}</span>
                    </div>
                    <p className="text-[#65736B] mt-0.5">{c.text}</p>
                  </div>
                ))
              )}
            </div>

            {/* Comment Form */}
            <form onSubmit={handleAddComment} className="p-3 border-t border-[#E2E8E4] flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add ground update or officer response..."
                className="flex-1 border border-[#E2E8E4] rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#146B3A]"
              />
              <button
                type="submit"
                className="bg-[#146B3A] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#1F8A4C] cursor-pointer"
              >
                Post
              </button>
            </form>
          </div>
        </div>
      )}

      {/* UPLOAD NEW REEL MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E2E8E4] w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8E4]">
              <div>
                <h3 className="text-base font-bold text-[#17211B] flex items-center gap-2">
                  <Film className="w-5 h-5 text-[#146B3A]" /> Upload Disaster Reel / Ground Report
                </h3>
                <p className="text-xs text-[#65736B] mt-0.5">
                  Share localized disaster videos or crop submergence images to notify district authorities and fellow farmers.
                </p>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-[#65736B] hover:text-[#17211B] text-lg font-bold px-2 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateReel} className="space-y-4 mt-4">
              {/* Media selection */}
              <div>
                <label className="block text-xs font-bold text-[#17211B] mb-1.5">
                  Video / Image Media Upload
                </label>
                <div className="border-2 border-dashed border-[#146B3A]/30 bg-[#F5FBF7] rounded-xl p-4 text-center hover:bg-[#EAF6EE] transition-colors">
                  <Upload className="w-8 h-8 text-[#146B3A] mx-auto mb-1.5" />
                  <p className="text-xs font-bold text-[#17211B]">
                    Upload Video (MP4/WebM) or Disaster Photo
                  </p>
                  <p className="text-[11px] text-[#65736B] mt-0.5">
                    Select a video from your camera roll or pick a Karnataka disaster sample clip below:
                  </p>
                  <input
                    type="file"
                    accept="video/*,image/*"
                    onChange={handleFileUpload}
                    className="mt-3 text-xs text-[#65736B] file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#146B3A] file:text-white cursor-pointer"
                  />
                  
                  {/* Preset Clips */}
                  <div className="mt-3 pt-3 border-t border-[#146B3A]/20 flex flex-wrap justify-center gap-1.5 text-[11px]">
                    <span className="text-[#65736B] font-bold self-center">Presets:</span>
                    {[
                      { name: '🌊 River Flood Water', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' },
                      { name: '🌧️ Heavy Rain on Crop', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4' },
                      { name: '⛈️ Dark Cloudburst', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
                      { name: '🚁 Aerial Flood Inundation', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' },
                    ].map((clip, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setUploadedFileName(clip.name);
                          setNewReel((prev) => ({ ...prev, mediaUrl: clip.url, mediaType: 'video' }));
                        }}
                        className={`px-2 py-1 rounded-lg border text-[10px] font-bold cursor-pointer transition-colors ${
                          newReel.mediaUrl === clip.url
                            ? 'bg-[#146B3A] text-white border-[#146B3A]'
                            : 'bg-white text-[#17211B] border-[#E2E8E4] hover:bg-[#EAF6EE]'
                        }`}
                      >
                        {clip.name}
                      </button>
                    ))}
                  </div>

                  {uploadedFileName && (
                    <div className="mt-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg inline-flex items-center gap-1">
                      <span>✓ Selected:</span> <span>{uploadedFileName}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Title in English and Kannada */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#17211B] mb-1">
                    Title (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={newReel.title}
                    onChange={(e) => setNewReel({ ...newReel, title: e.target.value })}
                    placeholder="e.g. 5 Acres Tur Crop Submerged in Bhima River Flood"
                    className="w-full border border-[#E2E8E4] rounded-xl px-3 py-2 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#17211B] mb-1">
                    ಶೀರ್ಷಿಕೆ (ಕನ್ನಡದಲ್ಲಿ)
                  </label>
                  <input
                    type="text"
                    value={newReel.titleKn}
                    onChange={(e) => setNewReel({ ...newReel, titleKn: e.target.value })}
                    placeholder="ಉದಾ: ಭೀಮಾ ನದಿ ಪ್ರವಾಹದಿಂದ ತೊಗರಿ ಬೆಳೆ ಮುಳುಗಡೆ"
                    className="w-full border border-[#E2E8E4] rounded-xl px-3 py-2 text-xs font-medium"
                  />
                </div>
              </div>

              {/* Location details */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#17211B] mb-1">
                    District *
                  </label>
                  <select
                    value={newReel.district}
                    onChange={(e) => setNewReel({ ...newReel, district: e.target.value })}
                    className="w-full border border-[#E2E8E4] rounded-xl px-3 py-2 text-xs"
                  >
                    {KARNATAKA_DISTRICTS_LIST.map((d) => (
                      <option key={d.name} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#17211B] mb-1">
                    Taluk *
                  </label>
                  <input
                    type="text"
                    required
                    value={newReel.taluk}
                    onChange={(e) => setNewReel({ ...newReel, taluk: e.target.value })}
                    placeholder="e.g. Afzalpur"
                    className="w-full border border-[#E2E8E4] rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#17211B] mb-1">
                    Village / GP
                  </label>
                  <input
                    type="text"
                    value={newReel.village}
                    onChange={(e) => setNewReel({ ...newReel, village: e.target.value })}
                    placeholder="e.g. Mashal"
                    className="w-full border border-[#E2E8E4] rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>

              {/* Disaster type & Survey Number */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#17211B] mb-1">
                    Disaster Type *
                  </label>
                  <select
                    value={newReel.disasterType}
                    onChange={(e) =>
                      setNewReel({
                        ...newReel,
                        disasterType: e.target.value as DisasterReel['disasterType'],
                      })
                    }
                    className="w-full border border-[#E2E8E4] rounded-xl px-3 py-2 text-xs font-semibold"
                  >
                    <option value="FLOOD_INUNDATION">🌊 River Flood Inundation</option>
                    <option value="CLOUDBURST_RAIN">🌧️ Cloudburst Rainfall</option>
                    <option value="HAILSTORM_DAMAGE">⛈️ Hailstorm Crop Damage</option>
                    <option value="CANAL_BREACH">🌊 Canal Breach Overwash</option>
                    <option value="LANDSLIDE">⛰️ Hillside Landslide</option>
                    <option value="DROUGHT_WITHERING">☀️ Drought & Moisture Deficit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17211B] mb-1">
                    Survey No. (Sy. No.)
                  </label>
                  <input
                    type="text"
                    value={newReel.surveyNumber}
                    onChange={(e) => setNewReel({ ...newReel, surveyNumber: e.target.value })}
                    placeholder="e.g. Sy. No. 88/1A"
                    className="w-full border border-[#E2E8E4] rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>

              {/* Crop & Loss Extent */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#17211B] mb-1">
                    Crop Affected *
                  </label>
                  <input
                    type="text"
                    required
                    value={newReel.cropAffected}
                    onChange={(e) => setNewReel({ ...newReel, cropAffected: e.target.value })}
                    placeholder="e.g. Tur (Pigeon Pea), Cotton, Sugarcane"
                    className="w-full border border-[#E2E8E4] rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#17211B] mb-1">
                    Estimated Loss & Extent *
                  </label>
                  <input
                    type="text"
                    required
                    value={newReel.estimatedLoss}
                    onChange={(e) => setNewReel({ ...newReel, estimatedLoss: e.target.value })}
                    placeholder="e.g. 4 Acres Submerged (₹1,80,000 Loss)"
                    className="w-full border border-[#E2E8E4] rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-[#17211B] mb-1">
                  Ground Narrative / Situation Details
                </label>
                <textarea
                  rows={3}
                  value={newReel.description}
                  onChange={(e) => setNewReel({ ...newReel, description: e.target.value })}
                  placeholder="Describe the current ground condition, water depth, immediate help required, or instructions..."
                  className="w-full border border-[#E2E8E4] rounded-xl px-3 py-2 text-xs"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[#E2E8E4]">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#65736B] hover:bg-[#F7F9F8] border border-[#E2E8E4] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#146B3A] hover:bg-[#1F8A4C] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Upload className="w-4 h-4" /> Publish Disaster Reel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
