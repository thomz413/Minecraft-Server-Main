import type { PluginMap } from "@/constants/commands.ts";

export function filterCommands(commandsByPlugin: PluginMap, query: string) {
	if (!query) return commandsByPlugin;

	const q = query.toLowerCase();

	return Object.fromEntries(
		Object.entries(commandsByPlugin).map(([key, plugin]) => [
			key,
			{
				...plugin,
				commands: plugin.commands.filter(
					(cmd: any) =>
						cmd.name.toLowerCase().includes(q) ||
						cmd.desc.toLowerCase().includes(q),
				),
			},
		]),
	);
}
