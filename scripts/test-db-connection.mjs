import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testConnection() {
  console.log('🔍 Test de connexion à la base de données...')
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Configurée' : 'NON CONFIGURÉE')
  
  if (process.env.DATABASE_URL) {
    // Masquer le mot de passe pour la sécurité
    const maskedUrl = process.env.DATABASE_URL.replace(/:([^:@]+)@/, ':***@')
    console.log('URL (masquée):', maskedUrl)
  }
  
  try {
    // Test de connexion
    console.log('\n📡 Tentative de connexion...')
    await prisma.$connect()
    console.log('✅ Connexion réussie!')
    
    // Test de requête simple
    console.log('\n🔍 Test de requête...')
    const count = await prisma.project.count()
    console.log(`✅ Nombre de projets: ${count}`)
    
    // Test de création (pour vérifier les permissions)
    console.log('\n🧪 Test de création...')
    const testProject = await prisma.project.create({
      data: {
        name: 'Test Connection Project',
        description: 'Projet de test de connexion',
        tools: 'Test',
        type: 'perso',
        platform: 'pc',
        status: 'idea'
      }
    })
    console.log(`✅ Projet de test créé: ${testProject.id}`)
    
    // Supprimer le projet de test
    await prisma.project.delete({
      where: { id: testProject.id }
    })
    console.log('✅ Projet de test supprimé')
    
    console.log('\n🎉 Tous les tests sont passés! La base de données fonctionne correctement.')
    
  } catch (error) {
    console.error('\n❌ Erreur de connexion:')
    console.error('Type:', error.constructor.name)
    console.error('Message:', error.message)
    
    if (error.code) {
      console.error('Code:', error.code)
    }
    
    // Suggestions basées sur le type d'erreur
    if (error.message.includes('ENOTFOUND')) {
      console.error('\n💡 Suggestion: Vérifiez l\'URL de la base de données')
    } else if (error.message.includes('authentication')) {
      console.error('\n💡 Suggestion: Vérifiez le nom d\'utilisateur et le mot de passe')
    } else if (error.message.includes('timeout')) {
      console.error('\n💡 Suggestion: Problème de réseau ou base de données surchargée')
    } else if (error.message.includes('database') && error.message.includes('does not exist')) {
      console.error('\n💡 Suggestion: La base de données spécifiée n\'existe pas')
    }
    
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()