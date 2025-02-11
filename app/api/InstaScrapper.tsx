import { InstagramScraper } from "@aduptive/instagram-scraper";
import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs/promises";
import path from "path";
import { createWriteStream, rmSync, writeFileSync } from "fs";
import { generatePersonPrompt } from "./UserInfo";

interface InstagramProfile {
  biography: string;
  hdProfilePicUrl: string;
  bioLinks: string[];
  fullName: string;
  followersCount: string;
  followingCount: string;
  isPrivate: boolean;
  isVerified: boolean;
  mediaCount: number;
}

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

    writeFileSync(filePath, JSON.stringify(userInfo, null, 2));
    return true;
  } catch (error) {
    console.error("Error saving JSON file:", error);
    return false;
  }
}

export const scrapeInstagramProfile = async (
  username: string
): Promise<InstagramProfile> => {
  const url = `https://www.instagram.com/${username}/`;
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const profileData = JSON.parse(
      $('script[type="application/ld+json"]').html() || "{}"
    );
    const hdProfilePicUrl =
      data?.user?.hd_profile_pic_url_info?.url ||
      $('meta[property="og:image"]').attr("content") ||
      "No profile picture available";

    const bio = $('meta[name="description"]').attr("content");

    // Extract links from bio
    const bioText = $('meta[name="description"]').attr("content") || "";
    const bioLinks = bioText.match(/(https?:\/\/[^\s]+)/g) || [];

    // Extract additional profile info
    const fullName = $('meta[property="og:title"]')
      .attr("content")
      ?.split(" (@")[0];
    const followersCount = $('meta[name="description"]')
      .attr("content")
      ?.match(/(\d+)\s*Followers/i)?.[1];
    const followingCount = $('meta[name="description"]')
      .attr("content")
      ?.match(/(\d+)\s*Following/i)?.[1];

    return {
      biography: bio || "No biography available",
      hdProfilePicUrl: hdProfilePicUrl || "No profile picture available",
      bioLinks,
      fullName: fullName || username,
      followersCount: followersCount || "0",
      followingCount: followingCount || "0",
    };
  } catch (error) {
    console.error("Error scraping Instagram profile:", error);
    return {
      biography: "No biography available",
      hdProfilePicUrl: "No profile picture available",
      bioLinks: [],
      fullName: username,
      followersCount: "0",
      followingCount: "0",
    };
  }
};

const downloadImage = async (url: string, outputPath: string) => {
  try {
    const response = await axios.get(url, {
      responseType: "stream",
    });
    const writer = createWriteStream(outputPath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
  } catch (error) {
    console.error("Error fetching the image:", error);
  }
};

const InstaScrapper = async (username: string, postCount: number = 3) => {
  const scraper = new InstagramScraper();
  const profileData = await scrapeInstagramProfile(username);

  // Create output directory
  const outputPath = path.join(process.cwd(), "public", "output");
  await fs.mkdir(outputPath, { recursive: true });

  // Download profile picture
  const profilePicPath = path.join(outputPath, "profile.jpg");
  await downloadImage(profileData.hdProfilePicUrl, profilePicPath);
  console.log(`Downloaded profile picture to ${profilePicPath}`);

  return scraper
    .getPosts(username, postCount)
    .then(async (results) => {
      if (results.success && results.posts) {
        console.log(
          `Successfully collected ${results.posts.length} posts from ${username}`
        );

        const parsedData = {
          success: true,
          profile: profileData,
          posts: results.posts.map((post) => ({
            display_url: post.display_url,
            caption: post.caption || "No caption",
            likes: post.likes || 0,
            comments: post.comments || 0,
            timestamp: post.timestamp,
            location: post.location || null,
            hashtags: (post.caption || "").match(/#[\w]+/g) || [],
            mentions: (post.caption || "").match(/@[\w]+/g) || [],
            postUrl: `https://www.instagram.com/p/${post.shortcode}/`,
          })),
        };

        // Save JSON without reading it again
        const jsonOutputPath = path.join(outputPath, `output.json`);
        await fs.writeFile(jsonOutputPath, JSON.stringify(parsedData, null, 2));
        console.log(`Data saved to ${jsonOutputPath}`);

        // Generate prompt directly from parsedData
        const generatedPrompt = generatePersonPrompt(parsedData);
        console.log("Generated Person Profile:");
        console.log(generatedPrompt);

        // Save bio JSON without re-reading
        const bioJsonPath = path.join(outputPath, "bio.json");
        saveJsonFile(parsedData, bioJsonPath);

        // Download images
        await Promise.all(
          parsedData.posts.map(async (post, index) => {
            const imageOutputPath = path.join(
              outputPath,
              `post${index + 1}.jpg`
            );
            await downloadImage(post.display_url, imageOutputPath);
            console.log(`Downloaded image ${index + 1} to ${imageOutputPath}`);
          })
        );

        return parsedData;
      } else {
        console.error("Error:", results.error);
        return { success: false, error: results.error };
      }
    })
    .catch((error) => {
      console.error("Critical error:", error);
      return { success: false, error };
    });
};

export default InstaScrapper;
