import React from "react";
import { SparkleText } from "./ui/sparkle-text";
import TextSkeleton from "./ui/text-skeleton";
import FotoName from "./ui/foto-plus-name";
import analysisResults from "../public/output/analysis_results.json";

const GridCard = () => {
  const personalInfo = analysisResults.analysis.split("Behaviour Context:")[0];
  const behaviorContext = analysisResults.analysis
    .split("Behaviour Context:")[1]
    ?.split("Additional Information:")[0];
  const additionalInfo = analysisResults.analysis.split(
    "Additional Information:"
  )[1];

  const formatText = (text: string) => {
    return text
      ?.split("\n")
      .filter(Boolean)
      .map((line, index) => (
        <p key={index} className="mb-2">
          {line}
        </p>
      ));
  };

  return (
    <div className="lg:scale-120 md:-mt-10 lg:-mt-10">
      <SparkleText />
      <div className="-mt-36">
        <FotoName />
      </div>
      <div className="-mt-48">
        {/* Profile Skeleton */}
        <div className="mt-5 transition-transform duration-300 hover:scale-105">
          <h2 className="text-2xl font-extrabold mb-2 text-white transition-transform duration-300 hover:scale-105">
            Profile Image Description
          </h2>
          <TextSkeleton
            className="w-[496px] prose prose-lg prose-slate transition-transform duration-300 hover:scale-105"
            isLoading={!analysisResults.raw_data.images.profile}
            text={formatText(analysisResults.raw_data.images.profile)}
          />
        </div>

        {/* Posts Skeletons */}
        {analysisResults.raw_data.images.posts &&
          Object.entries(analysisResults.raw_data.images.posts).map(
            ([key, value], index) => (
              <div
                key={key}
                className="mt-5 transition-transform duration-300 hover:scale-105"
              >
                <h2 className="text-2xl font-extrabold mb-2 text-white transition-transform duration-300 hover:scale-105">
                  Post {index + 1} Description
                </h2>
                <TextSkeleton
                  className="w-[496px] h-60 prose prose-lg prose-slate transition-transform duration-300 hover:scale-105"
                  isLoading={!value}
                  text={formatText(value)}
                />
              </div>
            )
          )}

        {/* Analysis Skeletons */}
        <div className="mt-5 transition-transform duration-300 hover:scale-105">
          <h2 className="text-2xl font-extrabold mb-2 text-white transition-transform duration-300 hover:scale-105">
            Detail Context
          </h2>
          <TextSkeleton
            className="w-[496px] h-60 prose prose-lg prose-slate transition-transform duration-300 hover:scale-105"
            isLoading={!personalInfo}
            text={formatText(personalInfo)}
          />
        </div>
        <div className="mt-5 transition-transform duration-300 hover:scale-105">
          <h2 className="text-2xl font-extrabold mb-2 text-white transition-transform duration-300 hover:scale-105">
            Behavior Context
          </h2>
          <TextSkeleton
            className="w-[496px] h-60 prose prose-lg prose-slate transition-transform duration-300 hover:scale-105"
            isLoading={!behaviorContext}
            text={formatText(behaviorContext)}
          />
        </div>
        <div className="mt-5 transition-transform duration-300 hover:scale-105">
          <h2 className="text-2xl font-extrabold mb-2 text-white transition-transform duration-300 hover:scale-105">
            Additional Information
          </h2>
          <TextSkeleton
            className="w-[496px] h-60 prose prose-lg prose-slate transition-transform duration-300 hover:scale-105"
            isLoading={!additionalInfo}
            text={formatText(additionalInfo)}
          />
        </div>
      </div>
    </div>
  );
};

export default GridCard;
