import { useState, useEffect } from "react";

const [bioText, setBioText] = useState([]);
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  const loadBioData = async () => {
    try {
      const response = await fetch("/output/bio.json");
      const bioData = await response.json();
      console.log("Fetched bioData:", bioData);
      setBioText(bioData.content);
      setIsLoading(false);
    } catch (error) {
      console.log("Error loading bio:", error);
      setIsLoading(true);
    }
  };
  loadBioData();
}, []);

console.log("Current bioText in render:", bioText);
