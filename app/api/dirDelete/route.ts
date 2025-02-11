import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST() {
  try {
    // Reset output.json
    const outputJson = {
      success: false,
      profile: {
        biography: "",
        hdProfilePicUrl: "",
        bioLinks: [],
        fullName: "",
        followersCount: "",
        followingCount: "",
      },
      posts: [],
    };
    await fs.writeFile(
      "public/output/output.json",
      JSON.stringify(outputJson, null, 2)
    );

    // Reset bio.json
    const bioJson = {
      name: "",
      briefInfo: "",
      additional: "",
    };
    await fs.writeFile(
      "public/output/bio.json",
      JSON.stringify(bioJson, null, 2)
    );

    // Reset analysis_results.json
    const analysisJson = {
      raw_data: {
        bio: {
          name: "",
          briefInfo: "",
          additional: "",
        },
        images: {
          "post1.jpg": "",
          "profile.jpg": "",
        },
      },
      analysis: "",
    };
    await fs.writeFile(
      "public/output/analysis_results.json",
      JSON.stringify(analysisJson, null, 2)
    );

    // Reset image_data.json
    const imageDataJson = {
      profile: "",
      posts: {
        post1: "",
        post2: "",
        post3: "",
      },
    };
    await fs.writeFile(
      "public/output/image_data.json",
      JSON.stringify(imageDataJson, null, 2)
    );

    // Remove all JPG files from output directory
    const outputDir = "public/output";
    const files = await fs.readdir(outputDir);

    for (const file of files) {
      if (file.toLowerCase().endsWith(".jpg")) {
        await fs.unlink(path.join(outputDir, file));
      }
    }

    return NextResponse.json({ success: true, message: "Directory cleaned successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error cleaning directory" }, { status: 500 });
  }
}
