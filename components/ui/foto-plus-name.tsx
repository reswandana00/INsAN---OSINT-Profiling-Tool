"use client";

import React from "react";
import { CardStackDemo } from "../ui/card-photo-shuffle";
import TextSkeleton from "../ui/text-skeleton";
import { useEffect, useState } from "react";

let outputData;
const getOutputData = () => {
  try {
    return require("../../public/output/output.json");
  } catch {
    return require("../../public/template.json");
  }
};

outputData = getOutputData();

const { profile, posts = [] } = outputData;
const customCards = [
  {
    id: 0,
    name: "Image Not Found",
    designation: "Profile",
    imageUrl: profile.hdProfilePicUrl,
  },
  ...posts.map((post, index) => ({
    id: index + 1,
    name: `Post ${index + 1}`,
    designation: `Instagram Post ${index + 1}`,
    imageUrl: `/output/post${index + 1}.jpg`,
  })),
];

const FotoName = () => {
  const [bio, setBio] = useState(null);

  useEffect(() => {
    fetch("/output/bio.json")
      .then((res) => {
        if (!res.ok) throw new Error("File not found");
        return res.json();
      })
      .then((data) => {
        // Check if all fields are empty, set bio to 0
        if (!data.name && !data.briefInfo && !data.additional) {
          setBio(0);
        } else {
          setBio(data);
        }
      })
      .catch(() => setBio(null));
  }, []);

  return (
    <div className="flex flex-row items-center gap-4">
      <div>
        <CardStackDemo cards={customCards} />
      </div>
      <div>
        <TextSkeleton
          isLoading={!bio}
          text={
            bio && bio !== 0 ? [bio.name, bio.briefInfo, bio.additional] : []
          }
        />
      </div>
    </div>
  );
};

export default FotoName;
