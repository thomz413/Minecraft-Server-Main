import {Facebook, Instagram, MessageCircle, Twitter} from "lucide-react";
import TikTok from "@/components/Tiktok.tsx";

type Social = { icon: any; label: string; link: string; members: string };

export const socials: Social[] = [
    { icon: MessageCircle, label: "Discord", link: "#", members: "Follow" },
    { icon: Twitter, label: "Twitter", link: "#", members: "Follow" },
    { icon: Facebook, label: "Facebook", link: "#", members: "Follow" },
    { icon: Instagram, label: "Instagram", link: "#", members: "Follow" },
    { icon: TikTok, label: "TikTok", link: "#", members: "Follow" },
];