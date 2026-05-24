import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Menu, X, Phone, Globe, ShoppingBag,
  MapPin, Clock, Cloud, Newspaper,
  Image as ImageIcon, Users, MessageSquare,
  Facebook, Instagram, Mail, ChevronRight, Play,
  Home, Coffee, Heart, BookOpen, Camera, Zap, Leaf, Sun, Moon
} from 'lucide-react';
import { Routes, Route, Link, useParams } from 'react-router-dom';
import { VILLE_DATA } from './data';
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

const IconMap = { MapPin, Home, Coffee, Users, Leaf, Heart, BookOpen, Camera, Zap };

// Weather condition code mapping (WMO codes)
const getWeatherInfo = (code) => {
  const map = {
    0: { label: 'صافٍ', icon: '☀️' },
    1: { label: 'صافٍ جزئياً', icon: '🌤️' },
    2: { label: 'غائم جزئياً', icon: '⛅' },
    3: { label: 'غائم', icon: '☁️' },
    45: { label: 'ضبابي', icon: '🌫️' },
    48: { label: 'ضبابي', icon: '🌫️' },
    51: { label: 'رذاذ خفيف', icon: '🌦️' },
    61: { label: 'مطر خفيف', icon: '🌧️' },
    63: { label: 'مطر معتدل', icon: '🌧️' },
    65: { label: 'مطر غزير', icon: '⛈️' },
    80: { label: 'زخات مطر', icon: '🌦️' },
    95: { label: 'عاصفة رعدية', icon: '⛈️' },
  };
  return map[code] || { label: 'متغير', icon: '🌡️' };
};

const DAYS_AR = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

