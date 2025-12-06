import { Trophy, Users, Zap } from "lucide-react";

type Command = { name: string; desc: string };
type Plugin = { name: string; icon: any; commands: Command[] };
export type PluginMap = Record<string, Plugin>;

export const commandsByPlugin: PluginMap = {
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
			// basic claim workflow
			{
				name: "/claim wand",
				desc: "Obtén la varita de selección para marcar dos esquinas opuestas.",
			},
			{
				name: "/claim clear",
				desc: "Limpia los puntos seleccionados de tu varita.",
			},
			{
				name: "/claim buy [name]",
				desc: "Compra el área seleccionada. Proporciona un nombre (una sola palabra) para registrar el reclamo.",
			},

			// trust / permissions
			{
				name: "/claim trust <player> [perms] [claimName]",
				desc: "Concede permisos a un jugador para tu selección o un reclamo nombrado. Perms: place, break, open, interact, attack, bucket, redstone, all.",
			},
			{
				name: "/claim untrust <player> [claimName]",
				desc: "Revoca los permisos de un jugador para tu selección o un reclamo nombrado.",
			},

			// claim management
			{
				name: "/claim unclaim [name]",
				desc: "Elimina reclamos. Sin nombre, desreclama tus reclamos dentro de la selección; con nombre, apunta al reclamo especificado.",
			},
			{
				name: "/claim flag set <flag> <true|false> [claimName]",
				desc: "Activa/desactiva una bandera del reclamo (p. ej. mobspawn, pvp, redstone) para un reclamo nombrado o para reclamos propios que intersectan la selección.",
			},
			{
				name: "/claim menu",
				desc: "Abre el menú interactivo de reclamos para ver tu lista de reclamos y detalles.",
			},

			// teleport / misc
			{
				name: "/claim tp [name]",
				desc: "Teletransporta al reclamo nombrado si tiene coordenadas de TP y tienes permiso.",
			},
			{
				name: "/claim settp",
				desc: "Establece tu ubicación actual como punto de teletransporte del reclamo (solo propietario del reclamo).",
			},
			{
				name: "/claim help",
				desc: "Muestra la ayuda de reclamos. Haz click en un comando para pegarlo en el chat y editarlo.",
			},
		],
	},
};
