export const colors = [
  "linear-gradient(#e66465, #9198e5)",
  "linear-gradient(to right, #8360c3, #2ebf91)",
  "linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%)",
  "linear-gradient(to right, #1fa2ff, #12d8fa, #a6ffcb)",
  "linear-gradient(to right, #f12711, #f5af19)",
  "linear-gradient(to right, #fc5c7d, #6a82fb)",
  "linear-gradient(to right, #03001e, #7303c0, #ec38bc, #fdeff9)",
  "linear-gradient(to right, #ee0979, #ff6a00)",
];

export const images = [
  `url(/images/space.jpg)`,
  `url(/images/beach.jpg)`,
  `url(/images/desert.jpg)`,
  `url(/images/plant.jpg)`,
  `url(/images/drop.jpg)`,
  `url(/images/electric.jpg)`,
  `url(/images/building.jpg)`,
  `url(/images/fungi.jpg)`,
];

export const backgrounds = colors.concat(images);

export function getBackgroundStyle(boardBg: string | null) {
  const bgType = boardBg?.startsWith("url") ?? false;
  const className = {
    "bg-secondary": boardBg === null, // Apply 'bg-secondary' if boardBg is not defined
    "bg-cover bg-center": bgType, // Apply these if it's an image URL
  };
  const style = {
    ...(boardBg && bgType // Check if the value is an image URL
      ? {
          backgroundImage: boardBg, // Apply the image as a background
          backgroundPosition: "center",
          backgroundSize: "cover",
        }
      : { background: boardBg || "secondary" }), // Use fallback color if no backgroundColor
  };

  return { className, style };
}
