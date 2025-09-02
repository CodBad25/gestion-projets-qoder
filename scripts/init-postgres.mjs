import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Initialisation de la base de données PostgreSQL...')
  
  try {
    // Vérifier la connexion
    await prisma.$connect()
    console.log('Connexion à PostgreSQL réussie')
    
    // Vérifier si des projets existent déjà
    const existingProjects = await prisma.project.count()
    
    if (existingProjects > 0) {
      console.log(`${existingProjects} projets trouvés, pas d'initialisation nécessaire.`)
      return
    }
    
    console.log('Création des projets de démonstration...')
    
    const projects = [
      {
        name: "Site Web Portfolio",
        description: "Mon portfolio personnel avec React et Next.js",
        tools: "React, Next.js, Tailwind CSS",
        type: "perso",
        platform: "pc",
        status: "completed",
        timeSpent: 3600,
        isFavorite: true
      },
      {
        name: "Application Mobile",
        description: "App mobile pour la gestion de tâches",
        tools: "React Native, Expo",
        type: "pro",
        platform: "pc",
        status: "in_progress",
        timeSpent: 7200,
        isFavorite: false
      },
      {
        name: "Bot Discord",
        description: "Bot pour automatiser les tâches sur Discord",
        tools: "Node.js, Discord.js",
        type: "perso",
        platform: "pc",
        status: "idea",
        timeSpent: 0,
        isFavorite: false
      },
      {
        name: "API REST E-commerce",
        description: "API backend pour une boutique en ligne",
        tools: "Node.js, Express, PostgreSQL",
        type: "pro",
        platform: "pc",
        status: "in_progress",
        timeSpent: 5400,
        isFavorite: true
      },
      {
        name: "Dashboard Analytics",
        description: "Interface d'analyse de données",
        tools: "React, D3.js, Chart.js",
        type: "pro",
        platform: "pc",
        status: "completed",
        timeSpent: 9600,
        isFavorite: false
      },
      {
        name: "Extension Chrome",
        description: "Extension pour améliorer la productivité",
        tools: "JavaScript, Chrome API",
        type: "perso",
        platform: "pc",
        status: "idea",
        timeSpent: 0,
        isFavorite: false
      }
    ]
    
    for (const project of projects) {
      await prisma.project.create({
        data: project
      })
    }
    
    console.log(`${projects.length} projets créés avec succès.`)
    
  } catch (error) {
    console.error('Erreur lors de l\'initialisation PostgreSQL:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error('Erreur lors de l\'initialisation:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })