import { defineEndpoint } from "@directus/extensions-sdk";

type Scene = { index: number; footage_in: number; footage_out: number };

function generateChapterVtt(chapters: Scene[], framerate: number): string {
	const vttHeader = "WEBVTT\n\n";

	const vttContent = chapters
		.map((chapter) => {
			const startTime = convertFrameToTimecode(chapter.footage_in, framerate);
			const endTime = convertFrameToTimecode(chapter.footage_out, framerate);
			const title = `Chapter ${chapter.index + 1}`;

			return `${startTime} --> ${endTime}\n${title}`;
		})
		.join("\n\n");

	return vttHeader + vttContent;
}

function convertFrameToTimecode(
	frameNumber: number,
	framerate: number
): string {
	// Calculate total seconds
	const totalSeconds = frameNumber / framerate;

	// Calculate minutes
	const minutes = Math.floor(totalSeconds / 60);

	// Calculate remaining seconds with three decimal places
	const remainingSeconds = (totalSeconds % 60).toFixed(3);

	// Format the timecode as a string with leading zeros
	const formattedTimecode = `${String(minutes).padStart(2, "0")}:${String(
		remainingSeconds
	).padStart(6, "0")}`;

	return formattedTimecode;
}

export default defineEndpoint((router, { services }) => {
	const { ItemsService } = services;

	router.get("/", (_req, res) => {
		if (_req.accountability?.user == null) {
			res.status(403);
			return res.send(`You don't have permission to access this.`);
		}
		// If id is not provided, respond with a 400 Bad Request
		return res.status(400).json({ error: "Missing required parameter: id" });
	});

	// pk = primaryKey
	router.get("/:pk", async (req, res) => {
		if (req.accountability?.user == null) {
			res.status(403);
			return res.send(`You don't have permission to access this.`);
		}
		/* 
		
		TODO: Wie an Framerate kommen? Doch mit nested Werten und auch File abfragen? 
		Oder vll als endpoint /chapters/abc-def-ghi-jkl?framerate=30
		
		*/
		const collection = "scenes";
		const primaryKey = req.params["pk"]!;
		const framerate = Number(req.query["framerate"]);

		if (framerate) {
			console.log(framerate);
		}

		const itemService = new ItemsService(collection, {
			accountability: req.accountability,
			schema: req.schema,
		});

		try {
			const scenes = (await itemService.readByQuery({
				fields: ["index", "footage_in", "footage_out"],
				sort: ["index"],
				filter: { footage_id: { _eq: primaryKey } },
			})) as Scene[];

			const vttData = generateChapterVtt(scenes, framerate);

			// Set appropriate headers for VTT file
			res.header("Content-Type", "text/vtt");
			res.header("Content-Disposition", "attachment; filename=chapters.vtt");

			// Send the VTT data in the response
			res.send(vttData);
		} catch (error: any) {
			return res.sendStatus(401); // TODO
		}
	});
});
