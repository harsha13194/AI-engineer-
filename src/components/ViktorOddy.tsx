import React, { useState, useEffect, useRef, MouseEvent } from "react";
import { Quote, Star, ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Webflow CDN references for PP Montreal
const PP_MONTREAL_URL = 'https://assets.website-files.com/6009ec8cda7f305645c9d91b/60176f9bb43e36419997ecfe_PPNeueMontreal-Book.otf';
const PP_MONTREAL_MEDIUM_URL = 'https://assets.website-files.com/6009ec8cda7f305645c9d91b/60176f9b39c5673e51a86f5a_PPNeueMontreal-Medium.otf';

// Image arrays
const MARQUEE_IMAGES = [
  "https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif",
  "https://motionsites.ai/assets/hero-portfolio-cosmic-preview-BpvWJ3Nc.gif",
  "https://motionsites.ai/assets/hero-velorah-preview-CJNTtbpd.gif",
  "https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif",
  "https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif",
  "https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif",
  "https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif",
  "https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif"
];

const TESTIMONIALS = [
  {
    name: "Marcus Anderson",
    role: "CEO, Data.storage",
    avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150",
    text: "With very little guidance the engineering team delivered designs that were consistently spot on. Viktor is an absolute prodigy when it comes to Apple-level software layouts."
  },
  {
    name: "Alex Wu",
    role: "Founder, Nexgate",
    avatar: "https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=150",
    text: "Viktor led the creation of our best fundraising deck to date! His eye for high contrast, sophisticated typography single-handedly closed our seed round with style."
  },
  {
    name: "James Mitchell",
    role: "VP Product, LaunchPad",
    avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150",
    text: "Working with Viktor deeply transformed our product vision. We went from a boring enterprise table dashboard into a pristine design statement."
  },
  {
    name: "Rachel Foster",
    role: "Co-founder, Nexus Labs",
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150",
    text: "The design craftsmanship exceeded all expectations. We bought the monthly partnership, and it feels like having Apple designers direct command on Slack."
  },
  {
    name: "David Zhang",
    role: "Head of Design, Paradigm Labs",
    avatar: "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150",
    text: "Incredible work from start to finish. He respects negative space, has absolute discipline over sizing, and delivers templates that are production executable immediately."
  }
];

const PROJECTS = [
  {
    id: "proj_1",
    name: "evr",
    desc: "From idea to millions raised for a web3 AI product",
    img: "https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif"
  },
  {
    id: "proj_2",
    name: "Automation Machines",
    desc: "Streamlining industrial automation processes",
    img: "https://motionsites.ai/assets/hero-automation-machines-preview-DlTveRIN.gif"
  },
  {
    id: "proj_3",
    name: "xPortfolio",
    desc: "Modern portfolio management platform",
    img: "https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif"
  }
];

export default function ViktorOddy() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; rotate: number; img: string }[]>([]);
  const partnerRef = useRef<HTMLDivElement>(null);
  const lastSpawn = useRef<number>(0);

  // Parallax scrolling hooks for Chris Halaska portrait
  const [parallaxY, setParallaxY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      if (!window.requestAnimationFrame) return;
      window.requestAnimationFrame(() => {
        const scrolled = window.scrollY;
        setParallaxY(Math.min(120, Math.max(-120, scrolled * 0.15 - 80)));
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Slider controls for Testimonials Carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Hover Spawner particle generator for Partner with us
  const handlePartnerMouseMove = (e: MouseEvent) => {
    if (!partnerRef.current) return;
    const now = Date.now();
    if (now - lastSpawn.current < 80) return; // limit spawning rates
    lastSpawn.current = now;

    const bounds = partnerRef.current.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;

    // random rotation -10 to +10
    const rotate = Math.floor(Math.random() * 20) - 10;
    const randImg = MARQUEE_IMAGES[Math.floor(Math.random() * MARQUEE_IMAGES.length)];

    const id = Math.random();
    setParticles((prev) => [...prev, { id, x, y, rotate, img: randImg }]);

    // cleanup after 1s fade-out window
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== id));
    }, 1000);
  };

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  return (
    <div className="bg-white min-h-screen text-[#051A24] font-sans overflow-x-hidden selection:bg-[#051A24]/10 select-none pb-24">
      {/* 1. HERO SECTION */}
      <section className="max-w-[440px] mx-auto px-6 pt-12 md:pt-16 pb-12 flex flex-col items-center text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-[32px] md:text-[40px] lg:text-[44px] font-semibold tracking-tight text-[#051A24] mb-3 font-serif"
          style={{ fontFamily: "'PP Mondwest', Garamond, 'Big Caslon', serif" }}
        >
          Viktor Oddy
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-mono text-xs text-[#051A24]/70 mb-4 tracking-widest uppercase"
        >
          The creative studio of Viktor Oddy
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-[32px] md:text-[40px] lg:text-[44px] leading-[1.1] text-[#0D212C] font-semibold tracking-tight flex flex-col whitespace-nowrap"
        >
          <span>Build the next wave,</span>
          <span className="font-serif italic" style={{ fontFamily: "'PP Mondwest', Georgia, serif" }}>the bold way.</span>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col gap-5 text-sm md:text-base text-[#051A24]/90 leading-relaxed mt-6 text-left"
        >
          <p>
            I spent seven years at <span className="font-serif" style={{ fontFamily: "'PP Mondwest', serif" }}>Apple</span> crafting products used by over a billion people. I founded Vortex Studio to bring that same level of thinking to innovators shaping what comes next.
          </p>
          <p>
            The studio is deliberately small. I guide the creative vision on every project, backed by a veteran design crew that moves fast without cutting corners.
          </p>
          <p className="font-semibold text-[#051A24]">
            Projects start at <span className="underline decoration-indigo-300">$5,000</span> per month.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 w-full"
        >
          <a 
            href="#chat" 
            className="flex-1 bg-[#051A24] text-white rounded-full px-7 py-3 text-sm font-semibold transition-transform duration-200 active:scale-95 text-center shadow-[0_1px_2px_0_rgba(5,26,36,0.1),0_4px_4px_0_rgba(5,26,36,0.09),0_9px_6px_0_rgba(5,26,36,0.05),0_17px_7px_0_rgba(5,26,36,0.01),inset_0_2px_8px_0_rgba(255,255,255,0.25)]"
          >
            Start a chat
          </a>
          <a 
            href="#work" 
            className="flex-1 bg-white text-[#051A24] rounded-full px-7 py-3 text-sm font-semibold hover:bg-slate-50 transition-colors border border-slate-100 text-center shadow-[0_4px_30px_rgba(0,0,0,0.04)]"
          >
            View projects
          </a>
        </motion.div>
      </section>

      {/* 2. INFINITE MARQUEE */}
      <section className="relative w-full overflow-hidden mt-12 md:mt-16 mb-20 py-2 border-y border-slate-100 bg-slate-50">
        <div className="flex animate-[marquee_45s_linear_infinite] whitespace-nowrap hover:[animation-play-state:paused]">
          {[...MARQUEE_IMAGES, ...MARQUEE_IMAGES, ...MARQUEE_IMAGES].map((img, idx) => (
            <div key={idx} className="inline-block flex-shrink-0 mx-3">
              <img 
                src={img} 
                alt="Studio creation clip" 
                className="h-[200px] md:h-[380px] w-auto max-w-sm md:max-w-xl object-cover rounded-2xl shadow-md border border-slate-100" 
                referrerPolicy="no-referrer"
              />
            </div>
          ))}
        </div>
      </section>

      {/* 3. TESTIMONIAL QUOTE SECTION */}
      <section className="py-12 px-6 max-w-2xl mx-auto flex flex-col items-center text-center space-y-6">
        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-800">
          <Quote className="h-5 w-5 fill-current" />
        </div>
        <h2 
          className="text-2xl md:text-3xl lg:text-4xl leading-[1.2] text-[#0D212C] font-semibold tracking-tight"
        >
          "I left <span className="font-serif italic text-indigo-950" style={{ fontFamily: "'PP Mondwest', serif" }}>Apple</span> to build the studio I always wanted to work with"
        </h2>
        <p className="text-sm font-semibold tracking-wider uppercase text-slate-400 font-mono italic">
          — VIKTOR ODDY, FOUNDER
        </p>

        {/* Brand partners */}
        <div className="flex items-center gap-10 opacity-70 p-4 border-t border-slate-100 w-full justify-center">
          <span className="font-serif font-bold text-lg" style={{ width: "80px" }}>Apple</span>
          <span className="font-sans font-black text-lg tracking-widest" style={{ width: "83px" }}>IDEO</span>
          <span className="font-mono font-bold text-lg" style={{ width: "110px" }}>Polygon</span>
        </div>

        {/* Parallax Image container */}
        <div className="relative overflow-hidden w-full max-w-xs h-[300px] rounded-3xl shadow-lg border border-slate-100 mt-12 bg-slate-100">
          <div 
            className="absolute inset-0 w-full h-[150%] transition-transform duration-100 ease-out"
            style={{ transform: `translateY(${parallaxY}px)` }}
          >
            <img 
              src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260330_103804_7aa5494f-4d5b-432e-9dc7-20715275f143.png&w=1280&q=85" 
              alt="Chris Halaska Portrait" 
              className="w-full h-full object-cover shrink-0 select-none pointer-events-none"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl text-left shadow-sm border border-white/20">
            <div className="text-xs font-semibold text-slate-800">Chris Halaska</div>
            <div className="text-[10px] text-slate-400">Backing Designer Crew</div>
          </div>
        </div>
      </section>

      {/* 4. PRICING SECTION */}
      <section className="py-12 px-6 max-w-5xl mx-auto">
        <h3 className="text-xs font-mono font-bold uppercase text-slate-400 mb-6 tracking-widest text-center sm:text-left">
          SERVICE STRUCTURES & TRANSPARENT TICKET
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1 (Dark) */}
          <div className="bg-[#051A24] text-[#E0EBF0] rounded-[36px] p-8 md:p-10 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-indigo-500/10 to-transparent rounded-full pointer-events-none"></div>
            <div>
              <div className="text-[#F6FCFF] text-xl font-medium mb-2">Monthly Partnership</div>
              <p className="text-xs text-[#E0EBF0]/70 leading-relaxed mb-8">
                A dedicated creative design team. You work directly with Viktor Oddy daily. Clear delivery loops on Slack, Figma files active 24/7.
              </p>
              <div className="mb-8">
                <div className="text-4xl font-semibold text-[#F6FCFF]">$5,000</div>
                <div className="text-xs uppercase text-[#E0EBF0]/40 font-mono tracking-widest mt-1">Flat Rate Monthly</div>
              </div>
            </div>
            <div className="space-y-3">
              <a 
                href="#chat" 
                className="block w-full bg-white text-[#051A24] hover:bg-slate-100 rounded-full py-3 text-center text-sm font-semibold transition-transform duration-200 active:scale-95 shadow-[0_4px_16px_rgba(255,255,255,0.06)]"
              >
                Start a chat
              </a>
              <a 
                href="https://halaskastudio.com/book" 
                target="_blank"
                rel="noreferrer" 
                className="block w-full py-3 text-center text-xs font-mono tracking-wider hover:text-white transition-colors text-slate-400 underline uppercase"
              >
                How it works
              </a>
            </div>
          </div>

          {/* Card 2 (Light) */}
          <div className="bg-white text-[#051A24] rounded-[36px] p-8 md:p-10 flex flex-col justify-between shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-slate-150">
            <div>
              <div className="text-[#0D212C] text-xl font-medium mb-2">Custom Project</div>
              <p className="text-xs text-[#051A24]/70 leading-relaxed mb-8">
                Fixed scope, fixed timeline. Perfect for brand-defining initial identities, complex structural blueprints, or highly animated launch visual landing sites.
              </p>
              <div className="mb-8">
                <div className="text-4xl font-semibold text-[#0D212C]">$5,000</div>
                <div className="text-xs uppercase text-[#051A24]/40 font-mono tracking-widest mt-1">Minimum Budget Target</div>
              </div>
            </div>
            <div className="space-y-3">
              <a 
                href="#chat" 
                className="block w-full bg-[#051A24] text-white rounded-full py-3 text-center text-sm font-semibold transition-transform duration-200 active:scale-95 shadow-[0_4px_12px_rgba(5,26,36,0.15)]"
              >
                Book custom project
              </a>
              <div className="text-center text-[10px] text-slate-400 font-mono">
                Same Apple-grade standards guaranteed.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIAL CAROUSEL */}
      <section className="py-20 px-6 max-w-5xl mx-auto bg-slate-50 rounded-[40px] my-12 border border-slate-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h3 className="text-2xl font-semibold tracking-tight font-serif" style={{ fontFamily: "'PP Mondwest', serif" }}>
              What <span className="italic underline decoration-indigo-300">builders</span> say
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-1 uppercase tracking-widest">
              Verified client testimonials
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <span className="text-xs font-semibold text-slate-700">Clutch 5.0 Rating</span>
          </div>
        </div>

        {/* Carousel slides with control buttons */}
        <div className="relative overflow-hidden w-full p-2">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeTestimonial}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-8"
            >
              <div className="flex-1 space-y-4">
                <Quote className="h-6 w-6 text-indigo-300 opacity-60" />
                <p className="text-slate-700 font-medium text-base leading-relaxed italic">
                  "{TESTIMONIALS[activeTestimonial].text}"
                </p>
                <div className="flex items-center gap-3 pt-4">
                  <img 
                    src={TESTIMONIALS[activeTestimonial].avatar} 
                    alt={TESTIMONIALS[activeTestimonial].name} 
                    className="h-10 w-10 rounded-full object-cover border border-slate-100" 
                  />
                  <div>
                    <div className="text-xs font-bold text-[#051A24]">{TESTIMONIALS[activeTestimonial].name}</div>
                    <div className="text-[10px] text-slate-400">{TESTIMONIALS[activeTestimonial].role}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Buttons */}
          <div className="flex justify-end gap-2 mt-4 pr-2">
            <button 
              onClick={prevTestimonial}
              className="h-10 w-10 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer select-none"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button 
              onClick={nextTestimonial}
              className="h-10 w-10 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer select-none"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 6. PROJECTS SECTION */}
      <section id="work" className="max-w-5xl mx-auto px-6 py-12 space-y-16">
        <div className="text-center md:text-left">
          <h2 className="text-xs font-mono font-bold uppercase text-slate-400 tracking-widest mb-1">
            PROJECT ARCHETYPES SHOWCASE
          </h2>
          <p className="text-sm text-slate-500 font-serif">Selected digital masterpieces crafted from inception to active stage</p>
        </div>

        <div className="space-y-20">
          {PROJECTS.map((proj, idx) => (
            <motion.div 
              key={proj.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="group space-y-4"
            >
              <div className="md:pl-16 border-l border-slate-100 ml-4 py-2">
                <h3 className="text-xl md:text-2xl font-bold tracking-tight text-[#051A24] group-hover:text-indigo-600 transition-colors font-serif" style={{ fontFamily: "'PP Mondwest', serif" }}>
                  {proj.name}
                </h3>
                <p className="text-xs text-[#051A24]/70 mt-1 capitalize font-mono">
                  {proj.desc}
                </p>
              </div>

              <div className="overflow-hidden rounded-3xl shadow-lg border border-slate-100 bg-slate-50">
                <img 
                  src={proj.img} 
                  alt={proj.name} 
                  className="w-full h-auto max-h-[500px] object-cover filter saturate-[0.95] group-hover:scale-[1.01] transition-transform duration-700" 
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 7. PARTNER SECTION */}
      <section id="chat" className="py-12 px-6 max-w-5xl mx-auto">
        <div 
          ref={partnerRef}
          onMouseMove={handlePartnerMouseMove}
          className="bg-slate-50 py-36 rounded-[40px] text-center shadow-inner border border-slate-100 relative overflow-hidden cursor-crosshair group select-none"
        >
          {/* Spawning Thumbnail particles on mouse move */}
          {particles.map((p) => (
            <img 
              key={p.id}
              src={p.img}
              alt="particle thumbnail animation"
              className="absolute pointer-events-none select-none h-20 md:h-32 rounded-xl shadow-md border border-white z-10 transition-opacity duration-1000 origin-center opacity-70 animate-[fadeOutScale_1.2s_ease-out_forwards]"
              style={{
                left: p.x - 40,
                top: p.y - 40,
                transform: `rotate(${p.rotate}deg) scale(0.85)`,
              }}
              referrerPolicy="no-referrer"
            />
          ))}

          <div className="relative z-20 space-y-8 select-none pointer-events-none">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#0D212C] font-serif" style={{ fontFamily: "'PP Mondwest', serif" }}>
              Partner with us
            </h2>
            <div className="flex justify-center select-none">
              <button 
                onClick={() => alert("Chat initiated with Viktor! (Mock interaction complete)")}
                className="pointer-events-auto cursor-pointer bg-slate-900 active:scale-95 text-white rounded-full px-6 py-3 flex items-center gap-3 shadow-xl hover:bg-slate-800 transition-all font-semibold text-sm select-none"
              >
                <img 
                  src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150" 
                  alt="Viktor profile" 
                  className="h-8 w-8 rounded-full border border-white/20 object-cover" 
                />
                Start chat with Viktor
              </button>
            </div>
            <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">
              Hover inside canvas area to unlock media trail effect
            </p>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="max-w-5xl mx-auto px-6 py-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <div className="text-lg font-serif mb-1" style={{ fontFamily: "'PP Mondwest', serif" }}>Vortex Studio</div>
          <p className="text-xs text-slate-400">Next wave digital layout architectural consulting.</p>
        </div>
        <div className="flex gap-16">
          <div className="space-y-2">
            <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-1">Navigation</div>
            <a href="#" className="block text-xs hover:text-indigo-600 transition-colors">Services</a>
            <a href="#work" className="block text-xs hover:text-indigo-600 transition-colors">Work</a>
            <a href="#chat" className="block text-xs hover:text-indigo-600 transition-colors">Contact</a>
          </div>
          <div className="space-y-2">
            <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-1">Social Channels</div>
            <a href="https://x.com" target="_blank" rel="noreferrer" className="block text-xs hover:text-indigo-600 transition-colors flex items-center gap-1">
              x.com <ArrowUpRight className="h-3 w-3" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="block text-xs hover:text-indigo-600 transition-colors flex items-center gap-1">
              LinkedIn <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>
        </div>
      </footer>

      {/* 9. COPYRIGHT BAR */}
      <section className="max-w-5xl mx-auto px-6 py-4 border-t border-slate-50 flex justify-between items-center text-slate-400 text-[10px] font-mono tracking-wider">
        <div>© VORTEX STUDIO LIMITED CO. ALL RIGHTS RESERVED.</div>
        <div>AUSTIN, TEXAS, USA</div>
      </section>

      {/* 10. FIXED FLOATING BOTTOM NAV */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md px-6 py-2.5 rounded-full shadow-[0_0_0_0.5px_rgba(0,0,0,0.05),0_8px_32px_rgba(0,0,0,0.12)] border border-slate-100 z-50 flex items-center gap-6">
        <span 
          className="text-lg font-extrabold text-[#051A24] cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{ fontFamily: "'PP Mondwest', Georgia, serif" }}
        >
          V
        </span>
        <div className="h-4 w-[1px] bg-slate-200"></div>
        <a 
          href="#chat" 
          className="bg-[#051A24] text-white hover:bg-slate-800 transition-colors px-4 py-1.5 rounded-full text-xs font-semibold shadow-md active:scale-95 duration-100 select-none block"
        >
          Start a chat
        </a>
      </div>
    </div>
  );
}
