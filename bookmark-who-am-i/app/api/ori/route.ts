import { NextRequest, NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";
import { exec } from "child_process";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const imageName = url.searchParams.get("name"); // Check if request is for an image

  const desktopPath = path.join(require("os").homedir(), "OneDrive", "Desktop", "images");
  const imageExtensions = new Set([".png", ".jpg", ".jpeg", ".gif", ".bmp", ".webp"]);

  // ✅ **If request includes an image name, serve the file**
  if (imageName) {
    const filePath = path.join(desktopPath, imageName);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ success: false, error: "File not found" }, { status: 404 });
    }

    const fileStream = fs.readFileSync(filePath);
    const fileExt = path.extname(imageName).toLowerCase();
    const mimeType = fileExt === ".png"
      ? "image/png"
      : fileExt === ".jpg" || fileExt === ".jpeg"
      ? "image/jpeg"
      : fileExt === ".gif"
      ? "image/gif"
      : fileExt === ".webp"
      ? "image/webp"
      : "application/octet-stream";

    return new NextResponse(fileStream, {
      headers: {
        "Content-Type": mimeType,
        "Cache-Control": "no-store",
      },
    });
  }

  // ✅ **Otherwise, return a random image URL**
  try {
    const files = fs.readdirSync(desktopPath)
      .map(file => path.join(desktopPath, file))
      .filter(filePath => {
        const ext = path.extname(filePath).toLowerCase();
        return imageExtensions.has(ext) && fs.statSync(filePath).isFile();
      });

    if (files.length === 0) {
      return NextResponse.json({ success: false, message: "No image files found" }, { status: 404 });
    }

    const randomFile = files[Math.floor(Math.random() * files.length)];
    const fileName = path.basename(randomFile);

    // Open the file in the system's default image viewer
    const openCommand = process.platform === "win32"
      ? `start "" "${randomFile}"`
      : process.platform === "darwin"
      ? `open "${randomFile}"`
      : `xdg-open "${randomFile}"`;

    exec(openCommand);

    return NextResponse.json({ success: true, fileUrl: `/api/ori?name=${encodeURIComponent(fileName)}` });
  } catch (error) {
    console.error("Error selecting image:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
