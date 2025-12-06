type Role = { name: string; color: string; perks: string[] };

export const roles: Role[] = [
	{
		name: "Miembro",
		color: "from-blue-500 to-blue-600",
		perks: ["Comandos básicos", "Reclamo de terreno", "Acceso a la tienda"],
	},
	{
		name: "VIP",
		color: "from-purple-500 to-purple-600",
		perks: [
			"Todos los beneficios de Miembro",
			"Recompensas dobles",
			"Cola prioritaria",
		],
	},
	{
		name: "Leyenda",
		color: "from-yellow-500 to-orange-600",
		perks: [
			"Todos los beneficios de VIP",
			"Objetos personalizados",
			"Acceso a eventos",
		],
	},
];
