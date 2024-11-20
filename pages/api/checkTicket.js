import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Assurez-vous d'avoir Prisma configuré dans lib/prisma.js

// Vérification du QR code
export async function GET(request) {
  const { qrCode, status } = new URL(request.url).searchParams; // Récupérer les paramètres de la query string

  if (!qrCode) {
    return NextResponse.json({ message: 'QR code is required' }, { status: 400 });
  }

  try {
    // Vérification de l'existence du ticket
    const ticket = await prisma.ticket.findUnique({
      where: { qrCode },
    });

    if (!ticket) {
      return NextResponse.json({ message: 'Ticket not found' }, { status: 404 });
    }

    // Si la query string demande des tickets avec un statut spécifique
    if (status) {
      const tickets = await prisma.ticket.findMany({
        where: {
          isChecked: status === 'checked' ? true : status === 'unchecked' ? false : undefined,
        },
      });
      return NextResponse.json(tickets);
    }

    // Sinon, retourner le statut du ticket
    return NextResponse.json({ isChecked: ticket.isChecked });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching ticket' }, { status: 500 });
  }
}

// Marquer le ticket comme vérifié
export async function POST(request) {
  const { qrCode } = await request.json();

  if (!qrCode) {
    return NextResponse.json({ message: 'QR code is required' }, { status: 400 });
  }

  try {
    // Vérification si le ticket existe
    const ticket = await prisma.ticket.findUnique({
      where: { qrCode },
    });

    if (!ticket) {
      return NextResponse.json({ message: 'Ticket not found' }, { status: 404 });
    }

    // Vérifier si le ticket a déjà été vérifié
    if (ticket.isChecked) {
      return NextResponse.json({ message: 'Ticket already checked' }, { status: 400 });
    }

    // Marquer le ticket comme vérifié
    const updatedTicket = await prisma.ticket.update({
      where: { qrCode },
      data: { isChecked: true },
    });

    return NextResponse.json({ message: 'Ticket marked as checked', ticket: updatedTicket });
  } catch (error) {
    return NextResponse.json({ message: 'Error updating ticket' }, { status: 500 });
  }
}
