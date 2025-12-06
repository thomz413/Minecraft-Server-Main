import { Facebook, Instagram, MessageCircle } from "lucide-react";
import TikTok from "@/components/Tiktok.tsx";

type Social = {
	icon: any;
	label: string;
	link: string;
	members: string;
	// CSS background: either a solid color like "#1877F2" or a gradient string like
	// "linear-gradient(135deg,#feda75 0%,#f58529 25%,#dd2a7b 50%,#8134af 75%,#515bd4 100%)"
	bg: string;
	// optional text color override (defaults to white)
	textColor?: string;
};

export const socials: Social[] = [
	{
		icon: MessageCircle,
		label: "Discord",
		link: "#",
		members: "Seguir",
		bg: "#5865F2", // Discord blurple
	},
	{
		icon: Facebook,
		label: "Facebook",
		link: "#",
		members: "Seguir",
		bg: "#1877F2",
	},
	{
		icon: Instagram,
		label: "Instagram",
		link: "#",
		members: "Seguir",
		// instagram-style gradient (keeps it recognizably Instagram)
		bg: "linear-gradient(135deg,#feda75 0%,#f58529 25%,#dd2a7b 50%,#8134af 75%,#515bd4 100%)",
	},
	{
		icon: TikTok,
		label: "TikTok",
		link: "#",
		members: "Seguir",
		// TikTok brand uses black + cyan/magenta accents; a dark card with an accent gradient looks nice
		bg: "linear-gradient(135deg, #000000 0%, #111111 40%, #69C9D0 65%, #EE1D52 100%)",
		textColor: "#ffffff",
	},
];
