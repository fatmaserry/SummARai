import React, { memo, useContext, useRef } from "react";
import { AuthContext } from "../../provider/auth/authProvider";

// Helper function to check if a string is English (Latin letters)
const isEnglish = (str) => /^[A-Za-z\s]+$/.test(str);

const WelcomeMessage = memo(() => {
  const { isLoggedIn, user } = useContext(AuthContext);
  const hasRendered = useRef(false);

  const WordDropText = ({
    text,
    delayStart = 0,
    className = "",
    dir = "rtl",
  }) => {
    const baseDelay = hasRendered.current ? 0 : delayStart;
    hasRendered.current = true;

    const words = text
      .split(/([\u0600-\u06FF]+|\s+|\S)/)
      .filter((word) => word.trim().length > 0 || word === " ");

    return (
      <span className={`${className} arabic-text`} dir={dir}>
        {words.map((word, index) => (
          <span
            key={index}
            className="word-drop inline-block"
            style={{
              animationDelay: `${baseDelay + index * 0.15}s`,
              animationFillMode: "forwards",
            }}
          >
            {word === " " ? "\u00A0" : word}
          </span>
        ))}
      </span>
    );
  };

  if (!isLoggedIn) return null;

  // Get the first two words of the user's name
  const nameParts = user.name.split(" ");
  const displayName = nameParts.slice(0, 2).join(" ");

  // Check if the name is English
  const nameIsEnglish = isEnglish(displayName);

  return (
    <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-10 leading-snug text-right text-3d">
      <WordDropText text={" مَــرْحَبــاً بــك يا"} delayStart={0.2} />
      <WordDropText
        className="text-yellow-400"
        text={` ${displayName}`}
        delayStart={1}
        dir={nameIsEnglish ? "ltr" : "rtl"}
      />
      <WordDropText text={" !"} delayStart={1.5} />
      {/* <span className="wave">{" "}👋🏻</span> */}
    </h1>
  );
});

export default WelcomeMessage;
