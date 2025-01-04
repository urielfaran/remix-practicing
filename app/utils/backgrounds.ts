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
  // Check if the background is an image URL
  const isImageUrl = boardBg?.startsWith("url") ?? false;

  // Default variables
  let className = "";
  let style = {};

  // Case 1: If background is null, use secondary color
  if (boardBg === null) {
    className = "";
    style = {
      backgroundColor: "hsl(var(--secondary))", // Use secondary background color (CSS variable)
    };
  }
  // Case 2: If it's an image URL, apply image-related styles
  else if (isImageUrl) {
    className = "bg-cover bg-center"; // Tailwind classes for image background
    style = {
      backgroundImage: boardBg, // Set image as background
      backgroundPosition: "center",
      backgroundSize: "cover",
    };
  }
  // Case 3: For gradients or solid colors, apply directly
  else {
    className = ""; // No class needed for gradient or solid color
    style = {
      background: boardBg, // Use the provided background (gradient or solid color)
    };
  }

  return { className, style };
}
