import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Vérifier la structure des données - accepter les deux formats
    let projects: any[]
    
    if (body.projects && Array.isArray(body.projects)) {
      // Format avec métadonnées d'export
      projects = body.projects
    } else if (Array.isArray(body)) {
      // Format direct (tableau de projets)
      projects = body
    } else {
      return NextResponse.json(
        { error: 'Format de données invalide. Attendu: { projects: [...] } ou un tableau de projets' },
        { status: 400 }
      )
    }
    
    // Supprimer tous les projets existants (optionnel - décommentez si nécessaire)
    // await prisma.project.deleteMany()
    
    // Importer les nouveaux projets
    const importedProjects: any[] = []
    
    for (const projectData of projects) {
      try {
        // Validation des champs requis
        if (!projectData.name || typeof projectData.name !== 'string') {
          throw new Error(`Nom de projet manquant ou invalide: ${JSON.stringify(projectData)}`)
        }
        
        // Créer un nouvel objet avec les champs nécessaires
        const project = await db.project.create({
          data: {
            name: projectData.name,
            description: projectData.description || null,
            tools: projectData.tools || '',
            resultLink: projectData.resultLink || null,
            filesLink: projectData.filesLink || null,
            type: projectData.type || 'perso',
            platform: projectData.platform || 'pc',
            status: projectData.status || 'idea',
            timeSpent: Number(projectData.timeSpent) || 0,
            isFavorite: Boolean(projectData.isFavorite),
            lastStarted: projectData.lastStarted ? new Date(projectData.lastStarted) : null
          }
        })
        
        importedProjects.push(project)
      } catch (projectError) {
        console.error(`Erreur lors de l'import du projet:`, projectError)
        // Continuer avec les autres projets même si un échoue
      }
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