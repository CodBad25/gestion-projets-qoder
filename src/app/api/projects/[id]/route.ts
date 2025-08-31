import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    console.log('API: Mise à jour du projet ID:', id)
    
    const body = await request.json()
    const { name, description, tools, resultLink, filesLink, type, status, isFavorite, keywords, isRunning, timeSpent, lastStarted } = body

    // Vérifier si le projet existe
    const existingProject = await db.project.findUnique({
      where: { id }
    })

    if (!existingProject) {
      console.log('API: Projet non trouvé, ID:', id)
      return NextResponse.json(
        {
          success: false,
          error: 'Projet non trouvé'
        },
        { status: 404 }
      )
    }

    // Validation des données
    if (name !== undefined && (!name || name.trim() === '')) {
      console.log('API: Erreur - Nom du projet vide')
      return NextResponse.json(
        {
          success: false,
          error: 'Le nom du projet ne peut pas être vide'
        },
        { status: 400 }
      )
    }

    // Validation du statut si fourni
    if (status) {
      const validStatuses = ['idea', 'in_progress', 'completed', 'abandoned']
      if (!validStatuses.includes(status)) {
        console.log('API: Erreur - Statut invalide:', status)
        return NextResponse.json(
          {
            success: false,
            error: 'Statut invalide. Valeurs autorisées: idea, in_progress, completed, abandoned'
          },
          { status: 400 }
        )
      }
    }

    // Validation du type si fourni
    if (type) {
      const validTypes = ['perso', 'pro', 'perso_pro']
      if (!validTypes.includes(type)) {
        console.log('API: Erreur - Type invalide:', type)
        return NextResponse.json(
          {
            success: false,
            error: 'Type invalide. Valeurs autorisées: perso, pro, perso_pro'
          },
          { status: 400 }
        )
      }
    }

    const updateData: any = {}
    
    if (name !== undefined) updateData.name = name.trim()
    if (description !== undefined) updateData.description = description?.trim() || null
    if (tools !== undefined) updateData.tools = tools?.trim() || ''
    if (resultLink !== undefined) updateData.resultLink = resultLink?.trim() || null
    if (filesLink !== undefined) updateData.filesLink = filesLink?.trim() || null
    if (type !== undefined) updateData.type = type
    if (keywords !== undefined) updateData.keywords = keywords?.trim() || null
    if (status !== undefined) updateData.status = status
    if (isFavorite !== undefined) updateData.isFavorite = isFavorite
    if (isRunning !== undefined) updateData.isRunning = isRunning
    if (timeSpent !== undefined) updateData.timeSpent = timeSpent
    if (lastStarted !== undefined) updateData.lastStarted = lastStarted ? new Date(lastStarted) : null

    console.log('API: Données de mise à jour:', updateData)

    const updatedProject = await db.project.update({
      where: { id },
      data: updateData
    })

    console.log('API: Projet mis à jour avec succès, ID:', id)

    return NextResponse.json({
      success: true,
      data: updatedProject
    })

  } catch (error) {
    console.error('API: Erreur lors de la mise à jour du projet:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de la mise à jour du projet'
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    console.log('API: Suppression du projet ID:', id)
    
    // Vérifier si le projet existe
    const existingProject = await db.project.findUnique({
      where: { id }
    })

    if (!existingProject) {
      console.log('API: Projet non trouvé pour suppression, ID:', id)
      return NextResponse.json(
        {
          success: false,
          error: 'Projet non trouvé'
        },
        { status: 404 }
      )
    }

    await db.project.delete({
      where: { id }
    })

    console.log('API: Projet supprimé avec succès, ID:', id)

    return NextResponse.json({
      success: true,
      message: 'Projet supprimé avec succès'
    })

  } catch (error) {
    console.error('API: Erreur lors de la suppression du projet:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de la suppression du projet'
      },
      { status: 500 }
    )
  }
}