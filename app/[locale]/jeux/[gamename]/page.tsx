import React from "react";
import VirtualGame from "../../components/VirtualGame";

const GamePage = async ({ params }: { params: { gamename: string } }) => {
  const { gamename } = await params;
  return <VirtualGame gamename={gamename} />;
};

export default GamePage;
