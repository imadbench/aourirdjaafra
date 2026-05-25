import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, Phone, Globe, ShoppingBag,
  MapPin, Clock, Cloud, Newspaper,
  Image as ImageIcon, Users, MessageSquare,
  Facebook, Instagram, Mail, ChevronRight, ChevronLeft, Play,
  Home, Coffee, Heart, BookOpen, Camera, Zap, Leaf, Sun, Moon, ZoomIn, ExternalLink
} from 'lucide-react';
import { Routes, Route, Link, useParams } from 'react-router-dom';
import { UI_TRANSLATIONS } from './translations';


const BookPage = React.forwardRef((props, ref) => {
  return (
    <div className={`martyrs-book-page ${props.className || ''}`} ref={ref}>
      <div className="martyrs-book-page-content">
        {props.children}
      </div>
    </div>
  );
});
import './App.css';
import logoImg from './assets/images/logo.jpg';
import heroImg1 from './assets/images/5807817218069303271_121.jpg';
import heroImg2 from './assets/images/5807817218069303272_121.jpg';
import heroImg3 from './assets/images/5807933693287402989_120.jpg';
import heroImg4 from './assets/images/5807933693287402993_121.jpg';
import heroImg5 from './assets/images/5807933693287402995_121.jpg';
import heroImg6 from './assets/images/5807933693287402996_121.jpg';
import heroImg7 from './assets/images/5807933693287402997_121.jpg';
import heroImg8 from './assets/images/5807933693287403092_109.jpg';
import heroImg9 from './assets/images/5807933693287403093_121.jpg';
import heroImg10 from './assets/images/5807933693287403219_121.jpg';
import heroImg11 from './assets/images/5807933693287403221_120.jpg';
import heroImg12 from './assets/images/5807933693287403282_121.jpg';
import heroImg13 from './assets/images/5807933693287403286_120.jpg';
import flagGif from './assets/images/flag.gif';

const IconMap = { MapPin, Home, Coffee, Users, Leaf, Heart, BookOpen, Camera, Zap };
const LangContext = createContext();

const getIconForCode = (code) => {
  const map = {
    0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️', 45: '🌫️', 48: '🌫️',
    51: '🌦️', 61: '🌧️', 63: '🌧️', 65: '⛈️', 80: '🌦️', 95: '⛈️',
  };
  return map[code] || '🌡️';
};

const getWeatherInfo = (code, t) => {
  return { label: t.weather.labels[code] || t.weather.variable, icon: getIconForCode(code) };
};

