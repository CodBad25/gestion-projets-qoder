import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
  try {
    // Récupérer tous les projets
    const projects = await prisma.project.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Créer un objet d'export avec métadonnées
    const exportData = {
      exportDate: new Date().toISOString(),
      version: '1.0',
      projectsCount: projects.length,
      projects: projects
    }

    return NextResponse.json(exportData, {
      headers: {
        'Content-Disposition': 'attachment; filename="projects-export.json"',
        'Content-Type': 'application/json'
      }
    })
  } catch (error) {
    console.error('Erreur lors de l\'export:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'export des projets' },
      { status: 500 }
    )
  }
}