// Composition data for the illustrated world maps.
// Coordinates are percent of each artwork. Every node sits on a stone pedestal or a bend of the
// painted road, and `sign` is where the foot of the "Complete Quest N" signpost stands when that
// quest is the first locked one.
// `thumb` frames the world's landmark for the small picture on the world card.

export const WORLD_ART = {
  w1: {
    image: "/images/world-1.jpg",
    ratio: 1600 / 900,
    thumb: { position: "22% 48%", zoom: 2.4 },
    nodes: [
      { x: 50, y: 19.8 },
      { x: 53.4, y: 41.7, sign: { x: 66.3, y: 47.2 } },
      { x: 55.8, y: 60.3, sign: { x: 42.5, y: 69.8 } },
      { x: 55.6, y: 79.2, sign: { x: 69.4, y: 86.4 } },
      { x: 83.8, y: 56.1, sign: { x: 72.5, y: 50 } },
    ],
  },
  w2: {
    image: "/images/world-2.jpg",
    ratio: 1536 / 864,
    thumb: { position: "52% 4%", zoom: 2.4 },
    nodes: [
      { x: 50, y: 15.3 },
      { x: 62, y: 33.8, sign: { x: 78.5, y: 35.9 } },
      { x: 46.4, y: 50.7, sign: { x: 36.1, y: 59 } },
      { x: 65, y: 66.9, sign: { x: 80.4, y: 71.8 } },
      { x: 53.5, y: 84.3, sign: { x: 69, y: 88 } },
    ],
  },
  w3: {
    image: "/images/world-3.jpg",
    ratio: 1600 / 900,
    thumb: { position: "20% 46%", zoom: 2.4 },
    nodes: [
      { x: 50.9, y: 17.8 },
      { x: 60, y: 33.1, sign: { x: 69.7, y: 34.4 } },
      { x: 46.1, y: 46.7, sign: { x: 35, y: 56.1 } },
      { x: 65.9, y: 60.9, sign: { x: 80, y: 76.5 } },
      { x: 60, y: 79.8, sign: { x: 75, y: 82.2 } },
    ],
  },
  w4: {
    image: "/images/world-4.jpg",
    ratio: 1600 / 900,
    thumb: { position: "30% 36%", zoom: 2.4 },
    nodes: [
      { x: 52.9, y: 23.1 },
      { x: 66.6, y: 35.3, sign: { x: 80.1, y: 40.6 } },
      { x: 50.9, y: 46.7, sign: { x: 37.5, y: 57.8 } },
      { x: 71.1, y: 59.7, sign: { x: 56.3, y: 66.7 } },
      { x: 56.1, y: 77.8, sign: { x: 71.9, y: 84.4 } },
    ],
  },
  w5: {
    image: "/images/world-5.jpg",
    ratio: 1392 / 752,
    thumb: { position: "50% 30%", zoom: 1.8 },
    nodes: [
      { x: 45, y: 40 },
      { x: 58, y: 51, sign: { x: 74, y: 52 } },
      { x: 50, y: 62, sign: { x: 34, y: 66 } },
      { x: 58, y: 72, sign: { x: 74, y: 76 } },
      { x: 49, y: 83, sign: { x: 34, y: 88 } },
    ],
  },
  w6: {
    image: "/images/world-6.jpg",
    ratio: 1600 / 900,
    thumb: { position: "30% 38%", zoom: 2.4 },
    nodes: [
      { x: 50, y: 18.7 },
      { x: 60.8, y: 32.4, sign: { x: 77, y: 42.8 } },
      { x: 44.6, y: 48.7, sign: { x: 32.5, y: 57.8 } },
      { x: 67.2, y: 63.3, sign: { x: 81.3, y: 76.7 } },
      { x: 54.3, y: 80.9, sign: { x: 70.6, y: 88.9 } },
    ],
  },
};

export const WORLD_ART_FALLBACK = WORLD_ART.w1;