function WeatherSection() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const { lang, t } = useContext(LangContext);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=36.21&longitude=4.82' +
          '&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code' +
          '&hourly=temperature_2m,weather_code' +
          '&daily=weather_code,temperature_2m_max,temperature_2m_min' +
          '&timezone=Africa%2FAlgiers&forecast_days=7'
        );
        const data = await res.json();
        setWeather(data);
      } catch (e) {
        console.error('Weather fetch failed', e);
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, []);

  if (loading) return (
    <div className="weather-section-loading">
      <Cloud size={40} className="spin" />
      <p>{t.weather.loading}</p>
    </div>
  );
  if (!weather) return null;

  const cur = weather.current;
  const { label, icon } = getWeatherInfo(cur.weather_code, t);

  const nowHour = new Date().getHours();
  const hourlySlice = weather.hourly.time
    .map((time, i) => ({ time, temp: weather.hourly.temperature_2m[i], code: weather.hourly.weather_code[i] }))
    .filter(h => new Date(h.time).getHours() >= nowHour)
    .slice(0, 7);

  const dailyDays = weather.daily.time.map((tTime, i) => {
    const d = new Date(tTime);
    return {
      dayName: i === 0 ? t.weather.today : t.weather.days[d.getDay()],
      max: Math.round(weather.daily.temperature_2m_max[i]),
      min: Math.round(weather.daily.temperature_2m_min[i]),
      code: weather.daily.weather_code[i],
    };
  });

  return (
    <div className="weather-section">
      <div className="weather-main-card">
        <div className="weather-location">
          <MapPin size={16} />
          <span>{t.weather.location}</span>
        </div>
        <div className="weather-current">
          <div className="weather-icon-big">{icon}</div>
          <div className="weather-temp-info">
            <div className="weather-temp-main">{Math.round(cur.temperature_2m)}°C</div>
            <div className="weather-condition">{label}</div>
          </div>
          <div className="weather-details">
            <div className="weather-detail-item">
              <span>💧</span>
              <span>{t.weather.humidity}</span>
              <strong>{cur.relative_humidity_2m}%</strong>
            </div>
            <div className="weather-detail-item">
              <span>💨</span>
              <span>{t.weather.wind}</span>
              <strong>{Math.round(cur.wind_speed_10m)} km/h</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="weather-hourly glass-card">
        <h4>{t.weather.hourlyForecast}</h4>
        <div className="weather-hours">
          {hourlySlice.map((h, i) => {
            const { icon: hIcon } = getWeatherInfo(h.code, t);
            const hDate = new Date(h.time);
            const timeLabel = i === 0 ? t.weather.now : hDate.toLocaleTimeString(lang === 'ar' ? 'ar-DZ' : 'fr-FR', { hour: '2-digit', minute: '2-digit' });
            return (
              <div key={i} className={`weather-hour-item ${i === 0 ? 'current-hour' : ''}`}>
                <span className="hour-time">{timeLabel}</span>
                <span className="hour-icon">{hIcon}</span>
                <span className="hour-temp">{Math.round(h.temp)}°</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="weather-daily glass-card">
        <h4>{t.weather.dailyForecast}</h4>
        <div className="weather-daily-grid">
          {dailyDays.map((d, i) => {
            const { icon: dIcon, label: dLabel } = getWeatherInfo(d.code, t);
            return (
              <div key={i} className={`weather-daily-item ${i === 0 ? 'today' : ''}`}>
                <span className="daily-day">{d.dayName}</span>
                <span className="daily-icon">{dIcon}</span>
                <span className="daily-label">{dLabel}</span>
                <div className="daily-temps">
                  <span className="daily-max">{d.max}°</span>
                  <span className="daily-min">{d.min}°</span>
                </div>
              </div>
            );
          })}
        </div>
        <a href="https://ar.dzmeteo.com/%D8%A3%D8%AD%D9%88%D8%A7%D9%84-%D8%A7%D9%84%D8%B7%D9%82%D8%B3-%D9%81%D9%8A_%D8%A7%D9%84%D8%AC%D8%B9%D8%A7%D9%81%D8%B1%D8%A9_%D8%A8%D8%B1%D8%AC-%D8%A8%D9%88%D8%B9%D8%B1%D9%8A%D8%B1%D9%8A%D8%AC"
          target="_blank" rel="noopener noreferrer" className="weather-more-link">
          {t.weather.moreDetails}
        </a>
      </div>
    </div>
  );
}

/* ─── Martyrs Section ─── */
const MARTYRS_LIST_1 = [
  "بحرية اكلي", "بودوخة مقران", "بودوخة لعياشي", "بودوخة الطاهر", "بودوخة معمر", 
  "بودوخة الرشيد", "بودوخة صالح", "بودوخة سليمان", "بوقجار محمد امزيان", "بوقجار محمد ارزقي",
  "بن وجغيط بلقاسم", "بن وجغيط مزيان", "بن وجغيط احمد", "بن وجغيط البشير", "بن وجغيط سالم", 
  "بن وجغيط ارزقي", "بن وجغيط اكلي", "بن بجطيح عبد الله", "محواش لعياشي", "بن طاطة ارزقي",
  "بن راعي طاهر", "بن تلي عبد المالك", "بن تلي طاهر", "شعلال عيسى", "بوڨطاية طيب",
  "بوقطاية عيسى", "بوقطاية السعيد", "بوقطاية حميدي", "بوقطاية ابراهيم", "بوقطاية ارزقي",
  "بوقطاية البشير", "بوقطاية هاشمي", "بوقطاية اسماعيل", "بسعي عبد الحميد", "بسعي الصديق", 
  "شرنين الحسين", "شرنين ارزقي"
];

const MARTYRS_LIST_2 = [
  "شرنين حميمي", "تشراحين صالح", "تشراحين احسن", "تشراحين شريف", "بن شادي رابح", 
  "بن شادي العربي", "بن شادي ابراهيم", "بن شرنين محمد امقران", "بن قدور محمد", "صانع رابح",
  "صانع اسماعيل", "بوتقوين محمد", "بوتقوين جمعة", "شعلال اسماعيل", "بن مريم محمد ايدير", 
  "بن مريم رابح", "بن مريم البشير", "بن مريم راشيد", "سيسي حسن", "بشاش ارزقي",
  "صانع محمد لخضر", "بشوشان اسماعيل", "شقار عبد الحميد", "اقليب كلثوم", "تاكرومبالت زوليخة", 
  "بسعي حجيلة", "بن وجغيط فطيمة", "شهيد مجهول", "شهيد مجهول", "شهيد مجهول", 
  "شهيد مجهول", "شهيد مجهول", "شهيد مجهول", "شهيد مجهول", "شهيد مجهول", 
  "شهيد مجهول", "شهيد مجهول"
];



/* ─── Lightbox Component ─── */
function Lightbox({ images, startIndex, onClose }) {
  const [current, setCurrent] = useState(startIndex);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') setCurrent(p => (p - 1 + images.length) % images.length);
      if (e.key === 'ArrowRight') setCurrent(p => (p + 1) % images.length);
    };
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [images.length, onClose]);

  return (
    <motion.div
      className="lightbox-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <button className="lightbox-close" onClick={onClose} aria-label="Close"><X size={28} /></button>
      <button
        className="lightbox-nav lightbox-prev"
        onClick={(e) => { e.stopPropagation(); setCurrent(p => (p - 1 + images.length) % images.length); }}
        aria-label="Previous"
      >
        <ChevronRight size={32} />
      </button>
      <motion.div
        className="lightbox-img-wrap"
        key={current}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
      >
        <img src={images[current]} alt={`gallery-${current}`} className="lightbox-img" />
        <div className="lightbox-counter">{current + 1} / {images.length}</div>
      </motion.div>
      <button
        className="lightbox-nav lightbox-next"
        onClick={(e) => { e.stopPropagation(); setCurrent(p => (p + 1) % images.length); }}
        aria-label="Next"
      >
        <ChevronLeft size={32} />
      </button>
    </motion.div>
  );
}

function TopicPage() {
  const { id } = useParams();
  const { lang, t } = useContext(LangContext);
  const [bookSpread, setBookSpread] = useState(0);
  const [flipDir, setFlipDir] = useState(1);
  const topic = t.siteData.villageTopics?.find(tObj => tObj.id === id);
  const [selectedMartyr, setSelectedMartyr] = useState(null);

  const openSearchModal = (name) => {
    if (!name) return;
    setSelectedMartyr(name);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!topic) return (
    <div className="container" style={{ padding: '200px 0', textAlign: 'center' }}>
      <h2>{t.ui.topicNotFound}</h2>
      <Link to="/" className="cta-button">{t.ui.backHome}</Link>
    </div>
  );

  /* ── Special Martyrs Page ── */
  if (id === 'martyrs') {
    return (
      <div className="topic-page fade-in martyrs-topic-page">
        <div className="topic-hero martyrs-topic-hero">
          <div className="container">
            <Link to="/" className="back-link">
              {lang === 'ar' ? <ChevronRight /> : <ChevronLeft />} {t.ui.backHome}
            </Link>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              style={{ color: '#e8c96b', fontSize: 'clamp(2rem,5vw,3.2rem)' }}>
              {topic.title}
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              style={{ color: 'rgba(232,220,200,0.8)', fontSize: '1rem', marginTop: '0.8rem' }}>
              {t.ui.martyrsSubtitle}
            </motion.p>
          </div>
        </div>

        <div style={{ background: 'linear-gradient(160deg,#0d1b0f,#1a2e1c,#0a1208)', minHeight: '60vh', padding: '3rem 0' }}>
          <div className="container">
            <div className="martyrs-badge" style={{ margin: '0 auto 2.5rem', display: 'block', width: 'fit-content' }}>
              {t.ui.martyrsTotal}
            </div>
            <p style={{ textAlign: 'center', color: 'rgba(232,220,200,0.7)', marginBottom: '3rem', fontSize: '1rem', lineHeight: '1.9' }}>
              {t.ui.martyrsDesc}
            </p>

            <div className="open-book-wrapper">
              <h2 className="martyrs-book-title" style={{ fontFamily: "'Amiri', serif", color: '#d5c8a0', fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', marginBottom: '1.5rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(0.4rem, 2vw, 0.8rem)', flexWrap: 'nowrap' }}>
                <img src={flagGif} alt="العلم الجزائري" className="flag-waving" style={{ height: 'clamp(1.8rem, 6vw, 3.5rem)', flexShrink: 0, objectFit: 'contain', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.5))' }} />
                <span>كتاب</span>
                <span style={{ color: '#e8c96b' }}>مجاهدينا</span>
                <img src={flagGif} alt="العلم الجزائري" className="flag-waving" style={{ height: 'clamp(1.8rem, 6vw, 3.5rem)', flexShrink: 0, objectFit: 'contain', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.5))' }} />
              </h2>

              <p style={{ textAlign: 'center', color: '#c9a84c', fontSize: '0.9rem', marginBottom: '1rem', fontWeight: 'bold', animation: 'pulse 2s infinite' }}>
                💡 اضغط على الشهيد للبحث عنه
              </p>

              <div className="open-book">
                <div className="book-spine"></div>
                <div className="book-pages-bottom-edge"></div>

                <AnimatePresence mode="wait" custom={flipDir}>
                  <motion.div key={`spread-${bookSpread}`} className="open-book-spread"
                    custom={flipDir}
                    initial={{ rotateY: flipDir * 90, z: -300, opacity: 0 }}
                    animate={{ rotateY: 0, z: 0, opacity: 1 }}
                    exit={{ rotateY: flipDir * -90, z: -300, opacity: 0 }}
                    transition={{ duration: 0.5, type: "spring", stiffness: 80, damping: 15 }}
                    style={{ perspective: 1500, transformStyle: "preserve-3d" }}>

                    {/* Right Page (Page 1) */}
                    <div className="book-page right-page">
                      <div className="page-wave-right"></div>
                      <ul className="martyrs-list book-martyrs-list">
                        {[...MARTYRS_LIST_1, ...MARTYRS_LIST_2].slice(bookSpread * 10, bookSpread * 10 + 5).map((name, i) => (
                          <motion.li key={`right-${i}`}
                            className={`martyrs-item book-martyr-item ${name === null ? 'martyrs-unknown' : ''}`}
                            initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.05 }}>
                            <span className="book-bullet">🌿</span>
                            <span className="book-name search-link" onClick={() => openSearchModal(name)}>
                              {name === null ? t.ui.martyrsUnknown : name}
                            </span>
                            {name !== null && <span className="martyrs-rip relative-rip">رحمه الله</span>}
                          </motion.li>
                        ))}
                      </ul>
                      <div className="book-page-footer">{bookSpread * 2 + 1}</div>
                    </div>

                    {/* Left Page (Page 2) */}
                    <div className="book-page left-page">
                      <div className="page-wave-left"></div>
                      <ul className="martyrs-list book-martyrs-list">
                        {[...MARTYRS_LIST_1, ...MARTYRS_LIST_2].slice(bookSpread * 10 + 5, bookSpread * 10 + 10).map((name, i) => (
                          <motion.li key={`left-${i}`}
                            className={`martyrs-item book-martyr-item ${name === null ? 'martyrs-unknown' : ''}`}
                            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.05 }}>
                            <span className="book-bullet">🌿</span>
                            <span className="book-name search-link" onClick={() => openSearchModal(name)}>
                              {name === null ? t.ui.martyrsUnknown : name}
                            </span>
                            {name !== null && <span className="martyrs-rip relative-rip">رحمه الله</span>}
                          </motion.li>
                        ))}
                        
                        {(bookSpread === Math.ceil([...MARTYRS_LIST_1, ...MARTYRS_LIST_2].length / 10) - 1) && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ marginTop: '2rem', textAlign: 'center', borderTop: '1px solid rgba(212, 175, 55, 0.2)', paddingTop: '1.5rem' }}>
                            <p style={{ color: '#e8c96b', fontFamily: "'Amiri', serif", fontSize: '0.95rem', marginBottom: '0.8rem' }}>
                              "وَلَا تَحْسَبَنَّ الَّذِينَ قُتِلُوا فِي سَبِيلِ اللَّهِ أَمْوَاتًا ۚ بَلْ أَحْيَاءٌ عِندَ رَبِّهِمْ يُرْزَقُونَ"
                            </p>
                            <p style={{ color: '#e8c96b', fontFamily: "'Amiri', serif", fontSize: '1.1rem', fontStyle: 'italic', margin: 0 }}>
                              رحم الله شهداء الوطن.. المجد والخلود لشهدائنا الأبرار
                            </p>
                          </motion.div>
                        )}
                      </ul>
                      <div className="book-page-footer">{bookSpread * 2 + 2}</div>
                    </div>

                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="book-controls" style={{ marginTop: '2rem' }}>
                <button
                  onClick={() => { setFlipDir(-1); setBookSpread(p => Math.max(0, p - 1)); }}
                  disabled={bookSpread === 0}
                  className="book-btn icon-btn"
                  aria-label="Previous Page"
                >
                  <ChevronRight size={24} />
                </button>
                <div className="book-indicator">
                  {bookSpread + 1} / {Math.ceil([...MARTYRS_LIST_1, ...MARTYRS_LIST_2].length / 10)}
                </div>
                <button
                  onClick={() => { setFlipDir(1); setBookSpread(p => Math.min(Math.ceil([...MARTYRS_LIST_1, ...MARTYRS_LIST_2].length / 10) - 1, p + 1)); }}
                  disabled={bookSpread >= Math.ceil([...MARTYRS_LIST_1, ...MARTYRS_LIST_2].length / 10) - 1}
                  className="book-btn icon-btn"
                  aria-label="Next Page"
                >
                  <ChevronLeft size={24} />
                </button>
              </div>

              <div style={{ textAlign: 'center', marginTop: '3.5rem', color: '#e8c96b', fontFamily: "'Amiri', serif", textShadow: '0 2px 8px rgba(0,0,0,0.5)', opacity: 0.9 }}>
                <p style={{ fontSize: 'clamp(1.1rem, 3.5vw, 1.4rem)', marginBottom: '1rem' }}>
                  "وَلَا تَحْسَبَنَّ الَّذِينَ قُتِلُوا فِي سَبِيلِ اللَّهِ أَمْوَاتًا ۚ بَلْ أَحْيَاءٌ عِندَ رَبِّهِمْ يُرْزَقُونَ"
                </p>
                <p style={{ fontSize: 'clamp(1.2rem, 4vw, 1.6rem)', fontStyle: 'italic' }}>
                  رحم الله شهداء الوطن.. المجد والخلود لشهدائنا الأبرار
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Research Modal */}
        <AnimatePresence>
          {selectedMartyr && (
            <motion.div 
              className="research-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMartyr(null)}
            >
              <motion.div 
                className="research-modal-card glass-card"
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="simple-search-header">
                  <div className="header-nav-group">
                    <button className="simple-back-btn" onClick={() => setSelectedMartyr(null)}>
                      <ChevronRight size={20} /> رجوع
                    </button>
                  </div>
                  
                  <button className="simple-close-btn" onClick={() => setSelectedMartyr(null)} aria-label="إغلاق">
                    إنهاء <X size={20} />
                  </button>
                </div>

                <div className="research-modal-body simple-view">
                  <div className="simple-results-container">
                    <iframe 
                      src={`https://www.google.com/search?q=${encodeURIComponent(selectedMartyr + ' اهم معلومات هذا الشهيد')}&igu=1&hl=ar`}
                      title="Google Search"
                      className="simple-iframe"
                      onLoad={(e) => {
                        const loader = e.target.parentElement.querySelector('.simple-loader-overlay');
                        if (loader) loader.style.display = 'none';
                      }}
                    ></iframe>

                    <div className="simple-loader-overlay">
                      <div className="simple-spinner"></div>
                      <p>جاري تحميل نتائج جوجل...</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }


  return (
    <div className="topic-page fade-in">
      <div className="topic-hero">
        <div className="container">
          <Link to="/" className="back-link">
            {lang === 'ar' ? <ChevronRight /> : <ChevronLeft />} {t.ui.backHome}
          </Link>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>{topic.title}</motion.h1>
        </div>
      </div>
      <div className="container">
        <motion.div className="topic-body" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          {topic.content.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </motion.div>
      </div>
    </div>
  );
}


function AppContent() {
  const { lang, setLang, t } = useContext(LangContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const [weather, setWeather] = useState({ temp: 18, condition: 'صافي' });
  const [heroSlide, setHeroSlide] = useState(0);
  const [videoSlide, setVideoSlide] = useState(0);
  const heroImages = [heroImg1, heroImg2, heroImg3, heroImg4, heroImg5, heroImg6, heroImg7, heroImg8, heroImg9, heroImg10, heroImg11, heroImg12, heroImg13];
  const fbFeedRef = useRef(null);

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const galleryImages = [heroImg1, heroImg2, heroImg4, heroImg5, heroImg6, heroImg7, heroImg8, heroImg9, heroImg3, heroImg10, heroImg11, heroImg12, heroImg13];
  const openLightbox = (idx) => { setLightboxIndex(idx); setLightboxOpen(true); };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setHeroSlide(prev => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(slideTimer);
  }, [heroImages.length]);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch('https://wttr.in/Aourir?format=j1');
        const data = await response.json();
        if (data && data.current_condition) {
          setWeather({
            temp: data.current_condition[0].temp_C,
            condition: data.current_condition[0].weatherDesc[0].value
          });
        }
      } catch (e) {
        console.error("Weather fetch failed", e);
      }
    };
    fetchWeather();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const parseFB = () => {
      if (window.FB) {
        window.FB.XFBML.parse();
      }
    };
    const timer = setTimeout(parseFB, 1000);
    const interval = setInterval(parseFB, 300000);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [lang]); // Re-parse when lang changes if needed

  const VILLE_DATA = t.siteData;

  return (
    <div className={`app ${lang === 'fr' ? 'ltr-mode' : 'rtl-mode'}`} dir={t.dir}>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container nav-container">
          <div className="logo">
            <img src={logoImg} alt={VILLE_DATA.name} className="logo-img" />
            <span>{VILLE_DATA.name}</span>
          </div>

          <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
            {VILLE_DATA.navLinks.map((link, i) => (
              <a key={i} href={`/${link.href}`} className="nav-link" onClick={() => setIsMenuOpen(false)}>{link.name}</a>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setLang(lang === 'ar' ? 'fr' : 'ar')}
              className="lang-toggle-btn"
              style={{
                background: 'var(--primary)', color: '#fff', border: 'none', padding: '0.4rem 0.8rem',
                borderRadius: '20px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 'bold'
              }}
            >
              {t.language}
            </button>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="theme-toggle-btn"
              style={{ background: 'transparent', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', border: '1px solid var(--primary)', transition: 'all 0.3s ease' }}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </div>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={
          <>
            <header id="home" className="hero">
              <div className="hero-slideshow">
                {heroImages.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${VILLE_DATA.name} ${index + 1}`}
                    className={`hero-slide ${index === heroSlide ? 'active' : ''}`}
                  />
                ))}
              </div>
              <div className="hero-overlay"></div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="hero-content container"
              >
                <h1>{VILLE_DATA.title}</h1>
                <p>{VILLE_DATA.heroDescription}</p>
                <div className="hero-btns">
                  <Link to="/topic/history" className="cta-button">{t.ui.exploreHistory}</Link>
                  <div className="weather-widget glass-card">
                    <Cloud className="accent-icon" />
                    <span>{t.weather.tempContext}: {weather.temp}°C</span>
                    <Clock className="accent-icon" />
                    <span>{currentTime.toLocaleTimeString(lang === 'ar' ? 'ar-DZ' : 'fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </motion.div>
            </header>

            <section className="ticker-wrap">
              <div className="ticker">
                {VILLE_DATA.breakingNews.map((news, i) => (
                  <span key={i} className="ticker-item">● {news}</span>
                ))}
                {VILLE_DATA.breakingNews.map((news, i) => (
                  <span key={i + 'copy'} className="ticker-item">● {news}</span>
                ))}
              </div>
            </section>

            <motion.section
              id="news"
              className="section-padding live-news-section"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <div className="container">
                <div className="section-header">
                  <div className="news-header-badge">
                    <span className="live-dot"></span>
                    <span>{t.ui.live}</span>
                  </div>
                  <h2 className="gradient-text">{t.ui.latestPosts}</h2>
                </div>

                <div className="news-main-layout">
                  <div className="special-side-card glass-card">
                    <div className="special-side-content">
                      <span className="category-tag pulse-animation">{t.ui.featured}</span>
                      <h3>{t.ui.villageHeartbeat}</h3>
                      <p>{t.ui.heartbeatDesc}</p>
                      <div className="explore-grid">
                        {VILLE_DATA.villageTopics?.map(topic => {
                          const Icon = IconMap[topic.icon] || MapPin;
                          return (
                            <Link to={`/topic/${topic.id}`} key={topic.id} className="explore-card topic-card-mini">
                              <div className="explore-icon"><Icon size={20} /></div>
                              <h3>{topic.title}</h3>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="news-feed-card glass-card">
                    <div className="news-feed-header">
                      <div className="news-feed-brand">
                        <img src={logoImg} alt={VILLE_DATA.name} className="news-feed-logo" />
                        <div>
                          <h3>{VILLE_DATA.name}</h3>
                          <span className="news-feed-handle">@84Aourir · FaceBook</span>
                        </div>
                      </div>
                      <div className="news-live-indicator">
                        <span className="live-dot"></span>
                        {t.ui.liveUpdate}
                      </div>
                    </div>

                    <div className="news-feed-body" ref={fbFeedRef}>
                      <div
                        className="fb-page"
                        data-href="https://www.facebook.com/84Aourir"
                        data-tabs="timeline"
                        data-width="500"
                        data-height="800"
                        data-small-header="true"
                        data-adapt-container-width="true"
                        data-hide-cover="true"
                        data-show-facepile="false"
                      >
                      </div>
                    </div>

                    <div className="news-feed-footer">
                      <div className="news-footer-stats">
                        <div className="news-stat-item">
                          <Users size={18} />
                          <span><strong>28,783+</strong> {t.ui.followers}</span>
                        </div>
                        <div className="news-stat-item">
                          <MessageSquare size={18} />
                          <span><strong>1,625+</strong> {t.ui.talking}</span>
                        </div>
                        <div className="news-stat-item">
                          <Newspaper size={18} />
                          <span>{t.ui.updateEvery} <strong>{t.ui.fiveMins}</strong></span>
                        </div>
                      </div>
                      <a href="https://www.facebook.com/84Aourir" target="_blank" rel="noopener noreferrer" className="news-follow-btn">
                        <Facebook size={18} />
                        {t.ui.followFb}
                      </a>
                      <a href="https://www.instagram.com/aourirdjaafra83?igsh=MWdsaGNuZ3NueDJ4aA==" target="_blank" rel="noopener noreferrer" className="ig-follow-btn">
                        <Instagram size={18} />
                        {t.ui.followIg}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            <motion.section
              id="services"
              className="section-padding"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6 }}
            >
              <div className="container">
                <div className="section-header">
                  <h2 className="gradient-text">{t.weather.weatherTitle}</h2>
                  <p>{t.weather.weatherDesc}</p>
                </div>
                <WeatherSection />
              </div>
            </motion.section>

            <motion.section
              id="location"
              className="section-padding bg-light"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="container">
                <div className="section-header">
                  <h2 className="gradient-text">{t.ui.geoLoc}</h2>
                  <p>{t.ui.exploreMap}</p>
                </div>
                <div className="location-container glass-card">
                  <div className="location-info">
                    <div className="location-details">
                      <h3>{t.ui.villageName}</h3>
                      <p>{t.ui.villageDesc}</p>
                      <ul className="location-points">
                        <li><MapPin size={18} /> {t.ui.state}</li>
                        <li><MapPin size={18} /> {t.ui.district}</li>
                        <li><MapPin size={18} /> {t.ui.commune}</li>
                      </ul>
                      <a
                        href={VILLE_DATA.mapLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cta-button"
                        style={{ marginTop: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                      >
                        <Globe size={18} /> {t.ui.openGmaps}
                      </a>
                    </div>
                    <div className="map-wrapper">
                      <iframe
                        src={VILLE_DATA.mapEmbedUrl}
                        width="100%"
                        height="450"
                        style={{ border: 0, borderRadius: '1rem' }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title={t.ui.geoLoc}
                      ></iframe>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            <motion.section
              id="gallery"
              className="section-padding container"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <div className="section-header">
                <h2>{t.ui.galleryTitle}</h2>
                <p>{t.ui.galleryDesc}</p>
              </div>
              <div className="gallery-grid">
                <div className="gallery-item video-container">
                  <iframe
                    key={videoSlide}
                    src={[
                      "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Freel%2F2719739581726324&show_text=false&t=0",
                      "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1229025582651075&show_text=false&t=0"
                    ][videoSlide]}
                    scrolling="no"
                    frameBorder="0"
                    allowFullScreen={true}
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  ></iframe>
                  <button className="video-nav video-nav-right" onClick={() => setVideoSlide(p => (p - 1 + 2) % 2)} aria-label="الفيديو السابق">
                    <ChevronRight size={22} />
                  </button>
                  <button className="video-nav video-nav-left" onClick={() => setVideoSlide(p => (p + 1) % 2)} aria-label="الفيديو التالي">
                    <ChevronLeft size={22} />
                  </button>
                </div>
                {/* Zoomable image items */}
                {[
                  heroImages[(heroSlide + 3) % heroImages.length],
                  heroImg5,
                  heroImg3
                ].map((img, idx) => (
                  <div
                    key={idx}
                    className="gallery-item uniform-item gallery-zoomable"
                    style={{ backgroundImage: `url(${img})` }}
                    onClick={() => openLightbox(galleryImages.indexOf(img) >= 0 ? galleryImages.indexOf(img) : idx)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && openLightbox(galleryImages.indexOf(img) >= 0 ? galleryImages.indexOf(img) : idx)}
                    aria-label={`${t.ui.galleryTitle} ${idx + 1}`}
                  >
                    <div className="gallery-zoom-hint"><ZoomIn size={22} /></div>
                  </div>
                ))}
              </div>
            </motion.section>
          </>
        } />
        <Route path="/topic/:id" element={<TopicPage />} />
      </Routes>

      <footer id="contact" className="footer">
        <div className="container footer-grid">
          <div className="footer-info">
            <div className="footer-brand">
              <img src={logoImg} alt={VILLE_DATA.name} className="logo-img footer-logo-img" />
              <span className="footer-brand-name">{VILLE_DATA.name}</span>
            </div>
            <p>{t.ui.footerDesc}</p>
            <div className="social-links">
              <a href="https://www.facebook.com/84Aourir" target="_blank" rel="noopener noreferrer"><Facebook /></a>
              <a href="https://www.instagram.com/aourirdjaafra83?igsh=MWdsaGNuZ3NueDJ4aA==" target="_blank" rel="noopener noreferrer"><Instagram /></a>
            </div>
          </div>

          <div className="footer-links">
            <h4>{t.ui.quickLinks}</h4>
            <ul>
              <li><Link to="/topic/history">{t.ui.historyLink}</Link></li>
              <li><Link to="/topic/culture">{t.ui.customsLink}</Link></li>
              <li><a href="#gallery">{t.ui.galleryLink}</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom container">
          <p>{t.ui.rights}</p>
        </div>
      </footer>
      {/* Lightbox Portal */}
      {lightboxOpen && (
        <Lightbox
          images={galleryImages}
          startIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
}

export default function App() {
  const [lang, setLang] = useState('ar'); // 'ar' or 'fr'
  const t = UI_TRANSLATIONS[lang];

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = t.dir;
  }, [lang, t]);

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      <AppContent />
    </LangContext.Provider>
  );
}
