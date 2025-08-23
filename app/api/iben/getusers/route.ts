import { NextResponse } from "next/server";
import { ibenModels } from "@/lib/models/ibendouma-models";
import { addUsersClientsToSheet, UserClient } from "@/lib/orderSheets-exchange";

export async function GET() {
  try {
    const { UserIbenModel } = await ibenModels;
    const users = await UserIbenModel.find()
      .select("lastname firstname email phone -_id")
      .lean();
    const usersData = users.map((user: UserClient) => ({
      lastname: user.lastname ?? "",
      firstname: user.firstname ?? "",
      email: user.email ?? "",
      phone: user.phone ?? "",
    }));
    await addUsersClientsToSheet(usersData);
    return NextResponse.json(usersData, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
