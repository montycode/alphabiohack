import { NextRequest, NextResponse } from "next/server";
import {
  createSpecialty,
  getAllSpecialties,
  getPopularSpecialties,
  getSpecialtiesWithServices,
  getSpecialtyByName,
  searchSpecialtiesByName,
  specialtyExists,
} from "@/services";

// GET /api/specialties - Obtener especialidades
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");
    const search = searchParams.get("search");
    const withServices = searchParams.get("withServices");
    const popular = searchParams.get("popular");
    const limit = searchParams.get("limit");

    let specialties;

    if (name) {
      const specialty = await getSpecialtyByName(name);
      specialties = specialty ? [specialty] : [];
    } else if (search) {
      specialties = await searchSpecialtiesByName(search);
    } else if (withServices === "true") {
      specialties = await getSpecialtiesWithServices();
    } else if (popular === "true") {
      const limitNum = limit ? parseInt(limit) : 10;
      specialties = await getPopularSpecialties(limitNum);
    } else {
      specialties = await getAllSpecialties();
    }

    return NextResponse.json({ success: true, data: specialties });
  } catch (error) {
    console.error("Error getting specialties:", error);
    return NextResponse.json(
      { success: false, error: "Error getting specialties" },
      { status: 500 }
    );
  }
}

// POST /api/specialties - Crear especialidad
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validaciones básicas
    if (!body.name) {
      return NextResponse.json(
        { success: false, error: "Name is required" },
        { status: 400 }
      );
    }

    // Verificar si la especialidad ya existe
    const exists = await specialtyExists(body.name);
    if (exists) {
      return NextResponse.json(
        { success: false, error: "Specialty already exists" },
        { status: 409 }
      );
    }

    const specialty = await createSpecialty(body);
    return NextResponse.json(
      { success: true, data: specialty },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating specialty:", error);
    return NextResponse.json(
      { success: false, error: "Error creating specialty" },
      { status: 500 }
    );
  }
}
