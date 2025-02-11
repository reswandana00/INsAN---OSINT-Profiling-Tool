import axios from "axios";
import * as cheerio from "cheerio";

interface InstagramProfile {
  biography: string;
  hdProfilePicUrl: string;
}

const scrapeInstagramProfile = async (
  url: string
): Promise<InstagramProfile> => {
  try {
    // Fetch the HTML of the Instagram page
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // Extract the HD profile picture URL and biography
    const profilePicUrl = $('meta[property="og:image"]').attr("content");
    const bio = $('meta[name="description"]').attr("content");

    // Return the result
    return {
      biography: bio || "No biography available",
      hdProfilePicUrl: profilePicUrl || "No profile picture available",
    };
  } catch (error) {
    console.error("Error scraping Instagram profile:", error);
    throw new Error("Failed to scrape the profile");
  }
};

const main = async () => {
  // URL of the Instagram profile you want to scrape
  const profileUrl = "https://www.instagram.com/latief_reswandana/";

  try {
    const profileData = await scrapeInstagramProfile(profileUrl);
    console.log("Biography:", profileData.biography);
    console.log("HD Profile Picture URL:", profileData.hdProfilePicUrl);
  } catch (error) {
    console.error(error);
  }
};

main();
