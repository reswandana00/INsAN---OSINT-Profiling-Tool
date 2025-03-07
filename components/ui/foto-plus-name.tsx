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
  const [profileType, setProfileType] = useState("person");

  useEffect(() => {
    Promise.all([
      fetch("/output/bio_analysis.json"),
      fetch("/output/analysis_results.json"),
    ])
      .then(([bioRes, analysisRes]) =>
        Promise.all([bioRes.json(), analysisRes.json()])
      )
      .then(([bioData, analysisData]) => {
        setProfileType(analysisData.type || "person");

        if (profileType === "person") {
          const personData = {
            name: bioData.analysis.match(/(?:Name|Nama)\s*:\s*(.*)/)?.[1] || "",
            followers: bioData.analysis.match(/Followers : (.*)/)?.[1] || "",
            following: bioData.analysis.match(/Following : (.*)/)?.[1] || "",
            bio: bioData.analysis.match(/Bio : (.*)/)?.[1] || "",
            age: bioData.analysis.match(/Age \(Range\) : (.*)/)?.[1] || "",
            sex: bioData.analysis.match(/Sex : (.*)/)?.[1] || "",
            job:
              bioData.analysis.match(/Job \(have or not\) : (.*)/)?.[1] || "",
            location:
              bioData.analysis.match(/Location \(if exist\) : (.*)/)?.[1] || "",
          };
          setBio(personData);
        } else {
          const nonPersonData = {
            name: bioData.analysis.match(/(?:Name|Nama)\s*:\s*(.*)/)?.[1] || "",
            followers: bioData.analysis.match(/Followers : (.*)/)?.[1] || "",
            following: bioData.analysis.match(/Following : (.*)/)?.[1] || "",
            bio: bioData.analysis.match(/Bio : (.*)/)?.[1] || "",
            about: bioData.analysis.match(/About : (.*)/)?.[1] || "",
          };
          setBio(nonPersonData);
        }
      })
      .catch(() => setBio(null));
  }, [profileType]);

  const renderProfileInfo = () => {
    if (!bio || bio === 0) return [];

    return profileType === "person"
      ? [
          `Name: ${bio.name}`,
          `Followers: ${bio.followers}`,
          `Following: ${bio.following}`,
          `Age Range: ${bio.age}`,
          `Sex: ${bio.sex}`,
          `Job: ${bio.job}`,
          `Location: ${bio.location}`,
        ]
      : [
          `Name: ${bio.name}`,
          `Followers: ${bio.followers}`,
          `Following: ${bio.following}`,
          `Bio: ${bio.bio}`,
          `About: ${bio.about}`,
        ];
  };

  return (
    <div className="flex flex-row items-center gap-4">
      <div className="transition-transform duration-300 hover:scale-105">
        <CardStackDemo cards={customCards} />
      </div>
      <div className="transition-transform duration-300 hover:scale-105">
        <TextSkeleton isLoading={!bio} text={renderProfileInfo()} />
      </div>
    </div>
  );
};

export default FotoName;
