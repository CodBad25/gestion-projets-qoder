import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Debug API - Début du diagnostic')
    
    // Vérifier les variables d'environnement
    const databaseUrl = process.env.DATABASE_URL
    const nodeEnv = process.env.NODE_ENV
    const vercelEnv = process.env.VERCEL_ENV
    
    console.log('📊 Variables d\'environnement:')
    console.log('- NODE_ENV:', nodeEnv)
    console.log('- VERCEL_ENV:', vercelEnv)
    console.log('- DATABASE_URL configurée:', !!databaseUrl)
    
    if (databaseUrl) {
      // Masquer le mot de passe pour la sécurité
      const maskedUrl = databaseUrl.replace(/:([^:@]+)@/, ':***@')
      console.log('- DATABASE_URL (masquée):', maskedUrl)
    }
    
    // Test de connexion
    console.log('\n📡 Test de connexion à la base...')
    await db.$connect()
    console.log('✅ Connexion réussie')
    
    // Compter les projets
    console.log('\n🔍 Test de requête...')
    const projectCount = await db.project.count()
    console.log(`✅ Nombre de projets: ${projectCount}`)
    
    // Lister quelques projets
    const projects = await db.project.findMany({
      take: 5,
      select: {
        id: true,
        name: true,
        status: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    console.log('\n📋 Derniers projets:')
    projects.forEach((p, i) => {
      console.log(`${i + 1}. ${p.name} (${p.status}) - ${p.createdAt.toISOString()}`)
    })
    
    // Test de création
    console.log('\n🧪 Test de création...')
    const testProject = await db.project.create({
      data: {
        name: `Test Debug ${new Date().toISOString()}`,
        description: 'Projet de test pour diagnostic',
        tools: 'Debug API',
        type: 'perso',
        platform: 'pc',
        status: 'idea'
      }
    })
    console.log(`✅ Projet de test créé: ${testProject.id}`)
    
    // Supprimer le projet de test
    await db.project.delete({
      where: { id: testProject.id }
    })
    console.log('✅ Projet de test supprimé')
    
    return NextResponse.json({
      success: true,
      environment: {
        nodeEnv,
        vercelEnv,
        hasDatabaseUrl: !!databaseUrl,
        databaseType: databaseUrl?.startsWith('postgresql') ? 'PostgreSQL' : 
                     databaseUrl?.startsWith('file:') ? 'SQLite' : 'Unknown'
      },
      database: {
        connected: true,
        projectCount,
        recentProjects: projects
      },
      tests: {
        connection: 'OK',
        query: 'OK',
        create: 'OK',
        delete: 'OK'
      },
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('❌ Erreur de diagnostic:', error)
    
    const errorInfo = error instanceof Error ? {
      type: error.constructor.name,
      message: error.message,
      code: (error as any).code || 'UNKNOWN'
    } : {
      type: 'Unknown',
      message: String(error),
      code: 'UNKNOWN'
    }
    
    return NextResponse.json({
      success: false,
      error: errorInfo,
      environment: {
        nodeEnv: process.env.NODE_ENV,
        vercelEnv: process.env.VERCEL_ENV,
        hasDatabaseUrl: !!process.env.DATABASE_URL
      },
      timestamp: new Date().toISOString()
    }, { status: 500 })
  } finally {
    await db.$disconnect()
  }
}