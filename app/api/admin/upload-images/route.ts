import { NextResponse } from "next/server";
import { writeFile, mkdir, readdir } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

function cleanFileName(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9.-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const images = formData.getAll("images");

    const uploadDir = path.join(process.cwd(), "public", "images");
    await mkdir(uploadDir, { recursive: true });

    if (!images || images.length === 0) {
      return NextResponse.json(
        { error: "Aucune image reçue par le serveur." },
        { status: 400 }
      );
    }

    const importedPaths: string[] = [];

    for (const item of images) {
      if (!(item instanceof File)) {
        continue;
      }

      const bytes = await item.arrayBuffer();

      if (bytes.byteLength === 0) {
        continue;
      }

      const buffer = Buffer.from(bytes);

      const safeName = cleanFileName(item.name || "image.jpg");
      const uniqueName = `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}-${safeName}`;

      const filePath = path.join(uploadDir, uniqueName);

      await writeFile(filePath, buffer);

      importedPaths.push(`/images/${uniqueName}`);
    }

    const files = await readdir(uploadDir);

    const allPaths = files
      .filter((file) => /\.(jpg|jpeg|png|webp|gif)$/i.test(file))
      .map((file) => `/images/${file}`)
      .sort()
      .reverse();

    return NextResponse.json({
      success: true,
      importedPaths,
      paths: allPaths,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erreur inconnue pendant l'import.",
      },
      { status: 500 }
    );
  }
}