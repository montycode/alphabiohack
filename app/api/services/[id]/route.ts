import { NextRequest, NextResponse } from "next/server";
import {
  deleteService,
  getServiceById,
  getServiceStatsBySpecialty,
  updateService,
} from "@/services";

interface ServiceResponseData {
  service: unknown;
  stats?: unknown;
}

// GET /api/services/[id] - Obtener servicio por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const includeStats = searchParams.get("includeStats");

    const service = await getServiceById(id);

    if (!service) {
      return NextResponse.json(
        { success: false, error: "Service not found" },
        { status: 404 }
      );
    }

    let responseData: ServiceResponseData = { service };

    // Si se solicitan las estadísticas
    if (includeStats === "true") {
      const stats = await getServiceStatsBySpecialty(service.specialtyId);
      responseData = {
        ...responseData,
        stats,
      };
    }

    return NextResponse.json({ success: true, data: responseData });
  } catch (error) {
    console.error("Error getting service:", error);
    return NextResponse.json(
      { success: false, error: "Error getting service" },
      { status: 500 }
    );
  }
}

// PUT /api/services/[id] - Actualizar servicio
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Verificar que el servicio existe
    const existingService = await getServiceById(id);
    if (!existingService) {
      return NextResponse.json(
        { success: false, error: "Service not found" },
        { status: 404 }
      );
    }

    const updatedService = await updateService(id, body);
    return NextResponse.json({ success: true, data: updatedService });
  } catch (error) {
    console.error("Error updating service:", error);
    return NextResponse.json(
      { success: false, error: "Error updating service" },
      { status: 500 }
    );
  }
}

// DELETE /api/services/[id] - Eliminar servicio
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Verificar que el servicio existe
    const existingService = await getServiceById(id);
    if (!existingService) {
      return NextResponse.json(
        { success: false, error: "Service not found" },
        { status: 404 }
      );
    }

    await deleteService(id);
    return NextResponse.json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting service:", error);
    return NextResponse.json(
      { success: false, error: "Error deleting service" },
      { status: 500 }
    );
  }
}
