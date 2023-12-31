# Endpoint to generate VTT Data

This Directus endpoint extension is designed to generate a WebVTT (VTT) string from footage and scene data stored in the Directus database. The generated VTT file can be used for displaying chapters or scenes in video players that support WebVTT captions.

Feel free to use this basic code as an inspiration for any other use cases of .vtt data, like generating subtitles.

If you have any ideas for improvement, let me know!

## Usage

I am currently using this endpoint to create chapters from data generated by a scene detection model.

```ts
generateChapterVtt(chapters: Scene[], framerate: number): string
```

This function takes an array of scenes (chapters) and the frame rate of the footage as input and generates a WebVTT string. Each scene is represented as a chapter in the VTT file.

```ts
convertFrameToTimecode(frameNumber: number, framerate: number): string
```

A utility function used internally to convert a frame number to a timecode string in the format MM:SS.SSS.

### Endpoint

This endpoint generates a VTT file for the scenes associated with a specific footage identified by its primary key (pk). The VTT file includes timecodes for each scene and is named chapters.vtt.

**Request:**

```txt
Method: GET
URL: /vtt/chapters/:pk
```

**Response:**

If successful, the response will include the generated VTT data with appropriate headers.

```vtt
WEBVTT

00:00.000 --> 00:01.600
Chapter 1

00:01.640 --> 00:04.680
Chapter 2

00:04.720 --> 00:06.240
Chapter 3

00:06.280 --> 00:08.600
Chapter 4

00:08.640 --> 00:11.200
Chapter 5

00:11.240 --> 00:12.640
Chapter 6
```

If there's an error, the response will include a 401 status code along with an error message.

## Permissions

Access to this endpoint is restricted to authenticated users.

Users without the necessary permissions will receive a 403 Forbidden response.
