"use client";

import dynamic from "next/dynamic";

const Game = dynamic(() => import("@/components/Game"), {
  ssr: false,
  loading: () => (
    <div className="boot">
      <p>Opening your house…</p>
    </div>
  ),
});

export default function Page() {
  return <Game />;
}