function WeatherSection() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

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
    <div className="weather-section-loading"><Cloud size={40} className="spin" /><p>جارٍ تحميل الطقس...</p></div>
  );
  if (!weather) return null;

  const cur = weather.current;
  const { label, icon } = getWeatherInfo(cur.weather_code);

  // Hourly: next 7 slots from current hour
  const nowHour = new Date().getHours();
  const hourlySlice = weather.hourly.time
    .map((t, i) => ({ time: t, temp: weather.hourly.temperature_2m[i], code: weather.hourly.weather_code[i] }))
    .filter(h => new Date(h.time).getHours() >= nowHour)
    .slice(0, 7);

  // Daily: 7 days
  const dailyDays = weather.daily.time.map((t, i) => {
    const d = new Date(t);
    return {
      dayName: i === 0 ? 'اليوم' : DAYS_AR[d.getDay()],
      max: Math.round(weather.daily.temperature_2m_max[i]),
      min: Math.round(weather.daily.temperature_2m_min[i]),
      code: weather.daily.weather_code[i],
    };
  });

  return (
    <div className="weather-section">
      {/* Current weather card */}
      <div className="weather-main-card">
        <div className="weather-location">
          <MapPin size={16} />
          <span>أورير جعافرة، برج بوعريريج</span>
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
              <span>الرطوبة</span>
              <strong>{cur.relative_humidity_2m}%</strong>
            </div>
            <div className="weather-detail-item">
              <span>💨</span>
              <span>الرياح</span>
              <strong>{Math.round(cur.wind_speed_10m)} km/h</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Hourly strip */}
      <div className="weather-hourly glass-card">
        <h4>توقعات ساعة بساعة</h4>
        <div className="weather-hours">
          {hourlySlice.map((h, i) => {
            const { icon: hIcon } = getWeatherInfo(h.code);
            const hDate = new Date(h.time);
            const timeLabel = i === 0 ? 'الآن' : hDate.toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' });
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

      {/* 7-day forecast */}
      <div className="weather-daily glass-card">
        <h4>توقعات الأيام القادمة</h4>
        <div className="weather-daily-grid">
          {dailyDays.map((d, i) => {
            const { icon: dIcon, label: dLabel } = getWeatherInfo(d.code);
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
        <a
          href="https://ar.dzmeteo.com/%D8%A3%D8%AD%D9%88%D8%A7%D9%84-%D8%A7%D9%84%D8%B7%D9%82%D8%B3-%D9%81%D9%8A_%D8%A7%D9%84%D8%AC%D8%B9%D8%A7%D9%81%D8%B1%D8%A9_%D8%A8%D8%B1%D8%AC-%D8%A8%D9%88%D8%B9%D8%B1%D9%8A%D8%B1%D9%8A%D8%AC"
          target="_blank"
          rel="noopener noreferrer"
          className="weather-more-link"
        >
          عرض التفاصيل الكاملة على dzmeteo ←
        </a>
      </div>
    </div>
  );
}

function TopicPage() {
  const { id } = useParams();
  const topic = VILLE_DATA.villageTopics?.find(t => t.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!topic) return <div className="container" style={{ padding: '200px 0', textAlign: 'center' }}><h2>موضوع غير موجود</h2><Link to="/" className="cta-button">العودة للرئيسية</Link></div>;

  return (
    <div className="topic-page fade-in">
      <div className="topic-hero">
        <div className="container">
          <Link to="/" className="back-link">
            <ChevronRight /> العودة للرئيسية
          </Link>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>{topic.title}</motion.h1>
        </div>
      </div>
      <div className="container">
        <motion.div className="topic-body" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <p>{topic.content}</p>
        </motion.div>
      </div>
    </div>
  );
}

function App() {
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
  const heroImages = [heroImg1, heroImg2, heroImg3, heroImg4, heroImg5, heroImg6, heroImg7, heroImg8, heroImg9];
  const fbFeedRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Hero image slideshow
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setHeroSlide(prev => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(slideTimer);
  }, [heroImages.length]);

  useEffect(() => {
    // Simulated weather fetch - in real app would use OpenWeatherMap
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

  // Re-parse Facebook embeds when component mounts
  useEffect(() => {
    const parseFB = () => {
      if (window.FB) {
        window.FB.XFBML.parse();
      }
    };
    const timer = setTimeout(parseFB, 1000);
    // Re-parse periodically to catch new posts
    const interval = setInterval(parseFB, 300000); // every 5 min
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="app">
      {/* Navigation */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container nav-container">
          <div className="logo">
            <img src={logoImg} alt="أخبار أورير جعافرة" className="logo-img" />
            <span>{VILLE_DATA.name}</span>
          </div>

          <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
            {VILLE_DATA.navLinks.map((link, i) => (
              <a key={i} href={link.href} className="nav-link">{link.name}</a>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
            {/* Hero Section */}
            <header id="home" className="hero">
              <div className="hero-slideshow">
                {heroImages.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`أورير جعافرة ${index + 1}`}
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
                  <Link to="/topic/history" className="cta-button">اكتشف تاريخنا</Link>
                  <div className="weather-widget glass-card">
                    <Cloud className="accent-icon" />
                    <span>أورير: {weather.temp}°C</span>
                    <Clock className="accent-icon" />
                    <span>{currentTime.toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </motion.div>
            </header>

            {/* Breaking News Ticker */}
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

            {/* Latest News - Live from Facebook */}
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
                    <span>مباشر</span>
                  </div>
                  <h2 className="gradient-text">احدث منشوراتنا</h2>
                </div>

                <div className="news-main-layout">
                  {/* Special Highlight Card */}
                  <div className="special-side-card glass-card">
                    <div className="special-side-content">
                      <span className="category-tag pulse-animation">مميز</span>
                      <h3>نبض أورير جعافرة</h3>
                      <p>تعرف أكثر على تاريخ، ثقافة، وعادات قريتنا العريقة. قرية تجمع بين سحر الطبيعة وعراقة التاريخ. نتشبث بأصالتنا ونواكب العصر الرقمي لخدمة مجتمعنا أينما كانوا.</p>
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

                  {/* Main Feed - Live from Facebook */}
                  <div className="news-feed-card glass-card">
                    <div className="news-feed-header">
                      <div className="news-feed-brand">
                        <img src={logoImg} alt="أورير جعافرة" className="news-feed-logo" />
                        <div>
                          <h3>أخبار أورير جعافرة</h3>
                          <span className="news-feed-handle">@84Aourir · فيسبوك</span>
                        </div>
                      </div>
                      <div className="news-live-indicator">
                        <span className="live-dot"></span>
                        تحديث مباشر
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
                        <blockquote cite="https://www.facebook.com/84Aourir" className="fb-xfbml-parse-ignore">
                          <a href="https://www.facebook.com/84Aourir">أخبار اورير جعافرة</a>
                        </blockquote>
                      </div>
                    </div>

                    <div className="news-feed-footer">
                      <div className="news-footer-stats">
                        <div className="news-stat-item">
                          <Users size={18} />
                          <span><strong>28,783+</strong> متابع</span>
                        </div>
                        <div className="news-stat-item">
                          <MessageSquare size={18} />
                          <span><strong>1,625+</strong> يتحدثون</span>
                        </div>
                        <div className="news-stat-item">
                          <Newspaper size={18} />
                          <span>تحديث كل <strong>5 دقائق</strong></span>
                        </div>
                      </div>
                      <a
                        href="https://www.facebook.com/84Aourir"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="news-follow-btn"
                      >
                        <Facebook size={18} />
                        تابع الصفحة على فيسبوك
                      </a>
                      <a
                        href="https://www.instagram.com/aourirdjaafra83?igsh=MWdsaGNuZ3NueDJ4aA=="
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ig-follow-btn"
                      >
                        <Instagram size={18} />
                        تابعنا على انستغرام
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>


            {/* Weather Section */}
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
                  <h2 className="gradient-text">الأحوال الجوية</h2>
                  <p>طقس اورير جعافرة، برج بوعريريج — محدّث تلقائياً</p>
                </div>
                <WeatherSection />
              </div>
            </motion.section>


            {/* Location Section */}
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
                  <h2 className="gradient-text">الموقع الجغرافي</h2>
                  <p>اكتشف موقع قرية أورير جعافرة على الخريطة</p>
                </div>
                <div className="location-container glass-card">
                  <div className="location-info">
                    <div className="location-details">
                      <h3>أورير، بلدية جعافرة</h3>
                      <p>تقع قرية أورير في قمة جبلية خلابة بشمال ولاية برج بوعريريج، تتميز بإطلالة ساحرة وهواء نقي.</p>
                      <ul className="location-points">
                        <li><MapPin size={18} /> ولاية برج بوعريريج</li>
                        <li><MapPin size={18} /> دائرة جعافرة</li>
                        <li><MapPin size={18} /> بلدية جعافرة</li>
                      </ul>
                      <a 
                        href={VILLE_DATA.mapLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="cta-button"
                        style={{ marginTop: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                      >
                        <Globe size={18} /> فتح في خرائط جوجل
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
                        title="موقع أورير جعافرة"
                      ></iframe>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Gallery Teaser */}
            <motion.section
              id="gallery"
              className="section-padding container"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <div className="section-header">
                <h2>ألبوم صور أورير</h2>
                <p>جمال الطبيعة وهوية القرية في صور</p>
              </div>
              <div className="gallery-grid">
                <div className="gallery-item video-container">
                  <iframe
                    src="https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Freel%2F2719739581726324&show_text=false&t=0&autoplay=1&mute=1"
                    scrolling="no"
                    frameBorder="0"
                    allowFullScreen={true}
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  ></iframe>
                </div>
                <div className="gallery-item uniform-item" style={{ backgroundImage: `url(${heroImages[(heroSlide + 3) % heroImages.length]})` }}></div>
                <div className="gallery-item uniform-item" style={{ backgroundImage: `url(${heroImg5})` }}></div>
                <div className="gallery-item uniform-item" style={{ backgroundImage: `url(${heroImg3})` }}></div>
              </div>
            </motion.section>
          </>
        } />
        <Route path="/topic/:id" element={<TopicPage />} />
      </Routes>

      {/* Footer */}
      <footer id="contact" className="footer">
        <div className="container footer-grid">
          <div className="footer-info">
            <div className="footer-brand">
              <img src={logoImg} alt="أخبار أورير جعافرة" className="logo-img footer-logo-img" />
              <span className="footer-brand-name">أورير جعافرة</span>
            </div>
            <p>الذاكرة الرقمية والمنبر الإعلامي لقرية أورير جعافرة. نحن هنا لنربط الماضي بالحاضر.</p>
            <div className="social-links">
              <a href="https://www.facebook.com/84Aourir" target="_blank" rel="noopener noreferrer"><Facebook /></a>
              <a href="https://www.instagram.com/aourirdjaafra83?igsh=MWdsaGNuZ3NueDJ4aA==" target="_blank" rel="noopener noreferrer"><Instagram /></a>
            </div>
          </div>

          <div className="footer-links">
            <h4>روابط سريعة</h4>
            <ul>
              <li><Link to="/topic/history">تاريخ القرية</Link></li>
              <li><Link to="/topic/culture">العمل التضامني والعادات</Link></li>
              <li><a href="#gallery">ألبوم صور القرية</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom container">
          <p>© 2026 جميع الحقوق محفوظة لقرية أورير جعافرة</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
