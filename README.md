# Endpoint to generate VTT Data

First of all, this Directus endpoint to generate a Video Text Tracks (VTT) file dynamically is just a proof of concept and not something to immediately copy and paste. If that is fine with you, please check it out. The idea might be useful to you.

Given a list of Scene objects, as defined below, which are related to a video, it calculates and formats timecodes for video frames, producing a VTT file containing chapter information.

```ts
type Scene = {
  index: number,      // the position of the scene in the video
  footage_in: number, // the start frame number
  footage_out: number // the end frame number
} 
```

The endpoint first retrieves the required data from a collection and uses the frame rate passed as a query in the URL to calculate the timecodes.

The output will look like this:

```text
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

Feel free to use this basic code as an inspiration for any other use cases of .vtt data, like generating subtitles.

If you have any ideas for improvement, let me know!
