// import { NextResponse } from "next/server";

// import { ServerModelIben } from "@/lib/models/ibendouma-models";
// import { connectDB } from "@/lib/db";

// export async function GET(
//   request: Request,
//   { params }: { params: { serverId: string } }
// ) {
//   try {
//     // await connectDB();

//     const { serverId } = params;
//     const servers = await ServerModelIben.find({ serverCategory: serverId });
//     // console.log(servers);
//     return NextResponse.json(servers, { status: 200 });
//   } catch (error: any) {
//     return NextResponse.json(error, { status: 500 });
//   }
// }
