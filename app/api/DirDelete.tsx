import fs from "fs";
import path from "path";

export default async function DirDelete() {
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
    fs.writeFileSync(
      "public/output/output.json",
      JSON.stringify(outputJson, null, 2)
    );

    // Reset bio.json
    const bioJson = {
      name: "",
      briefInfo: "",
      additional: "",
    };
    fs.writeFileSync(
      "public/output/bio.json",
      JSON.stringify(bioJson, null, 2)
    );

    // Reset bio.json
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
    fs.writeFileSync(
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
    fs.writeFileSync(
      "public/output/image_data.json",
      JSON.stringify(imageDataJson, null, 2)
    );

    // Reset bio.json
    const bioAnalysisJson = {
      analysis: "",
    };
    fs.writeFileSync(
      "public/output/bio_analysis.json",
      JSON.stringify(bioAnalysisJson, null, 2)
    );

    // Remove all JPG files from output directory
    const outputDir = "public/output";
    const files = fs.readdirSync(outputDir);

    files.forEach((file) => {
      if (file.toLowerCase().endsWith(".jpg")) {
        fs.unlinkSync(path.join(outputDir, file));
      }
    });

    return { success: true, message: "Directory cleaned successfully" };
  } catch (error) {
    return { success: false, message: "Error cleaning directory" };
  }
}
