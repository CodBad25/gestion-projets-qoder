import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Vérifier la structure des données
    if (!body.projects || !Array.isArray(body.projects)) {
      return NextResponse.json(
        { error: 'Format de données invalide. Attendu: { projects: [...] }' },
        { status: 400 }
      )
    }

    const { projects } = body
    
    // Supprimer tous les projets existants (optionnel - décommentez si nécessaire)
    // await prisma.project.deleteMany()
    
    // Importer les nouveaux projets
    const importedProjects: any[] = []
    
    for (const projectData of projects) {
      // Créer un nouvel objet avec les champs nécessaires
      const project = await prisma.project.create({
        data: {
          name: projectData.name,
          description: projectData.description || null,
          tools: projectData.tools,
          resultLink: projectData.resultLink || null,
          filesLink: projectData.filesLink || null,
          type: projectData.type,
          platform: projectData.platform,
          status: projectData.status,
          timeSpent: Number(projectData.timeSpent) || 0,
          isFavorite: Boolean(projectData.isFavorite),
          lastStarted: projectData.lastStarted ? new Date(projectData.lastStarted) : null
        }
      })
      
      importedProjects.push(project)
    }

    return NextResponse.json({
      success: true,
      message: `${importedProjects.length} projets importés avec succès`,
      importedCount: importedProjects.length,
      projects: importedProjects
    })
    
  } catch (error) {
    console.error('Erreur lors de l\'import:', error)
    return NextResponse.json(
      { 
        error: 'Erreur lors de l\'import des projets',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    )
  }
}