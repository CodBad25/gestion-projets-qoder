import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function testImport() {
  console.log('🧪 Test d\'import du fichier JSON...')
  
  try {
    // Lire le fichier JSON
    const jsonPath = path.join(process.cwd(), 'projects_export.json')
    console.log('📁 Lecture du fichier:', jsonPath)
    
    if (!fs.existsSync(jsonPath)) {
      console.error('❌ Fichier JSON non trouvé:', jsonPath)
      return
    }
    
    const jsonContent = fs.readFileSync(jsonPath, 'utf8')
    console.log('📄 Taille du fichier:', jsonContent.length, 'caractères')
    
    // Parser le JSON
    let data
    try {
      data = JSON.parse(jsonContent)
      console.log('✅ JSON parsé avec succès')
      console.log('📊 Structure:', {
        exportDate: data.exportDate,
        version: data.version,
        projectsCount: data.projectsCount,
        actualProjectsLength: data.projects?.length
      })
    } catch (parseError) {
      console.error('❌ Erreur de parsing JSON:', parseError.message)
      return
    }
    
    // Vérifier la structure
    if (!data.projects || !Array.isArray(data.projects)) {
      console.error('❌ Structure invalide: pas de tableau "projects"')
      return
    }
    
    console.log(`\n🔍 Analyse des ${data.projects.length} projets:`)
    
    // Compter les projets avant import
    const countBefore = await prisma.project.count()
    console.log(`📊 Projets en base avant import: ${countBefore}`)
    
    // Simuler l'import
    const importedProjects = []
    
    for (let i = 0; i < data.projects.length; i++) {
      const projectData = data.projects[i]
      console.log(`\n📝 Projet ${i + 1}:`, {
        name: projectData.name,
        type: projectData.type,
        status: projectData.status,
        hasDescription: !!projectData.description,
        hasTools: !!projectData.tools
      })
      
      try {
        // Validation des champs requis
        if (!projectData.name || typeof projectData.name !== 'string') {
          throw new Error(`Nom de projet manquant ou invalide`)
        }
        
        // Créer le projet
        const project = await prisma.project.create({
          data: {
            name: projectData.name,
            description: projectData.description || null,
            tools: projectData.tools || '',
            type: projectData.type || 'perso',
            platform: projectData.platform || 'pc',
            status: projectData.status || 'idea'
          }
        })
        
        importedProjects.push(project)
        console.log(`  ✅ Créé avec ID: ${project.id}`)
        
      } catch (projectError) {
        console.error(`  ❌ Erreur:`, projectError.message)
      }
    }
    
    // Compter les projets après import
    const countAfter = await prisma.project.count()
    console.log(`\n📊 Résultats:`)
    console.log(`  - Projets avant: ${countBefore}`)
    console.log(`  - Projets après: ${countAfter}`)
    console.log(`  - Projets importés: ${importedProjects.length}`)
    console.log(`  - Différence: +${countAfter - countBefore}`)
    
    if (importedProjects.length > 0) {
      console.log('\n🎉 Import réussi!')
      
      // Lister tous les projets
      const allProjects = await prisma.project.findMany({
        select: { id: true, name: true, status: true }
      })
      console.log('\n📋 Tous les projets en base:')
      allProjects.forEach((p, i) => {
        console.log(`  ${i + 1}. ${p.name} (${p.status}) - ID: ${p.id}`)
      })
    } else {
      console.log('\n⚠️  Aucun projet importé')
    }
    
  } catch (error) {
    console.error('\n❌ Erreur générale:', error.message)
    console.error('Stack:', error.stack)
  } finally {
    await prisma.$disconnect()
  }
}

testImport()