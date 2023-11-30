import { defineEndpoint } from "@directus/extensions-sdk";
import { generateChapterVtt } from "./utils";
import type { Footage } from "./types";

export default defineEndpoint(async (router, context) => {
	const { services, getSchema } = context;
	const { ItemsService } = services;

	const schema = await getSchema();
	const footageService = new ItemsService("footage", { schema });

	router.get("/", async (_req, res) => {
		// @ts-ignore
		if (_req.accountability?.user == null) {
			res.status(403);
			return res.send(`You don't have permission to access this.`);
		}
		// If id is not provided, respond with a 400 Bad Request
		return res.status(400).json({ error: "Missing required parameter: id" });
	});

	router.get("/chapters/:pk", async (req, res) => {
		// @ts-ignore
		if (req.accountability?.user == null) {
			res.status(403);
			return res.send(`You don't have permission to access this.`);
		}

		const primaryKey = req.params["pk"]!;

		try {

			const footage = (await footageService.readOne(primaryKey, {
				fields: ["scenes.index", "scenes.footage_in", "scenes.footage_out", "file.metadata"],
				deep: { scenes: { _sort: ["index"] } },
			})) as Footage;

			const framerate = footage.file.metadata.frame_rate;
			const scenes = footage.scenes;

			const vttData = generateChapterVtt(scenes, framerate);

			// Set appropriate headers for VTT file
			res.header("Content-Type", "text/vtt");
			res.header("Content-Disposition", "attachment; filename=chapters.vtt");

			// Send the VTT data in the response
			return res.send(vttData);
		} catch (error: any) {
			res.setHeader("error", error);
			return res.sendStatus(401); // TODO
		}
	});
});
