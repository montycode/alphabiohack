import { NextResponse } from "next/server";
import { getSpecialtiesAndServices } from "@/services/booking.service";

export async function GET() {
  try {
    const specialtiesAndServices = await getSpecialtiesAndServices();

    return NextResponse.json({
      specialtiesAndServices,
    });
  } catch (error) {
    console.error("Error fetching specialties and services:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
