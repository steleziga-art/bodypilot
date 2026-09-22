import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CYG — Choose Your Goal",
    short_name: "CYG",
    description: "Training, nutrition, progress and adaptive guidance in one connected app.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#071735",
    orientation: "portrait-primary",
    categories: ["fitness", "health", "lifestyle"],
    icons: [
      { src: "/icon.png", sizes: "1254x1254", type: "image/png", purpose: "any" },
      { src: "/icon.png", sizes: "1254x1254", type: "image/png", purpose: "maskable" },
    ],
  };
}
