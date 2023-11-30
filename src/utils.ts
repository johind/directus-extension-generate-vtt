import type { Scene } from "./types";

export function generateChapterVtt(chapters: Scene[], framerate: number): string {
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