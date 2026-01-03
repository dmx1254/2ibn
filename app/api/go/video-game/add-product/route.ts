import { goapiModels } from "@/lib/models/ibytrade-models";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const headers = new Headers();
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  const data = await req.json();
  console.log(data);

  if (!data) {
    return NextResponse.json(
      { error: "Data is required" },
      { status: 400, headers }
    );
  }

  const category = data.rowData.category.trim().toLowerCase();

  const newCategory = category.replace(/\s+/g, "-");

  const licenceModified = data.rowData.licence.trim().toLowerCase();
  const newLicence = licenceModified.replace(/\s+/g, "-");

  // console.log(newCategory);
  // console.log(newLicence);
  // return;
  const { AccountModel } = await goapiModels;
  try {
    if (!data.rowData.description) {
      return NextResponse.json(
        { error: "Description is required" },
        { status: 400, headers }
      );
    }

    const checkIsProductExits = await AccountModel.findOne({
      description: data.rowData.description,
    });

    if (checkIsProductExits) {
      checkIsProductExits.category = newCategory
        ? newCategory
        : checkIsProductExits.category;
      checkIsProductExits.licence = newLicence
        ? newLicence
        : checkIsProductExits.licence;
      checkIsProductExits.stock =
        data.rowData.stock && typeof data.rowData.stock === "number"
          ? Number(data.rowData.stock)
          : checkIsProductExits.stock;
      checkIsProductExits.price =
        data.rowData.price && typeof data.rowData.price === "number"
          ? parseFloat(data.rowData.price)
          : checkIsProductExits.price;
      checkIsProductExits.minQ =
        data.rowData.minQ && typeof data.rowData.minQ === "number"
          ? Number(data.rowData.minQ)
          : checkIsProductExits.minQ;
      checkIsProductExits.deliveryDelay =
        data.rowData.deliveryDelay &&
        typeof data.rowData.deliveryDelay === "number"
          ? Number(data.rowData.deliveryDelay)
          : checkIsProductExits.deliveryDelay;
      checkIsProductExits.status = data.rowData.status
        ? data.rowData.status
        : checkIsProductExits.status;
      checkIsProductExits.moreDetails = data.rowData.moreDetails
        ? data.rowData.moreDetails
        : checkIsProductExits.moreDetails;
      await checkIsProductExits.save();
      console.log("Product updated successfully");
      return NextResponse.json(
        { message: "Product already exists", product: checkIsProductExits },
        { status: 200, headers }
      );
    } else {
      if (
        !data.rowData.category ||
        !data.rowData.licence ||
        !data.rowData.description ||
        !data.rowData.minQ ||
        !data.rowData.stock ||
        !data.rowData.deliveryDelay ||
        !data.rowData.price ||
        !data.rowData.status ||
        !data.rowData.moreDetails
      ) {
        console.log("All fields are required");
        return NextResponse.json(
          { error: "All fields are required" },
          { status: 400, headers }
        );
      }
      const newProduct = await AccountModel.create({
        category: newCategory,
        licence: newLicence,
        description: data.rowData.description,
        minQ: Number(data.rowData.minQ),
        stock: Number(data.rowData.stock),
        deliveryDelay: Number(data.rowData.deliveryDelay),
        price: parseFloat(data.rowData.price),
        status: data.rowData.status,
        moreDetails: data.rowData.moreDetails,
      });
      console.log(newProduct);
      return NextResponse.json(
        { message: "Product added successfully", product: newProduct },
        { status: 200, headers }
      );
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500, headers });
  }
}

export async function DELETE() {
  const { AccountModel } = await goapiModels;
  try {
    await AccountModel.deleteMany();
    return NextResponse.json(
      { message: "Products deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500, headers });
  }
}

export async function GET() {
  const { AccountModel } = await goapiModels;
  try {
    const products = await AccountModel.find();
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const { AccountModel } = await goapiModels;
  const { id, dataToUpdate } = await req.json();
  try {
    const products = await AccountModel.findByIdAndUpdate(
      id,
      {
        $set: {
          category: dataToUpdate,
        },
      },
      { new: true }
    );
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
