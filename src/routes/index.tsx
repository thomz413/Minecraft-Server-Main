import { createFileRoute } from "@tanstack/react-router";
import {
	Check,
	ChevronDown,
	Copy,
	Facebook,
	Instagram,
	MessageCircle,
	Search,
	Trophy,
	Twitter,
	Users,
	Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { siFacebook, siInstagram, siTiktok } from "simple-icons";

export const Route = createFileRoute("/")({
	component: Home,
});

function Home() {
	// UI state
	const [scrollY, setScrollY] = useState(0);
	const [searchQuery, setSearchQuery] = useState("");
	const [debouncedQuery, setDebouncedQuery] = useState("");
	const [playerCount, setPlayerCount] = useState(0);
	const [copied, setCopied] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	// refs for performant scroll handling
	const lastScroll = useRef(0);
	const ticking = useRef(false);

	// Debounce search input (300ms)
	useEffect(() => {
		const id = setTimeout(
			() => setDebouncedQuery(searchQuery.trim().toLowerCase()),
			300,
		);
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
		// passive listener for better perf
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// Animate player count up to target (simple incremental)
	useEffect(() => {
		const target = 1234;
		if (playerCount >= target) return;
		const step = Math.max(1, Math.round((target - playerCount) / 12));
		const id = window.setTimeout(
			() => setPlayerCount((v) => Math.min(target, v + step)),
			60,
		);
		return () => clearTimeout(id);
	}, [playerCount]);

	// socials: removed GitHub & Newsletter; added TikTok, Facebook, Instagram
	const socials = [
		{ icon: MessageCircle, label: "Discord", link: "#", members: "Follow" },
		{ icon: Twitter, label: "Twitter", link: "#", members: "Follow" },
		{ icon: Facebook, label: "Facebook", link: "#", members: "Follow" },
		{ icon: Instagram, label: "Instagram", link: "#", members: "Follow" },
		{ icon: siTiktok.svg, label: "TikTok", link: "#", members: "Follow" },
	];

	// Commands (kept command names as-is)
	const commandsByPlugin = {
		essentials: {
			name: "Essentials",
			icon: Zap,
			commands: [
				{ name: "/spawn", desc: "Regresa al punto de spawn" },
				{ name: "/home", desc: "Establece y vuelve a tu home" },
				{ name: "/tpa", desc: "Teletransportarse a un jugador" },
				{ name: "/msg", desc: "Enviar un mensaje privado" },
			],
		},
		economy: {
			name: "Economy",
			icon: Trophy,
			commands: [
				{ name: "/balance", desc: "Consultar tu saldo" },
				{ name: "/pay", desc: "Enviar dinero a un jugador" },
				{ name: "/shop", desc: "Abrir la tienda del servidor" },
				{ name: "/sell", desc: "Vender objetos por dinero" },
			],
		},
		protection: {
			name: "Land Claims",
			icon: Users,
			commands: [
				{ name: "/claim", desc: "Reclamar tu terreno" },
				{ name: "/unclaim", desc: "Eliminar reclamo de terreno" },
				{ name: "/claiminfo", desc: "Ver detalles del reclamo" },
				{ name: "/trust", desc: "Confiar/permitir a un amigo en tu reclamo" },
			],
		},
	};

	const roles = [
		{
			name: "Member",
			color: "from-blue-500 to-blue-600",
			perks: ["Comandos básicos", "Reclamo de terreno", "Acceso a la tienda"],
		},
		{
			name: "VIP",
			color: "from-purple-500 to-purple-600",
			perks: [
				"Todos los beneficios de Member",
				"Recompensas dobles",
				"Cola prioritaria",
			],
		},
		{
			name: "Legend",
			color: "from-yellow-500 to-orange-600",
			perks: [
				"Todos los beneficios de VIP",
				"Objetos personalizados",
				"Acceso a eventos",
			],
		},
	];

	const handleCopyIP = async () => {
		try {
			await navigator.clipboard.writeText("play.craftlegends.net");
			setCopied(true);
			// keep an accessible announcement for screen readers
			const id = setTimeout(() => setCopied(false), 2000);
			return () => clearTimeout(id);
		} catch (e) {
			// ignore clipboard errors silently (could fallback)
		}
	};

	// Filter commands using debounced query
	const filteredCommands = Object.fromEntries(
		Object.entries(commandsByPlugin).map(([key, plugin]) => [
			key,
			{
				...plugin,
				commands: plugin.commands.filter((cmd) => {
					if (!debouncedQuery) return true;
					return (
						cmd.name.toLowerCase().includes(debouncedQuery) ||
						cmd.desc.toLowerCase().includes(debouncedQuery)
					);
				}),
			},
		]),
	);

	// quick helper to check if any plugin has results
	const hasAnyCommand = Object.values(filteredCommands).some(
		(p) => p.commands.length > 0,
	);

	return (
		<main className="min-h-screen bg-background text-foreground overflow-x-hidden">
			{/* Skip link for keyboard users */}
			<a
				href="#main-content"
				className="sr-only focus:not-sr-only focus:sr-only:static"
			>
				Saltar al contenido
			</a>

			{/* Navigation */}
			<header className="fixed top-0 w-full bg-background/80 backdrop-blur-xl border-b border-border z-50">
				<div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
					<h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
						CraftLegends
					</h1>

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
								{copied ? "¡Copiado!" : "play.craftlegends.net"}
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
							<svg
								className="w-6 h-6"
								viewBox="0 0 24 24"
								fill="none"
								aria-hidden
							>
								<path
									d="M4 7h16M4 12h16M4 17h16"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</button>
					</div>
				</div>

				{/* Mobile menu */}
				{mobileMenuOpen && (
					<div
						id="mobile-menu"
						className="md:hidden border-t border-border bg-background/95 backdrop-blur"
					>
						<div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-3">
							<a
								href="#home"
								onClick={() => setMobileMenuOpen(false)}
								className="py-2"
							>
								Inicio
							</a>
							<a
								href="#info"
								onClick={() => setMobileMenuOpen(false)}
								className="py-2"
							>
								Acerca
							</a>
							<a
								href="#commands"
								onClick={() => setMobileMenuOpen(false)}
								className="py-2"
							>
								Comandos
							</a>
							<a
								href="#roles"
								onClick={() => setMobileMenuOpen(false)}
								className="py-2"
							>
								Rangos
							</a>
							<a
								href="#socials"
								onClick={() => setMobileMenuOpen(false)}
								className="py-2"
							>
								Comunidad
							</a>
							<button
								onClick={handleCopyIP}
								className="mt-2 py-2 bg-primary text-primary-foreground rounded-lg"
							>
								Copiar IP
							</button>
						</div>
					</div>
				)}
			</header>

			<main id="main-content" className="pt-20">
				{/* Hero Section */}
				<section
					id="home"
					className="relative min-h-screen flex items-center justify-center overflow-hidden"
				>
					<div
						className="absolute inset-0 bg-gradient-to-b from-primary/20 via-background to-background pointer-events-none"
						style={{ transform: `translateY(${scrollY * 0.5}px)` }}
						aria-hidden
					/>
					<div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
					<div className="absolute bottom-20 right-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

					<div className="relative z-10 text-center max-w-4xl px-6">
						<h2 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
							Bienvenido a{" "}
							<span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
								CraftLegends
							</span>
						</h2>

						<p className="text-lg md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
							La experiencia multijugador definitiva de Minecraft. Construye,
							explora y conquista con miles de jugadores en todo el mundo.
						</p>

						<div className="bg-card border-2 border-primary/50 rounded-xl p-6 mb-6 max-w-md mx-auto">
							<p className="text-muted-foreground text-sm mb-2">
								Dirección del servidor
							</p>
							<div className="flex items-center gap-2">
								<code className="flex-1 text-lg md:text-2xl font-mono font-bold text-primary">
									play.craftlegends.net
								</code>
								<button
									onClick={handleCopyIP}
									className="p-3 hover:bg-primary/10 rounded-lg transition"
									aria-label="Copiar IP del servidor"
								>
									{copied ? (
										<Check className="w-6 h-6 text-primary" />
									) : (
										<Copy className="w-6 h-6 text-muted-foreground hover:text-primary" />
									)}
								</button>
							</div>
							{/* live region for screen reader confirmation */}
							<div aria-live="polite" className="sr-only">
								{copied ? "Dirección copiada" : ""}
							</div>
						</div>

						<div className="flex gap-4 justify-center mb-12 flex-wrap">
							<a
								className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:scale-105 transition-transform"
								href="#commands"
							>
								Jugar ahora
							</a>
							<a
								className="px-8 py-3 bg-card border border-border text-foreground font-semibold rounded-lg hover:bg-card/80 transition"
								href="#info"
							>
								Más información
							</a>
						</div>

						{/* Stats */}
						<div className="grid grid-cols-3 gap-6 md:gap-12 mt-12">
							<div className="space-y-2">
								<p className="text-3xl md:text-4xl font-bold text-primary">
									{playerCount.toLocaleString()}
								</p>
								<p className="text-muted-foreground">Jugadores activos</p>
							</div>
							<div className="space-y-2">
								<p className="text-3xl md:text-4xl font-bold text-secondary">
									24/7
								</p>
								<p className="text-muted-foreground">Tiempo de actividad</p>
							</div>
							<div className="space-y-2">
								<p className="text-3xl md:text-4xl font-bold text-primary">
									50ms
								</p>
								<p className="text-muted-foreground">Ping promedio</p>
							</div>
						</div>

						<div className="mt-12 animate-bounce">
							<ChevronDown className="mx-auto w-8 h-8 text-primary" />
						</div>
					</div>
				</section>

				{/* Info */}
				<section id="info" className="py-20 px-6 max-w-7xl mx-auto">
					<h2 className="text-3xl md:text-5xl font-bold mb-10 text-center">
						Acerca de CraftLegends
					</h2>
					<div className="grid md:grid-cols-2 gap-12 mb-16">
						<div className="space-y-6">
							<h3 className="text-2xl font-bold">¿Por qué unirte?</h3>
							<p className="text-muted-foreground leading-relaxed">
								CraftLegends es una comunidad próspera de Minecraft dedicada a
								ofrecer la mejor experiencia multijugador. Ya seas un jugador
								casual o un constructor hardcore, tenemos algo para todos.
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

						<div className="grid grid-cols-2 gap-6">
							{[
								{ label: "Tamaño del mundo", value: "Ilimitado" },
								{ label: "Versión", value: "1.20.4" },
								{ label: "Jugadores máximos", value: "200" },
								{ label: "Tipo de servidor", value: "Survival SMP" },
							].map((stat, i) => (
								<div
									key={i}
									className="p-6 bg-card border border-border rounded-lg text-center"
								>
									<p className="text-sm text-muted-foreground mb-2">
										{stat.label}
									</p>
									<p className="text-xl font-bold text-primary">{stat.value}</p>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* Features */}
				<section className="py-20 px-6 max-w-7xl mx-auto">
					<h2 className="text-3xl md:text-5xl font-bold mb-12 text-center">
						Características del servidor
					</h2>
					<div className="grid md:grid-cols-3 gap-8">
						{[
							{
								icon: Trophy,
								title: "Batallas de temporada",
								desc: "Compite en épicos torneos PvP con recompensas legendarias.",
							},
							{
								icon: Users,
								title: "Gremios y equipos",
								desc: "Únete con amigos y construyan su dinastía juntos.",
							},
							{
								icon: Zap,
								title: "Economía personalizada",
								desc: "Compra, vende e intercambia con un sistema económico completo.",
							},
						].map((feature, i) => (
							<div
								key={i}
								className="p-8 bg-card border border-border rounded-lg hover:border-primary transition group cursor-pointer"
							>
								<feature.icon className="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
								<h3 className="text-xl font-bold mb-2">{feature.title}</h3>
								<p className="text-muted-foreground">{feature.desc}</p>
							</div>
						))}
					</div>
				</section>

				{/* Quick start */}
				<section className="py-16 px-6 max-w-7xl mx-auto bg-card/50 border-y border-border">
					<h2 className="text-3xl md:text-5xl font-bold mb-8 text-center">
						Inicio rápido
					</h2>
					<div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
						{[
							{ step: "1", title: "Copiar IP", desc: "play.craftlegends.net" },
							{
								step: "2",
								title: "Agregar servidor",
								desc: "Pega en tu launcher de Minecraft",
							},
							{
								step: "3",
								title: "Unirse y jugar",
								desc: "¡Aparece y empieza tu aventura!",
							},
						].map((item, i) => (
							<div key={i} className="text-center">
								<div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
									<span className="text-2xl font-bold text-primary-foreground">
										{item.step}
									</span>
								</div>
								<h3 className="font-bold text-lg mb-2">{item.title}</h3>
								<p className="text-muted-foreground text-sm">{item.desc}</p>
							</div>
						))}
					</div>
				</section>

				{/* Commands */}
				<section id="commands" className="py-20 px-6 max-w-7xl mx-auto">
					<h2 className="text-3xl md:text-5xl font-bold mb-8 text-center">
						Comandos por plugin
					</h2>

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
							<p className="text-center text-muted-foreground">
								No se encontraron comandos que coincidan con la búsqueda.
							</p>
						) : (
							Object.entries(filteredCommands).map(([key, plugin]) => (
								<div key={key}>
									<div className="flex items-center gap-3 mb-6">
										<plugin.icon className="w-6 h-6 text-primary" />
										<h3 className="text-2xl font-bold">{plugin.name}</h3>
									</div>
									<div className="grid md:grid-cols-2 gap-4">
										{plugin.commands.map((cmd, i) => (
											<div
												key={i}
												className="p-4 bg-card border border-border rounded-lg hover:bg-card/80 transition"
											>
												<code className="text-primary font-bold">
													{cmd.name}
												</code>
												<p className="text-sm text-muted-foreground mt-2">
													{cmd.desc}
												</p>
											</div>
										))}
									</div>
								</div>
							))
						)}
					</div>
				</section>

				{/* Roles */}
				<section id="roles" className="py-20 px-6 max-w-7xl mx-auto">
					<h2 className="text-3xl md:text-5xl font-bold mb-8 text-center">
						Rangos del servidor
					</h2>
					<div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
						{roles.map((role, i) => (
							<div
								key={i}
								className={`relative overflow-hidden rounded-xl p-8 border border-border group cursor-pointer hover:shadow-xl transition`}
							>
								<div
									className={`absolute inset-0 bg-gradient-to-br ${role.color} opacity-10 group-hover:opacity-20 transition`}
								/>
								<div className="relative z-10">
									<h3 className="text-2xl font-bold mb-4">{role.name}</h3>
									<ul className="space-y-2">
										{role.perks.map((perk, j) => (
											<li
												key={j}
												className="text-muted-foreground flex items-center gap-2"
											>
												<span className="w-2 h-2 bg-primary rounded-full" />
												{perk}
											</li>
										))}
									</ul>
									<button className="w-full mt-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition">
										Mejorar
									</button>
								</div>
							</div>
						))}
					</div>
				</section>

				{/* Socials */}
				<section id="socials" className="py-20 px-6 max-w-7xl mx-auto">
					<h2 className="text-3xl md:text-5xl font-bold mb-8 text-center">
						Únete a nuestra comunidad
					</h2>
					<div className="grid md:grid-cols-5 gap-6 max-w-5xl mx-auto mb-12">
						{socials.map((social, i) => (
							<a
								key={i}
								href={social.link}
								className="p-6 bg-card border border-border rounded-lg hover:border-primary hover:bg-card/80 transition text-center group"
								aria-label={social.label}
							>
								<div className="mx-auto mb-3">
									<social.icon className="w-10 h-10 text-primary mx-auto mb-1 group-hover:scale-110 transition-transform" />
								</div>
								<h3 className="font-bold text-lg mb-1">{social.label}</h3>
								<p className="text-muted-foreground text-sm">
									{social.members}
								</p>
							</a>
						))}
					</div>
				</section>

				{/* Footer */}
				<footer className="py-12 px-6 bg-card border-t border-border">
					<div className="max-w-7xl mx-auto text-center text-muted-foreground">
						<p>
							© 2025 CraftLegends. Todos los derechos reservados. Minecraft es
							una marca registrada de Mojang Studios.
						</p>
					</div>
				</footer>
			</main>
		</main>
	);
}
