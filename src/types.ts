export type Scene = { index: number; footage_in: number; footage_out: number };
export type Footage = { scenes: Scene[]; file: { metadata: { frame_rate: number } } };
