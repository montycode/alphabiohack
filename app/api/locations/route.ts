import { NextRequest, NextResponse } from "next/server";
import {
  createLocation,
  findNearbyLocations,
  getAllLocations,
  searchLocationsByAddress,
  searchLocationsByTitle,
} from "@/services";
import { errorResponse, successResponse } from "@/services/api-errors.service";

// GET /api/locations - Obtener todas las ubicaciones
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title");
    const address = searchParams.get("address");
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");
    const radius = searchParams.get("radius");

    let locations;

    if (title) {
      locations = await searchLocationsByTitle(title);
    } else if (address) {
      locations = await searchLocationsByAddress(address);
    } else if (lat && lon) {
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lon);
      const radiusKm = radius ? parseFloat(radius) : 10;

      if (isNaN(latitude) || isNaN(longitude)) {
        const { body, status } = errorResponse(
          "validation.invalidCoordinates",
          null,
          400
        );
        return NextResponse.json(body, { status });
      }

      locations = await findNearbyLocations(latitude, longitude, radiusKm);
    } else {
      locations = await getAllLocations();
    }

    return NextResponse.json(successResponse(locations));
  } catch (error) {
    console.error("Error getting locations:", error);
    const { body, status } = errorResponse("internal_error", null, 500);
    return NextResponse.json(body, { status });
  }
}

// POST /api/locations - Crear ubicación
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validaciones básicas
    if (!body.address || !body.title) {
      const { body: err, status } = errorResponse(
        "validation.required",
        null,
        400
      );
      return NextResponse.json(err, { status });
    }

    const location = await createLocation(body);
    return NextResponse.json(
      successResponse(location, "locations.create.success"),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating location:", error);
    const { body, status } = errorResponse("internal_error", null, 500);
    return NextResponse.json(body, { status });
  }
}
