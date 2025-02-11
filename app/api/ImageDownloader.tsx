import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// To get the current directory path in an ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const downloadImage = async (url: string, outputPath: string) => {
  try {
    // Fetch the image as a stream
    const response = await axios.get(url, {
      responseType: "stream",
    });

    // Create a write stream and save the image to the specified path
    const writer = fs.createWriteStream(outputPath);

    response.data.pipe(writer);

    writer.on("finish", () => {
      console.log(`Image successfully downloaded to ${outputPath}`);
    });

    writer.on("error", (error) => {
      console.error("Error downloading the image:", error);
    });
  } catch (error) {
    console.error("Error fetching the image:", error);
  }
};

// Image URL from the input
const url =
  "https://scontent-cgk1-2.cdninstagram.com/v/t51.29350-15/468807484_3799913953556963_2148201739134399981_n.jpg?stp=dst-jpg_e35_p1080x1080_tt6&_nc_ht=scontent-cgk1-2.cdninstagram.com&_nc_cat=111&_nc_ohc=qUXPCp1vaw0Q7kNvgFH953i&_nc_gid=59575944d7df4b3686079e5ac97b9e96&edm=AOQ1c0wBAAAA&ccb=7-5&ig_cache_key=MzUxMjQ2MTA2MDQwMTgxNTY3Mw%3D%3D.3-ccb7-5&oh=00_AYAjqd9BnbzgeUGFHM2Q-ikWgmLAQ64cticDbeIaAGpGaQ&oe=67AD167B&_nc_sid=8b3546";

// Output file path
const outputPath = path.resolve(__dirname, "downloaded_image.jpg");

// Download the image
downloadImage(url, outputPath);
