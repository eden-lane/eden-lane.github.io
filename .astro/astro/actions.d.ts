declare module "astro:actions" {
	type Actions = typeof import("/Users/eden_lane/Projects/me/edencore.dev/src/actions")["server"];

	export const actions: Actions;
}