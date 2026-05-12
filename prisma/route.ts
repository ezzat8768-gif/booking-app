import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(bookings);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { ref, name, phone, email, date, time, service, notes } = body;

  const booking = await prisma.booking.create({
    data: { ref, name, phone, email, date, time, service, notes },
  });

  return NextResponse.json(booking);
}