import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    console.log('API: Récupération de tous les projets')
    
    const projects = await db.project.findMany({
      orderBy: [
        { isFavorite: 'desc' },
        { updatedAt: 'desc' }
      ]
    })

    console.log(`API: ${projects.length} projets trouvés`)
    
    return NextResponse.json({
      success: true,
      data: projects
    })
  } catch (error) {
    console.error('API: Erreur lors de la récupération des projets:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de la récupération des projets'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('API: Création d\'un nouveau projet')
    
    const body = await request.json()
    const { name, description, tools, resultLink, filesLink, type, status, keywords } = body

    // Validation des données requises
    if (!name || name.trim() === '') {
      console.log('API: Erreur - Nom du projet manquant')
      return NextResponse.json(
        {
          success: false,
          error: 'Le nom du projet est requis'
        },
        { status: 400 }
      )
    }

    // Validation du statut
    const validStatuses = ['idea', 'in_progress', 'completed', 'abandoned']
    if (status && !validStatuses.includes(status)) {
      console.log('API: Erreur - Statut invalide:', status)
      return NextResponse.json(
        {
          success: false,
          error: 'Statut invalide. Valeurs autorisées: idea, in_progress, completed, abandoned'
        },
        { status: 400 }
      )
    }

    // Validation du type
    const validTypes = ['perso', 'pro', 'perso_pro']
    if (type && !validTypes.includes(type)) {
      console.log('API: Erreur - Type invalide:', type)
      return NextResponse.json(
        {
          success: false,
          error: 'Type invalide. Valeurs autorisées: perso, pro, perso_pro'
        },
        { status: 400 }
      )
    }

    const projectData = {
      name: name.trim(),
      description: description?.trim() || null,
      tools: tools?.trim() || '',
      resultLink: resultLink?.trim() || null,
      filesLink: filesLink?.trim() || null,
      type: type || 'perso',
      keywords: keywords?.trim() || null,
      status: status || 'idea',
      isFavorite: false,
      timeSpent: 0,
      isRunning: false,
      lastStarted: null
    }

    console.log('API: Données du projet à créer:', projectData)

    const newProject = await db.project.create({
      data: projectData
    })

    console.log('API: Projet créé avec succès, ID:', newProject.id)

    return NextResponse.json({
      success: true,
      data: newProject
    }, { status: 201 })

  } catch (error) {
    console.error('API: Erreur lors de la création du projet:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de la création du projet'
      },
      { status: 500 }
    )
  }
}