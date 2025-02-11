import fs from "fs";

function readJsonFile(filePath) {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading or parsing JSON file:", error);
    return null;
  }
}

// Add this new function to save JSON data
function saveJsonFile(data: any, filePath: string) {
  try {
    const userInfo = {
      name: data.profile.fullName,
      briefInfo: `This is an Instagram user with ${data.profile.followersCount} followers and following ${data.profile.followingCount} accounts.`,
      additional:
        data.posts.length > 0
          ? `Their content focuses on ${data.posts
              .map((post) => post.hashtags.join(", "))
              .join(" and ")}`
          : "No posts are available to analyze their interests.",
    };

    fs.writeFileSync(filePath, JSON.stringify(userInfo, null, 2));
    return true;
  } catch (error) {
    console.error("Error saving JSON file:", error);
    return false;
  }
}

export function generatePersonPrompt(data) {
  if (!data || !data.profile) {
    return "Invalid data provided.";
  }

  const firstName = data.profile.fullName
    .split(".")[0]
    .replace(/([A-Z])/g, " $1")
    .toLowerCase();
  const capitalizedName =
    firstName.charAt(0).toUpperCase() + firstName.slice(1);

  return `Make description of this person(predic data) and predict actual name output in bahasa make output following Template
  name: ${capitalizedName} (derived from username ${data.profile.fullName})
  brief info: This is an Instagram user with ${
    data.profile.followersCount
  } followers and following ${
    data.profile.followingCount
  } accounts. \nAdditional: They have shared ${
    data.posts.length
  } posts on their profile. ${
    data.posts.length > 0
      ? `Their content focuses on ${data.posts
          .map((post) => post.hashtags.join(", "))
          .join(" and ")}`
      : "No posts are available to analyze their interests."
  }
  Template :
  Nama:
  Informasi Singkat:
  Konten dan Minat:
  Kesimpulan:`;
}

const filePath = "E:/Project/insan-osint-saas/public/output/output.json"; // Change to the path of your JSON file
const outputData = readJsonFile(filePath);
// if (outputData) {
//   const PromptGen = generatePersonPrompt(outputData);
//   console.log(PromptGen);
// }

// Add export statement
export const PromptGen = generatePersonPrompt(outputData);

// Add this line to save the data
const outputPath = "public/output/bio.json";
saveJsonFile(outputData, outputPath);
