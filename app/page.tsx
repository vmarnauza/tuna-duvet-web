"use client";
import Background from "@/components/background";
import Button, { ButtonProps } from "@/components/button";

type ButtonId = "spotify" | "apple" | "soundcloud" | "bandcamp";

export default function Home() {
  const handleButtonClick = (id: ButtonId) => () => {
    switch (id) {
      case "spotify":
        window.open(
          "https://open.spotify.com/artist/33IUlB3VxN8hnkdspcLk7v",
          "_blank"
        );
        break;
      case "apple":
        window.open(
          "https://music.apple.com/fr/artist/literally-the-moon/1736386562",
          "_blank"
        );
        break;
      case "bandcamp":
        window.open("https://literallythemoon.bandcamp.com/", "_blank");
        break;
      case "soundcloud":
        window.open("https://soundcloud.com/literally-the-moon", "_blank");
        break;
    }
  };
  const buttonData: ButtonProps[] = [
    {
      children: "spotify",
      onClick: handleButtonClick("spotify"),
    },
    {
      children: "apple music",
      onClick: handleButtonClick("apple"),
    },
    {
      children: "bandcamp",
      onClick: handleButtonClick("bandcamp"),
    },
    {
      children: "soundcloud",
      onClick: handleButtonClick("soundcloud"),
    },
  ];
  return (
    <>
      <Background />
      <main className="flex min-h-screen flex-col items-center justify-between z-10 pt-24 px-4">
        <div className="w-full max-w-screen-sm flex-grow flex flex-col gap-16 text-center">
          <h1 className="text-white text-6xl">literally the moon</h1>
          <div className="flex flex-col gap-8">
            {buttonData.map((buttonProps, index) => (
              <Button key={index} {...buttonProps} className="w-full" />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
