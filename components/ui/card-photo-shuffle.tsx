"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Card = {
  id: number;
  name: string;
  designation: string;
  imageUrl?: string;
};

const CardStack = ({
  items,
  offset,
  scaleFactor,
}: {
  items: Card[];
  offset?: number;
  scaleFactor?: number;
}) => {
  const CARD_OFFSET = offset || 10;
  const SCALE_FACTOR = scaleFactor || 0.06;
  const [cards, setCards] = useState<Card[]>(items);

  const moveToNextCard = () => {
    setCards((prevCards: Card[]) => {
      const newArray = [...prevCards];
      newArray.unshift(newArray.pop()!);
      return newArray;
    });
  };

  return (
    <div className="relative h-60 w-60 md:h-60 md:w-60 flex flex-auto justify-start">
      {cards.map((card, index) => {
        return (
          <motion.div
            key={card.id}
            onClick={moveToNextCard}
            className="absolute dark:bg-black bg-white h-60 w-60 md:h-60 md:w-60 rounded-3xl overflow-hidden shadow-xl border border-neutral-200 dark:border-white/[0.1] shadow-black/[0.1] dark:shadow-white/[0.05] cursor-pointer"
            style={{
              transformOrigin: "top center",
            }}
            animate={{
              top: index * -CARD_OFFSET,
              scale: 1 - index * SCALE_FACTOR,
              zIndex: cards.length - index,
              opacity: index === 0 ? (card.imageUrl ? 1 : 0.8) : 0.6,
            }}
          >
            {card.imageUrl ? (
              <img
                src={card.imageUrl}
                alt={card.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-neutral-100 dark:bg-stone-950 flex items-center justify-center">
                <span className="text-neutral-400">No image</span>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

import { cn } from "@/lib/utils";
export function CardStackDemo({ cards = CARDS }: { cards?: Card[] }) {
  return (
    <div className="h-[40rem] flex items-center justify-center w-full">
      <CardStack items={cards} />
    </div>
  );
}

// Small utility to highlight the content of specific section of a testimonial content
export const Highlight = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <span
      className={cn(
        "font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-700/[0.2] dark:text-emerald-500 px-1 py-0.5",
        className
      )}
    >
      {children}
    </span>
  );
};
