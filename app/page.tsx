"use client";
import Background from "@/components/background";
import Button, { ButtonProps } from "@/components/button";

const buttonIds = [
  // "spotify",
  // "apple music",
  // "bandcamp",
  "soundcloud",
  // "tiktok",
  // "instagram",
  // "email",
] as const;
type ButtonId = (typeof buttonIds)[number];

export default function Home() {
  const handleButtonClick = (id: ButtonId) => () => {
    switch (id) {
      // case "spotify":
      //   window.open(
      //     "https://open.spotify.com/artist/33IUlB3VxN8hnkdspcLk7v",
      //     "_blank"
      //   );
      //   break;
      // case "apple music":
      //   window.open(
      //     "https://music.apple.com/fr/artist/literally-the-moon/1736386562",
      //     "_blank"
      //   );
      //   break;
      // case "bandcamp":
      //   window.open("https://literallythemoon.bandcamp.com/", "_blank");
      //   break;
      case "soundcloud":
        window.open("https://soundcloud.com/tuna-duvet", "_blank");
        break;
      // case "tiktok":
      //   window.open("https://www.tiktok.com/@literallymoonmusic", "_blank");
      //   break;
      // case "instagram":
      //   window.open("https://www.instagram.com/literallymoonmusic/", "_blank");
      //   break;
      // case "email":
      //   window.open("mailto:literallythemoonmusic@gmail.com", "_blank");
      //   break;
    }
  };
  const buttonData: ButtonProps[] = buttonIds.map((id) => ({
    children: id,
    onClick: handleButtonClick(id),
  }));

  return (
    <>
      <Background />
      <main className="flex min-h-screen flex-col items-center justify-between z-10 py-24 px-4 overflow-hidden">
        <div className="w-full max-w-screen-sm flex-grow flex flex-col justify-center gap-16 text-center">
          <div className="flex flex-col gap-4 text-gray-900 opacity-85">
            <h1 className="text-6xl md:text-8xl font-bold tracking-tight">
              TUNA DUVET
            </h1>
            {/* <p>i&apos;m all over the place</p> */}
          </div>
          <div className="flex flex-col gap-8 cute">
            {buttonData.map((buttonProps, index) => (
              <Button key={index} {...buttonProps} className="w-full" />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
