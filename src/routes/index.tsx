import { createFileRoute } from "@tanstack/react-router";
import {
    Check,
    ChevronDown,
    Copy,
    Search,
    Trophy,
    Users,
    Zap,
} from "lucide-react";
import {type JSX, useEffect, useMemo, useRef, useState } from "react";
import {commandsByPlugin} from "@/constants/commands.ts";
import {SERVER_IP} from "@/constants/constants.ts";
import {roles} from "@/constants/roles.ts";
import {socials} from "@/constants/socials.ts";


export const Route = createFileRoute("/")({
    component: Home,
});

function Home(): JSX.Element {
    // UI state
    const [scrollY, setScrollY] = useState(0);
    const [showNavbar, setShowNavbar] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [copied, setCopied] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // refs for performant scroll handling
    const lastScroll = useRef(0);
    const ticking = useRef(false);
    const heroRef = useRef<HTMLElement | null>(null);

    // ref to manage copy timeout so it can be cleared on unmount
    const copyTimeoutRef = useRef<number | null>(null);

    // Debounce search input (300ms)
    useEffect(() => {
        const id = window.setTimeout(() => setDebouncedQuery(searchQuery.trim().toLowerCase()), 300);
        return () => clearTimeout(id);
    }, [searchQuery]);

    // Efficient scroll listener using requestAnimationFrame
    useEffect(() => {
        const handleScroll = () => {
            lastScroll.current = window.scrollY || window.pageYOffset;
            if (!ticking.current) {
                window.requestAnimationFrame(() => {
                    setScrollY(lastScroll.current);
                    ticking.current = false;
                });
                ticking.current = true;
            }
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // show navbar only once scrolled past the hero section
    useEffect(() => {
        const heroHeight = heroRef.current?.offsetHeight ?? window.innerHeight;
        // leave a small margin so header appears just after hero
        setShowNavbar(scrollY > Math.max(200, heroHeight - 120));
    }, [scrollY]);

    // If the header is hidden, ensure mobile menu is closed
    useEffect(() => {
        if (!showNavbar) setMobileMenuOpen(false);
    }, [showNavbar]);

    // cleanup for copy timeout on unmount
    useEffect(() => {
        return () => {
            if (copyTimeoutRef.current != null) {
                clearTimeout(copyTimeoutRef.current);
            }
        };
    }, []);

    const handleCopyIP = async () => {
        try {
            await navigator.clipboard.writeText(SERVER_IP);
            setCopied(true);
            // clear any previous timeout
            if (copyTimeoutRef.current != null) {
                clearTimeout(copyTimeoutRef.current);
            }
            copyTimeoutRef.current = window.setTimeout(() => setCopied(false), 2000);
        } catch (e) {
            // optional: fallback for older browsers or show a small toast
            console.warn("Clipboard write failed", e);
        }
    };

    /* ----- Filter commands using debounced query (memoized) ----- */
    const filteredCommands = useMemo(() => {
        if (!debouncedQuery) {
            // return shallow copy so components rendering using Object.entries() are stable
            return Object.fromEntries(Object.entries(commandsByPlugin));
        }

        return Object.fromEntries(
            Object.entries(commandsByPlugin).map(([key, plugin]) => [
                key,
                {
                    ...plugin,
                    commands: plugin.commands.filter((cmd) => {
                        const q = debouncedQuery;
                        return cmd.name.toLowerCase().includes(q) || cmd.desc.toLowerCase().includes(q);
                    }),
                },
            ])
        );
    }, [debouncedQuery]);

    const hasAnyCommand = useMemo(
        () => Object.values(filteredCommands).some((p) => p.commands.length > 0),
        [filteredCommands]
    );

    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
            {/* Navigation — hidden until scrolled past hero */}
            {showNavbar && (
                <header
                    className={`fixed top-0 w-full z-50 transition-all duration-500 ease-out transform ${
                        showNavbar
                            ? "translate-y-0 opacity-100 bg-background/80 backdrop-blur-xl border-b border-border"
                            : "-translate-y-full opacity-0 pointer-events-none"
                    }`}
                >
                    <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                        {/* Logo + title */}
                        <div className="flex items-center gap-3">
                            <img src="/Title.png" alt="CraftLegends" className="h-8 md:h-10 object-contain" />
                        </div>

                        {/* Desktop links */}
                        <nav className="hidden md:flex gap-8" aria-label="Main navigation">
                            <a href="#home" className="hover:text-primary transition">
                                Inicio
                            </a>
                            <a href="#info" className="hover:text-primary transition">
                                Acerca
                            </a>
                            <a href="#commands" className="hover:text-primary transition">
                                Comandos
                            </a>
                            <a href="#roles" className="hover:text-primary transition">
                                Rangos
                            </a>
                            <a href="#socials" className="hover:text-primary transition">
                                Comunidad
                            </a>
                        </nav>

                        {/* actions */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleCopyIP}
                                aria-label="Copiar dirección del servidor"
                                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary/20 border border-primary/50 text-primary rounded-lg hover:bg-primary/30 transition"
                            >
                <span className="text-sm font-mono" aria-live="polite">
                  {copied ? "¡Copiado!" : SERVER_IP}
                </span>
                                <Copy className="w-4 h-4" />
                            </button>

                            {/* mobile menu button */}
                            <button
                                onClick={() => setMobileMenuOpen((v) => !v)}
                                aria-expanded={mobileMenuOpen}
                                aria-controls="mobile-menu"
                                className="md:hidden p-2 rounded-lg border border-border bg-card/40"
                            >
                                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" aria-hidden>
                                    <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Mobile menu */}
                    {mobileMenuOpen && showNavbar && (
                        <div id="mobile-menu" className="md:hidden border-t border-border bg-background/95 backdrop-blur">
                            <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-3">
                                <a href="#home" onClick={() => setMobileMenuOpen(false)} className="py-2">
                                    Inicio
                                </a>
                                <a href="#info" onClick={() => setMobileMenuOpen(false)} className="py-2">
                                    Acerca
                                </a>
                                <a href="#commands" onClick={() => setMobileMenuOpen(false)} className="py-2">
                                    Comandos
                                </a>
                                <a href="#roles" onClick={() => setMobileMenuOpen(false)} className="py-2">
                                    Rangos
                                </a>
                                <a href="#socials" onClick={() => setMobileMenuOpen(false)} className="py-2">
                                    Comunidad
                                </a>
                                <button onClick={handleCopyIP} className="mt-2 py-2 bg-primary text-primary-foreground rounded-lg">
                                    Copiar IP
                                </button>
                            </div>
                        </div>
                    )}
                </header>
            )}

            <main id="main-content">
                {/* Hero Section */}
                <section id="home" ref={heroRef} className="relative min-h-[80vh] md:min-h-screen flex items-center justify-center overflow-hidden py-12 md:py-24">
                    {/* --- WALLPAPER BACKGROUND --- */}
                    <div className="absolute inset-0 z-0 overflow-hidden" style={{ willChange: "transform" }}>
                        <img
                            src="/Background.jpg"
                            alt=""
                            aria-hidden="true"
                            loading="eager"
                            decoding="async"
                            className="w-full h-full object-cover"
                            style={{ transform: `translateY(${scrollY * 0.25}px)`, willChange: "transform" }}
                        />
                    </div>

                    {/* --- GRADIENT OVERLAY (perfect text contrast) --- */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/60 pointer-events-none z-10" style={{ transform: `translateY(${scrollY * 0.4}px)` }} />

                    {/* --- DECORATIVE BLOBS --- */}
                    <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
                        <div className="absolute top-16 left-6 md:left-10 w-56 h-56 md:w-72 md:h-72 bg-primary/30 rounded-full blur-3xl" />
                        <div className="absolute bottom-12 right-6 md:right-10 w-56 h-56 md:w-72 md:h-72 bg-secondary/30 rounded-full blur-3xl" />
                    </div>

                    {/* --- MAIN CONTENT --- */}
                    <div className="relative z-30 text-center max-w-5xl px-6 sm:px-8">
                        <h1 className="flex flex-col items-center gap-3 md:gap-6 text-3xl md:text-5xl font-extrabold mb-8 drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)] pb-5">
                            <span className="block">Bienvenido a</span>
                            <img src="/Title.png" alt="Titulo del servidor" loading="lazy" className="w-48 sm:w-64 md:w-80 lg:w-[520px] h-auto object-contain mx-auto drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)]" />
                        </h1>

                        <p className="text-lg md:text-xl text-white mb-10 max-w-3xl mx-auto leading-relaxed drop-shadow-[0_3px_8px_rgba(0,0,0,0.9)]">
                            La experiencia multijugador definitiva de Minecraft. Construye, explora y conquista con miles de jugadores en todo el mundo.
                        </p>

                        {/* Server IP */}
                        <div className="mx-auto mb-10 max-w-md">
                            <div className="bg-card/80 backdrop-blur-md border border-primary/40 rounded-xl p-5 md:p-6 shadow-xl flex items-center gap-4">
                                <div className="flex-1 text-left">
                                    <p className="text-muted-foreground text-xs mb-1">Dirección del servidor</p>
                                    <code className="block text-lg md:text-2xl font-mono font-bold text-primary truncate">{SERVER_IP}</code>
                                </div>

                                <button onClick={handleCopyIP} className="inline-flex items-center justify-center p-3 rounded-lg transition hover:scale-105 hover:bg-primary/10 focus-visible:ring-2 focus-visible:ring-primary" aria-label="Copiar IP">
                                    {copied ? <Check className="w-6 h-6 text-primary" /> : <Copy className="w-6 h-6 text-muted-foreground" />}
                                </button>
                            </div>

                            <div aria-live="polite" className="sr-only">{copied ? "Dirección copiada" : ""}</div>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center mb-16">
                            <a className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg shadow-lg hover:scale-[1.03] transition" href="#commands">Jugar ahora</a>
                            <a className="px-8 py-3 bg-card/80 backdrop-blur border border-border text-foreground font-semibold rounded-lg shadow hover:bg-card/60 transition" href="#info">Más información</a>
                        </div>

                        {/* Scroll Indicator */}
                        <div className="motion-safe:animate-bounce mx-auto w-fit">
                            <ChevronDown className="w-8 h-8 text-primary drop-shadow-xl" />
                        </div>
                    </div>
                </section>

                {/* Info */}
                <section id="info" className="py-20 px-6 max-w-7xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-bold mb-10 text-center">Acerca de CraftLegends</h2>
                    <div className="grid md:grid-cols-2 gap-12 mb-16 items-center">
                        <div className="space-y-6 text-center md:text-left">
                            <h3 className="text-2xl font-bold">¿Por qué unirte?</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                CraftLegends es una comunidad próspera de Minecraft dedicada a ofrecer la mejor experiencia multijugador. Ya seas un jugador casual o un constructor hardcore, tenemos algo para todos.
                            </p>
                            <ul className="space-y-3">
                                {[
                                    "Plugins personalizados y jugabilidad única",
                                    "Comunidad activa y amigable",
                                    "Eventos y competiciones regulares",
                                    "Sistema económico justo",
                                    "Servidor estable 24/7",
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 place-items-center justify-center w-full">
                            {[
                                { label: "Tamaño del mundo", value: "Ilimitado" },
                                { label: "Versión", value: "1.20.4" },
                                { label: "Jugadores máximos", value: "200" },
                                { label: "Tipo de servidor", value: "Survival SMP" },
                            ].map((stat, i) => (
                                <div key={i} className="p-6 bg-card border border-border rounded-lg text-center w-full max-w-xs mx-auto">
                                    <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
                                    <p className="text-xl font-bold text-primary">{stat.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section className="py-20 px-6 max-w-7xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center">Características del servidor</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: Trophy, title: "Batallas de temporada", desc: "Compite en épicos torneos PvP con recompensas legendarias." },
                            { icon: Users, title: "Gremios y equipos", desc: "Únete con amigos y construyan su dinastía juntos." },
                            { icon: Zap, title: "Economía personalizada", desc: "Compra, vende e intercambia con un sistema económico completo." },
                        ].map((feature, i) => (
                            <div key={i} className="p-8 bg-card border border-border rounded-lg hover:border-primary transition group cursor-pointer">
                                <feature.icon className="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
                                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                <p className="text-muted-foreground">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Quick Start (INICIO RÁPIDO) — gradient removed from step circle + hover glow */}
                <section className="py-20 px-6 max-w-7xl mx-auto bg-card/40 backdrop-blur-sm border-y border-border/50">
                    <h2 className="text-4xl md:text-6xl font-extrabold mb-4 text-center">Inicio rápido</h2>
                    <p className="text-muted-foreground text-center max-w-xl mx-auto mb-14">Únete al servidor en menos de un minuto.</p>

                    <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
                        {[
                            { step: "1", title: "Copiar IP", desc: SERVER_IP },
                            { step: "2", title: "Agregar servidor", desc: "Pega el IP en tu la seccion de servidores" },
                            { step: "3", title: "Unirse y jugar", desc: "¡Aparece en el mundo y empieza tu aventura!" },
                        ].map((item, i) => (
                            <div key={i} className="group relative text-center p-8 rounded-2xl border border-border/60 bg-card/60 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                {/* Circle (solid primary color now) */}
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full flex items-center justify-center bg-primary text-primary-foreground font-extrabold text-3xl ring-4 ring-background shadow-md">
                                    {item.step}
                                </div>

                                <div className="mt-10">
                                    <h3 className="font-semibold text-xl mb-2">{item.title}</h3>
                                    <p className="text-muted-foreground text-sm">{item.desc}</p>
                                </div>

                                {/* Glow hover — use solid primary with transparency instead of gradient */}
                                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 bg-primary/40 blur-xl transition-opacity duration-300" />
                            </div>
                        ))}
                    </div>
                </section>

                {/* Commands */}
                <section id="commands" className="py-20 px-6 max-w-7xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-bold mb-8 text-center">Comandos por plugin</h2>

                    <div className="max-w-2xl mx-auto mb-8">
                        <div className="relative">
                            <Search className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Buscar comandos..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                aria-label="Buscar comandos"
                            />
                        </div>
                    </div>

                    <div className="space-y-12 max-w-4xl mx-auto">
                        {!hasAnyCommand ? (
                            <p className="text-center text-muted-foreground">No se encontraron comandos que coincidan con la búsqueda.</p>
                        ) : (
                            Object.entries(filteredCommands).map(([key, plugin]) => (
                                <div key={key}>
                                    <div className="flex items-center gap-3 mb-6">
                                        <plugin.icon className="w-6 h-6 text-primary" />
                                        <h3 className="text-2xl font-bold">{plugin.name}</h3>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {plugin.commands.map((cmd, i) => (
                                            <div key={i} className="p-4 bg-card border border-border rounded-lg hover:bg-card/80 transition">
                                                <code className="text-primary font-bold">{cmd.name}</code>
                                                <p className="text-sm text-muted-foreground mt-2">{cmd.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                {/* Roles (RANGOS) — role name and CTA button now use solid primary instead of text gradient/button gradient */}
                <section id="roles" className="py-24 px-6 max-w-7xl mx-auto">
                    <h2 className="text-4xl md:text-6xl font-extrabold mb-6 text-center">Rangos del servidor</h2>
                    <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-16">Cada rango desbloquea beneficios exclusivos y ventajas dentro del servidor.</p>

                    <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
                        {roles.map((role, i) => (
                            <div key={i} className="group relative p-10 rounded-3xl border border-border/50 bg-card/70 shadow-sm overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex flex-col">
                                <div className={`absolute inset-0 bg-gradient-to-br ${role.color} opacity-15 group-hover:opacity-25 transition duration-300`} />
                                <div className={`absolute inset-0 blur-2xl bg-gradient-to-br ${role.color} opacity-0 group-hover:opacity-20 transition duration-300`} />

                                <div className="relative z-10 mb-8 text-center">
                                    {/* Role name — removed bg clip gradient, now solid primary text */}
                                    <h3 className="text-3xl font-extrabold tracking-tight text-primary drop-shadow-[0_0_8px_rgba(255,255,255,0.12)]">{role.name}</h3>
                                </div>

                                <div className="relative z-10 flex-1">
                                    <ul className="space-y-4">
                                        {role.perks.map((perk, j) => (
                                            <li key={j} className="flex items-start gap-3 text-foreground/90">
                                                <div className="mt-1 w-2 h-2 rounded-full bg-primary shadow-sm" />
                                                <span className="text-sm leading-relaxed">{perk}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="relative z-10 mt-10">
                                    {/* CTA button — solid primary background now */}
                                    <button className="w-full py-3 rounded-xl font-semibold text-primary-foreground bg-primary shadow-md hover:shadow-lg transition-all">Mejorar</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Socials */}
                <section id="socials" className="py-20 px-6 max-w-7xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-bold mb-8 text-center">Únete a nuestra comunidad</h2>

                    <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-6 max-w-5xl mx-auto mb-12">
                        {socials.map((social, i) => (
                            <a
                                key={i}
                                href={social.link}
                                className="relative overflow-hidden rounded-lg p-6 shadow-lg transform transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] focus:outline-none focus-visible:ring-4"
                                // apply brand background (supports solid color or CSS gradient from the data)
                                style={{
                                    background: social.bg,
                                    color: social.textColor ?? "#ffffff",
                                    // subtle fallback for better contrast when a solid hex is passed
                                    border: "1px solid rgba(255,255,255,0.06)",
                                }}
                                aria-label={social.label}
                            >
                                {/* soft dark overlay to improve text readability on crazy gradients */}
                                <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.12))" }} />

                                <div className="relative z-10 flex flex-col items-center">
                                    <div className="mb-3 w-12 h-12 rounded-full flex items-center justify-center bg-white/12 backdrop-blur-sm">
                                        {/* icon is white (or inherit) and visually centered */}
                                        <social.icon className="w-6 h-6" aria-hidden />
                                    </div>

                                    <h3 className="font-bold text-lg mb-1">{social.label}</h3>
                                    <p className="text-sm opacity-90">{social.members}</p>
                                </div>

                                {/* subtle decorative accent: top-left blur */}
                                <div className="pointer-events-none absolute -top-10 -left-10 w-36 h-36 rounded-full opacity-20 filter blur-2xl" style={{ background: "rgba(255,255,255,0.06)" }} />
                            </a>
                        ))}
                    </div>
                </section>


                {/* Footer */}
                <footer className="py-12 px-6 bg-card border-t border-border">
                    <div className="max-w-7xl mx-auto text-center text-muted-foreground">
                        <p>© 2025 Servidor Aqui. Todos los derechos reservados. Minecraft es una marca registrada de Mojang Studios.</p>
                    </div>
                </footer>
            </main>
        </div>
    );
}