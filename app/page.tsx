"use client";
import Background from "@/components/background";
import Button, { ButtonProps } from "@/components/button";

export default function Home() {
  const buttonData: ButtonProps[] = [
    {
      children: "Listen on SoundCloud",
      href: "https://soundcloud.com/tuna-duvet",
      target: "_blank",
    },
  ];

  return (
    <>
      <Background />
      <main className="flex min-h-screen flex-col items-center justify-between z-10 py-24 px-4 overflow-hidden">
        <div className="w-full max-w-screen-sm flex-grow flex flex-col justify-center gap-16 text-center">
          <div className="flex flex-col gap-4 text-gray-900 opacity-85">
            {/* <p className="h1">Hi,</p> */}
            <h1 className="h1">TUNA DUVET</h1>
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
