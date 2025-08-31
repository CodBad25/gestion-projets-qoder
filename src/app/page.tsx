"use client"

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Search, Star, Plus, Edit, Trash2, ExternalLink, FolderOpen, ChevronDown, Moon, Sun, Play, Pause, Clock, RotateCcw, Timer, TrendingUp, BarChart3, Calendar } from 'lucide-react'
import { Project } from '@prisma/client'

interface ProjectCardProps {
  project: Project
  onEdit: (project: Project) => void
  onDelete: (id: string) => void
  onToggleFavorite: (id: string) => void
  onStatusChange: (id: string, newStatus: string) => void
  onToggleTimer: (id: string) => void
  onTimeEdit: (project: Project) => void
  onResetStats: (project: Project) => void
  onResetTimer: (project: Project) => void
}

interface Suggestion {
  type: 'tool' | 'status' | 'type'
  value: string
  count: number
  label: string
}

function ProjectCard({ project, onEdit, onDelete, onToggleFavorite, onStatusChange, onToggleTimer, onTimeEdit, onResetStats, onResetTimer }: ProjectCardProps) {
  const [currentTime, setCurrentTime] = useState(0)
  const [isTimerActive, setIsTimerActive] = useState(false)
  const [timerKey, setTimerKey] = useState(0) // Pour forcer la recréation du timer

  // Effet pour gérer le timer en temps réel avec haute fréquence
  useEffect(() => {
    let animationFrameId: number | null = null

    const updateTimer = () => {
      if (project.isRunning && project.lastStarted) {
        setIsTimerActive(true)
        
        // Calculer le temps écoulé depuis le démarrage
        const now = Date.now()
        const startTime = new Date(project.lastStarted!).getTime()
        const elapsedSeconds = Math.floor((now - startTime) / 1000)
        setCurrentTime((project.timeSpent || 0) + elapsedSeconds)
        
        // Planifier la prochaine mise à jour
        animationFrameId = requestAnimationFrame(updateTimer)
      } else {
        setIsTimerActive(false)
        setCurrentTime(project.timeSpent || 0)
      }
    }

    // Démarrer la mise à jour immédiatement
    updateTimer()

    // Nettoyage de l'animation frame
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [project.isRunning, project.lastStarted, project.timeSpent, timerKey])

  // Forcer la recréation du timer quand on clique sur le bouton
  const handleTimerClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onToggleTimer(project.id)
    // Forcer une mise à jour immédiate
    setTimerKey(prev => prev + 1)
  }
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500'
      case 'in_progress': return 'bg-blue-500'
      case 'idea': return 'bg-yellow-500'
      case 'abandoned': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Terminé'
      case 'in_progress': return 'En cours'
      case 'idea': return 'Idée'
      case 'abandoned': return 'Abandonné'
      default: return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'idea': return '💡'
      case 'in_progress': return '⚡'
      case 'completed': return '✅'
      case 'abandoned': return '❌'
      default: return '📋'
    }
  }

  const getNextStatus = (currentStatus: string) => {
    const statusCycle = ['idea', 'in_progress', 'completed', 'abandoned']
    const currentIndex = statusCycle.indexOf(currentStatus)
    const nextIndex = (currentIndex + 1) % statusCycle.length
    return statusCycle[nextIndex]
  }

  const handleStatusClick = () => {
    const nextStatus = getNextStatus(project.status)
    onStatusChange(project.id, nextStatus)
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}h ${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    } else if (minutes > 0) {
      return `${minutes}:${secs.toString().padStart(2, '0')}`
    } else {
      return `${secs}s`
    }
  }

  return (
    <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:-translate-y-1 rounded-2xl overflow-hidden group relative backdrop-blur-sm cursor-pointer flex flex-col">
      {/* Type and Platform Badges + Favorite */}
      <div className="absolute top-2 left-2 z-10 flex gap-1">
        <div className="w-7 h-7 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg flex items-center justify-center border border-gray-200 dark:border-gray-600">
          <div className="text-xs">
            {project.type === 'perso' ? '🏠' : project.type === 'pro' ? '💼' : '🏠💼'}
          </div>
        </div>
        <div className="w-7 h-7 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg flex items-center justify-center border border-gray-200 dark:border-gray-600">
          <div className="text-xs">
            {(project.platform || 'pc') === 'pc' ? '🖥️' : '🍎'}
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            onToggleFavorite(project.id)
          }}
          className="w-8 h-8 p-1 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 cursor-pointer"
          title={project.isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          <Star 
            className={`h-4 w-4 transition-all duration-200 ${
              project.isFavorite 
                ? 'fill-yellow-400 text-yellow-400 scale-110' 
                : 'text-gray-400 dark:text-gray-500 hover:text-yellow-400'
            }`}
          />
        </Button>
      </div>
      
      {/* Status Badge */}
      <div className="absolute top-2 right-2 z-10 flex gap-1">
        <div className="w-7 h-7 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg flex items-center justify-center border border-gray-200 dark:border-gray-600">
          <div className="text-xs">
            {project.status === 'idea' ? '💡' : 
             project.status === 'in_progress' ? '⚡' : 
             project.status === 'completed' ? '✅' : 
             project.status === 'abandoned' ? '❌' : '📋'}
          </div>
        </div>
      </div>
      
      <CardContent 
        className="p-3 flex flex-col h-full"
        onClick={(e) => {
          // Ne pas ouvrir la modale si on clique sur les boutons d'action
          if (!(e.target as HTMLElement).closest('button')) {
            onEdit(project)
          }
        }}
      >
        {/* Header compact */}
        <div className="mb-2 flex-grow">
          <div className="mb-1">
            <h3 className="text-sm font-bold line-clamp-2 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight h-[2.5rem] flex items-center justify-center text-center">
              {project.name}
            </h3>
          </div>
          
          {/* Keywords compact */}
          {project.keywords && (
            <div className="mb-1">
              <div className="flex flex-wrap gap-1">
                {project.keywords.split(',').slice(0, 2).map((keyword, index) => (
                  <span key={index} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded-full">
                    {keyword.trim()}
                  </span>
                ))}
                {project.keywords.split(',').length > 2 && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    +{project.keywords.split(',').length - 2}
                  </span>
                )}
              </div>
            </div>
          )}
          
          {/* Tools compact - optimisé pour 2 lignes max */}
          {project.tools && (
            <div className="mb-2">
              <div className="flex flex-wrap gap-1 max-h-[3.5rem] overflow-hidden">
                {project.tools.split(',').map((tool, index) => (
                  <Badge key={index} variant="secondary" className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 px-1.5 py-0.5 rounded-full leading-tight">
                    {tool.trim()}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Actions compactes - Toujours en bas */}
        <div className="flex-shrink-0 mt-auto">
          {/* Timer Row */}
          <div className="flex items-center justify-between mb-1">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleTimerClick}
              className={`h-6 px-2 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1 flex-1 justify-center ${
                isTimerActive 
                  ? 'bg-green-500 hover:bg-green-600 text-white animate-pulse' 
                  : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300'
              } shadow-lg hover:scale-105 cursor-pointer`}
              title={isTimerActive ? "Arrêter le timer" : "Démarrer le timer"}
            >
              {isTimerActive ? <Pause className="h-2.5 w-2.5" /> : <Play className="h-2.5 w-2.5" />}
              <span 
                className="font-mono font-bold cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-xs"
                onDoubleClick={(e) => {
                  e.stopPropagation()
                  onTimeEdit(project)
                }}
                title="Double-cliquez pour modifier le temps"
              >
                {formatTime(currentTime)}
              </span>
            </Button>
            
            {/* Status Button */}
            <Button 
              variant="ghost" 
              size="sm"
              onDoubleClick={(e) => {
                e.stopPropagation()
                handleStatusClick()
              }}
              className={`h-6 px-2 rounded-full text-xs font-medium transition-all duration-200 ${getStatusColor(project.status)} text-white hover:opacity-90 shadow-lg hover:scale-105 cursor-pointer ml-1`}
              title="Double-cliquez pour changer le statut"
            >
              {getStatusLabel(project.status)}
            </Button>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-1 justify-center" onClick={(e) => e.stopPropagation()}>
            {project.resultLink && (
              <Button variant="ghost" size="sm" asChild className="w-5 h-5 p-0 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-110 transition-all duration-200">
                <a href={project.resultLink} target="_blank" rel="noopener noreferrer" className="text-xs">
                  <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </Button>
            )}
            {project.filesLink && (
              <Button variant="ghost" size="sm" asChild className="w-5 h-5 p-0 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-110 transition-all duration-200">
                <a href={project.filesLink} target="_blank" rel="noopener noreferrer" className="text-xs">
                  <FolderOpen className="h-2.5 w-2.5" />
                </a>
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation()
                onResetTimer(project)
              }}
              className="w-5 h-5 p-0 rounded-full text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-orange-900/20 hover:scale-110 transition-all duration-200"
              title="Arrêter le timer"
              disabled={!project.isRunning}
            >
              <Timer className="h-2.5 w-2.5" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation()
                onResetStats(project)
              }}
              className="w-5 h-5 p-0 rounded-full text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-900/20 hover:scale-110 transition-all duration-200"
              title="Reset des statistiques"
            >
              <RotateCcw className="h-2.5 w-2.5" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onDelete(project.id)}
              className="w-5 h-5 p-0 rounded-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 hover:scale-110 transition-all duration-200"
              title="Supprimer le projet"
            >
              <Trash2 className="h-2.5 w-2.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTools, setSelectedTools] = useState<string[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [keywordFilter, setKeywordFilter] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    tools: [] as string[],
    resultLink: '',
    filesLink: '',
    type: 'perso' as 'perso' | 'pro' | 'perso_pro',
    platform: 'pc' as 'pc' | 'mac',
    keywords: ''
  })
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [customTool, setCustomTool] = useState('')
  const [editCustomTool, setEditCustomTool] = useState('')
  const [editingTimeProject, setEditingTimeProject] = useState<Project | null>(null)
  const [newTimeSpent, setNewTimeSpent] = useState('')
  const [timeInputMode, setTimeInputMode] = useState<'simple' | 'advanced'>('simple')
  const [simpleMinutes, setSimpleMinutes] = useState('')
  const [advancedHours, setAdvancedHours] = useState('')
  const [advancedMinutes, setAdvancedMinutes] = useState('')
  const [isTimeEditModalOpen, setIsTimeEditModalOpen] = useState(false)
  const [projectToReset, setProjectToReset] = useState<Project | null>(null)
  const [isResetModalOpen, setIsResetModalOpen] = useState(false)
  const [isStatsEditModalOpen, setIsStatsEditModalOpen] = useState(false)
  const [editingStats, setEditingStats] = useState({
    totalTimeSpent: '',
    timeToday: '',
    timeThisWeek: '',
    timeThisMonth: ''
  })

  // Outils prédéfinis
  const predefinedTools = [
    'Genspark', 'Cursor', 'Trae', 'Claude', 'Lovable', 
    'VS+Augment', 'VS+Sixth'
  ]

  // Formater le temps pour l'affichage
  const formatTimeForStats = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    } else if (minutes > 0) {
      return `${minutes}m`
    } else {
      return `${seconds}s`
    }
  }

  const getTimeStats = () => {
    let declarableTime = 0 // Temps déclarable : somme de toutes les sessions des projets pro
    
    // RÈGLE EXACTE : Temps déclarable = somme de TOUTES les sessions des projets professionnels
    projects.forEach(project => {
      const timeSpent = project.timeSpent || 0
      
      // Temps déclarable : TOUS les projets marqués comme "pro" ou "perso_pro"
      if (project.type === 'pro' || project.type === 'perso_pro') {
        declarableTime += timeSpent
      }
    })

    // Pour le temps réel global, on utilise une approximation pour l'instant
    // Dans une version future, on implémentera la fusion d'intervalles avec l'historique complet
    const realGlobalTime = calculateRealGlobalTime()

    // Calcul des statistiques journalières/hebdomadaires/mensuelles
    const projectAge = projects.length > 0 ? 
      Math.max(1, Math.floor((Date.now() - Math.min(...projects.map(p => new Date(p.createdAt).getTime()))) / (1000 * 60 * 60 * 24))) : 1

    return {
      totalTimeSpent: realGlobalTime,
      declarableTime, // Somme de TOUTES les sessions pro (avec double-comptage)
      realGlobalTime, // Temps fusionné sans double-comptage
      timeToday: Math.floor(realGlobalTime / Math.max(1, projectAge)),
      timeThisWeek: Math.min(realGlobalTime, Math.floor(realGlobalTime / Math.max(1, projectAge) * 7)),
      timeThisMonth: Math.min(realGlobalTime, Math.floor(realGlobalTime / Math.max(1, projectAge) * 30))
    }
  }

  // Fonction pour calculer le temps réel global avec fusion d'intervalles
  const calculateRealGlobalTime = () => {
    const now = Date.now()
    const intervals: Array<{ start: number; end: number }> = []

    // Pour l'instant, on utilise une approximation basée sur les projets
    // Dans une version idéale, on aurait l'historique complet des sessions
    projects.forEach(project => {
      if (project.timeSpent && project.timeSpent > 0) {
        // Estimation : on considère que le temps a été passé sur la période de vie du projet
        const created = new Date(project.createdAt).getTime()
        const age = Math.min(now - created, project.timeSpent * 1000)
        
        // On crée des intervalles simulés basés sur le temps passé
        // C'est une approximation en attendant l'historique réel
        if (age > 0) {
          intervals.push({
            start: now - age,
            end: now
          })
        }
      }
    })

    // Ajouter les projets en cours
    projects.forEach(project => {
      if (project.isRunning && project.lastStarted) {
        const startTime = new Date(project.lastStarted).getTime()
        intervals.push({
          start: startTime,
          end: now
        })
      }
    })

    // S'il n'y a pas d'intervalles, retourner 0
    if (intervals.length === 0) return 0

    // Étape 1: Trier les intervalles par heure de début
    intervals.sort((a, b) => a.start - b.start)

    // Étape 2: Fusionner les intervalles qui se chevauchent
    const merged: Array<{ start: number; end: number }> = []
    let current = intervals[0]

    for (let i = 1; i < intervals.length; i++) {
      const next = intervals[i]
      
      // Si les intervalles se chevauchent ou se touchent
      if (next.start <= current.end) {
        // Fusionner : étendre l'intervalle courant si nécessaire
        current.end = Math.max(current.end, next.end)
      } else {
        // Pas de chevauchement, ajouter l'intervalle courant et passer au suivant
        merged.push(current)
        current = next
      }
    }
    
    // Ajouter le dernier intervalle
    merged.push(current)

    // Étape 3: Additionner la durée des intervalles fusionnés
    let totalDuration = 0
    merged.forEach(interval => {
      totalDuration += (interval.end - interval.start) / 1000 // Convertir en secondes
    })

    return Math.floor(totalDuration)
  }

  const [timeStats, setTimeStats] = useState(() => getTimeStats())

  // Pour éviter les problèmes de SSR avec next-themes
  useEffect(() => {
    setMounted(true)
  }, [])

  const loadProjects = async () => {
    try {
      console.log('UI: Chargement des projets depuis l\'API')
      const response = await fetch('/api/projects')
      const result = await response.json()
      
      if (result.success) {
        console.log('UI: Projets chargés avec succès:', result.data.length)
        setProjects(result.data)
      } else {
        console.error('UI: Erreur lors du chargement des projets:', result.error)
      }
    } catch (error) {
      console.error('UI: Erreur réseau lors du chargement des projets:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Charger les projets depuis l'API
  useEffect(() => {
    loadProjects()
  }, [])

  // Mettre à jour les statistiques de temps quand les projets changent
  useEffect(() => {
    setTimeStats(getTimeStats())
  }, [projects])

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  // Extraire tous les outils uniques des projets
  const getAllTools = () => {
    const toolSet = new Set<string>()
    projects.forEach(project => {
      if (project.tools) {
        project.tools.split(',').forEach(tool => {
          toolSet.add(tool.trim())
        })
      }
    })
    return Array.from(toolSet).sort()
  }

  // Filtrer les projets par recherche et par outils
  const filteredProjects = projects.filter(project => {
    // Filtre de recherche (nom, description, outils)
    const matchesSearch = 
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.tools.toLowerCase().includes(searchTerm.toLowerCase())

    // Filtre par outils
    const matchesTools = selectedTools.length === 0 || 
      selectedTools.some(tool => 
        project.tools.toLowerCase().includes(tool.toLowerCase())
      )

    // Filtre par statut
    const matchesStatus = selectedStatuses.length === 0 || 
      selectedStatuses.includes(project.status)

    // Filtre par type (perso/pro)
    const matchesType = selectedTypes.length === 0 || 
      selectedTypes.includes(project.type)

    // Filtre par plateforme (pc/mac)
    const matchesPlatform = selectedPlatforms.length === 0 || 
      selectedPlatforms.includes(project.platform || 'pc')

    // Filtre par mots-clés
    const matchesKeywords = !keywordFilter.trim() || 
      (project.keywords && 
       project.keywords.toLowerCase().includes(keywordFilter.toLowerCase()))

    return matchesSearch && matchesTools && matchesStatus && matchesType && matchesPlatform && matchesKeywords
  })

  // Logique de filtre intelligent - suggestions basées sur les projets existants
  const getSmartSuggestions = (): Suggestion[] => {
    if (projects.length === 0) return []
    
    const suggestions: Suggestion[] = []
    
    // Suggérer les outils les plus utilisés
    const toolCounts = new Map<string, number>()
    projects.forEach(project => {
      if (project.tools) {
        project.tools.split(',').forEach(tool => {
          const cleanTool = tool.trim()
          toolCounts.set(cleanTool, (toolCounts.get(cleanTool) || 0) + 1)
        })
      }
    })
    
    const topTools: Suggestion[] = Array.from(toolCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([tool, count]) => ({ type: 'tool', value: tool, count, label: `🔧 ${tool}` }))
    
    suggestions.push(...topTools)
    
    // Suggérer les statuts les plus courants
    const statusCounts = {
      idea: projects.filter(p => p.status === 'idea').length,
      in_progress: projects.filter(p => p.status === 'in_progress').length,
      completed: projects.filter(p => p.status === 'completed').length,
      abandoned: projects.filter(p => p.status === 'abandoned').length
    }
    
    const topStatus: Suggestion[] = Object.entries(statusCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([status, count]) => ({
        type: 'status',
        value: status,
        count,
        label: status === 'idea' ? '💡 Idée' : status === 'in_progress' ? '⚡ En cours' : status === 'completed' ? '✅ Terminé' : '❌ Abandonné'
      }))
    
    suggestions.push(...topStatus)
    
    // Suggérer le type majoritaire
    const persoCount = projects.filter(p => p.type === 'perso').length
    const proCount = projects.filter(p => p.type === 'pro').length
    
    if (persoCount > proCount) {
      suggestions.push({ type: 'type', value: 'perso', count: persoCount, label: '🏠 Personnel' })
    } else if (proCount > 0) {
      suggestions.push({ type: 'type', value: 'pro', count: proCount, label: '💼 Professionnel' })
    }
    
    return suggestions.slice(0, 5) // Limiter à 5 suggestions maximum
  }

  const applySuggestion = (suggestion: Suggestion) => {
    switch (suggestion.type) {
      case 'tool':
        if (!selectedTools.includes(suggestion.value)) {
          setSelectedTools(prev => [...prev, suggestion.value])
        }
        break
      case 'status':
        if (!selectedStatuses.includes(suggestion.value)) {
          setSelectedStatuses(prev => [...prev, suggestion.value])
        }
        break
      case 'type':
        if (!selectedTypes.includes(suggestion.value)) {
          setSelectedTypes(prev => [...prev, suggestion.value])
        }
        break
    }
    setShowFilters(true) // Ouvrir le panneau pour montrer les filtres appliqués
  }
  const getToolCount = (tool: string) => {
    return projects.filter(project => 
      project.tools.toLowerCase().includes(tool.toLowerCase())
    ).length
  }

  const handleToolToggle = (tool: string) => {
    setSelectedTools(prev => 
      prev.includes(tool) 
        ? prev.filter(t => t !== tool)
        : [...prev, tool]
    )
  }

  const handleStatusToggle = (status: string) => {
    setSelectedStatuses(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status)
        : [...prev, status]
    )
  }

  const handleTypeToggle = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    )
  }

  const handlePlatformToggle = (platform: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    )
  }

  const clearAllFilters = () => {
    setSelectedTools([])
    setSelectedStatuses([])
    setSelectedTypes([])
    setSelectedPlatforms([])
    setKeywordFilter('')
    setSearchTerm('')
  }

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    // Convertir la chaîne d'outils en tableau
    const toolsArray = project.tools ? project.tools.split(', ').filter(tool => tool.trim()) : []
    setEditingProject({
      ...project,
      tools: toolsArray as any
    })
    setIsEditModalOpen(true)
  }

  const handleTimeEdit = (project: Project) => {
    setEditingTimeProject(project)
    setNewTimeSpent(formatTimeForInput(project.timeSpent || 0))
    
    // Initialiser les champs simples
    const totalMinutes = Math.floor((project.timeSpent || 0) / 60)
    setSimpleMinutes(totalMinutes.toString())
    
    // Initialiser les champs avancés
    const hours = Math.floor((project.timeSpent || 0) / 3600)
    const minutes = Math.floor(((project.timeSpent || 0) % 3600) / 60)
    setAdvancedHours(hours.toString())
    setAdvancedMinutes(minutes.toString())
    
    setIsTimeEditModalOpen(true)
  }

  const formatTimeForInput = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    } else if (minutes > 0) {
      return `${minutes}:${secs.toString().padStart(2, '0')}`
    } else {
      return `${secs}`
    }
  }

  const parseTimeInput = (timeStr: string): number => {
    const parts = timeStr.split(':').map(part => parseInt(part) || 0)
    
    if (parts.length === 3) {
      // Format HH:MM:SS
      return parts[0] * 3600 + parts[1] * 60 + parts[2]
    } else if (parts.length === 2) {
      // Format MM:SS
      return parts[0] * 60 + parts[1]
    } else {
      // Format SS seulement
      return parts[0] || 0
    }
  }

  const parseSimpleTimeInput = (): number => {
    if (timeInputMode === 'simple') {
      const minutes = parseInt(simpleMinutes) || 0
      return minutes * 60
    } else {
      const hours = parseInt(advancedHours) || 0
      const minutes = parseInt(advancedMinutes) || 0
      return hours * 3600 + minutes * 60
    }
  }



  const handleTimeSave = async () => {
    if (!editingTimeProject) return
    
    try {
      const timeInSeconds = parseSimpleTimeInput()
      
      const response = await fetch(`/api/projects/${editingTimeProject.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timeSpent: timeInSeconds
        }),
      })
      
      if (response.ok) {
        await loadProjects()
        setIsTimeEditModalOpen(false)
        setEditingTimeProject(null)
        setNewTimeSpent('')
        setSimpleMinutes('')
        setAdvancedHours('')
        setAdvancedMinutes('')
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du temps:', error)
    }
  }

  const handleResetStats = (project: Project) => {
    setProjectToReset(project)
    setIsResetModalOpen(true)
  }

  const handleStatsEdit = () => {
    const stats = getTimeStats()
    setEditingStats({
      totalTimeSpent: formatTimeForInput(stats.totalTimeSpent),
      timeToday: formatTimeForInput(stats.timeToday),
      timeThisWeek: formatTimeForInput(stats.timeThisWeek),
      timeThisMonth: formatTimeForInput(stats.timeThisMonth)
    })
    setIsStatsEditModalOpen(true)
  }

  const handleStatsSave = async () => {
    try {
      // Pour cette démo, on va ajuster proportionnellement tous les projets
      const currentStats = getTimeStats()
      const newTotalTime = parseTimeInput(editingStats.totalTimeSpent)
      
      if (newTotalTime < 0) {
        alert('Le temps ne peut pas être négatif')
        return
      }

      // Calculer le ratio de changement
      const ratio = currentStats.totalTimeSpent > 0 ? newTotalTime / currentStats.totalTimeSpent : 1
      
      // Mettre à jour tous les projets proportionnellement
      const updatedProjects = projects.map(project => ({
        ...project,
        timeSpent: Math.round((project.timeSpent || 0) * ratio)
      }))

      // Sauvegarder chaque projet
      for (const project of updatedProjects) {
        const response = await fetch(`/api/projects/${project.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ timeSpent: project.timeSpent })
        })
        
        if (!response.ok) {
          throw new Error(`Erreur lors de la mise à jour du projet ${project.name}`)
        }
      }

      // Recharger les projets
      await loadProjects()
      setIsStatsEditModalOpen(false)
      
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des statistiques:', error)
      alert('Erreur lors de la sauvegarde des statistiques')
    }
  }

  const handleResetTimer = async (project: Project) => {
    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isRunning: false,
          lastStarted: null
        }),
      })
      
      if (response.ok) {
        await loadProjects()
      }
    } catch (error) {
      console.error('Erreur lors de l\'arrêt du timer:', error)
    }
  }

  const handleResetAll = async () => {
    if (!projectToReset) return
    
    try {
      const response = await fetch(`/api/projects/${projectToReset.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timeSpent: 0,
          isRunning: false,
          lastStarted: null
        }),
      })
      
      if (response.ok) {
        await loadProjects()
        setIsResetModalOpen(false)
        setProjectToReset(null)
      }
    } catch (error) {
      console.error('Erreur lors du reset complet:', error)
    }
  }

  const handleEditInputChange = (field: string, value: string | string[]) => {
    console.log('handleEditInputChange:', field, value)
    if (editingProject) {
      setEditingProject({
        ...editingProject,
        [field]: value
      })
    }
  }

  const handleEditToolToggle = (tool: string) => {
    if (!editingProject) return
    const currentTools = Array.isArray(editingProject.tools) ? editingProject.tools : 
                         (editingProject.tools ? editingProject.tools.split(', ').filter(t => t.trim()) : [])
    
    if (currentTools.includes(tool)) {
      handleEditInputChange('tools', currentTools.filter(t => t !== tool))
    } else {
      handleEditInputChange('tools', [...currentTools, tool])
    }
  }

  const addEditCustomTool = () => {
    if (!editingProject || !editCustomTool.trim()) return
    const currentTools = Array.isArray(editingProject.tools) ? editingProject.tools : 
                         (editingProject.tools ? editingProject.tools.split(', ').filter(t => t.trim()) : [])
    
    if (!currentTools.includes(editCustomTool.trim())) {
      handleEditInputChange('tools', [...currentTools, editCustomTool.trim()])
      setEditCustomTool('')
    }
  }

  const updateProject = async () => {
    if (!editingProject || !editingProject.name.trim()) {
      alert('Le nom du projet est obligatoire')
      return
    }

    try {
      console.log('UI: Mise à jour du projet:', editingProject.name)
      const response = await fetch(`/api/projects/${editingProject.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: editingProject.name.trim(),
          description: editingProject.description?.trim() || '',
          tools: Array.isArray(editingProject.tools) ? editingProject.tools.join(', ') : editingProject.tools,
          resultLink: editingProject.resultLink?.trim() || null,
          filesLink: editingProject.filesLink?.trim() || null,
          type: editingProject.type || 'perso',
          platform: editingProject.platform || 'pc',
          keywords: editingProject.keywords?.trim() || null
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        console.log('UI: Projet mis à jour avec succès')
        // Mettre à jour le projet dans la liste locale
        setProjects(prev => prev.map(p => 
          p.id === editingProject.id ? result.data : p
        ))
        // Fermer le modal
        setIsEditModalOpen(false)
        setEditingProject(null)
        setEditCustomTool('')
      } else {
        console.error('UI: Erreur lors de la mise à jour:', result.error)
        alert('Erreur lors de la mise à jour: ' + result.error)
      }
    } catch (error) {
      console.error('UI: Erreur réseau lors de la mise à jour:', error)
      alert('Erreur réseau lors de la mise à jour')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      return
    }

    try {
      console.log('UI: Suppression du projet ID:', id)
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE'
      })
      
      const result = await response.json()
      
      if (result.success) {
        console.log('UI: Projet supprimé avec succès')
        // Retirer le projet de la liste locale
        setProjects(prev => prev.filter(project => project.id !== id))
      } else {
        console.error('UI: Erreur lors de la suppression:', result.error)
        alert('Erreur lors de la suppression: ' + result.error)
      }
    } catch (error) {
      console.error('UI: Erreur réseau lors de la suppression:', error)
      alert('Erreur réseau lors de la suppression')
    }
  }

  const handleToggleFavorite = async (id: string) => {
    try {
      const project = projects.find(p => p.id === id)
      if (!project) return

      console.log('UI: Mise à jour du favori pour le projet ID:', id)
      const response = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          isFavorite: !project.isFavorite
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        console.log('UI: Favori mis à jour avec succès')
        // Mettre à jour le projet dans la liste locale
        setProjects(prev => prev.map(p => 
          p.id === id ? { ...p, isFavorite: !p.isFavorite } : p
        ))
      } else {
        console.error('UI: Erreur lors de la mise à jour du favori:', result.error)
        // Fallback: mettre à jour localement quand même pour l'UX
        setProjects(prev => prev.map(p => 
          p.id === id ? { ...p, isFavorite: !p.isFavorite } : p
        ))
      }
    } catch (error) {
      console.error('UI: Erreur réseau lors de la mise à jour du favori:', error)
      // Fallback: mettre à jour localement pour l'UX
      setProjects(prev => prev.map(p => 
        p.id === id ? { ...p, isFavorite: !p.isFavorite } : p
      ))
    }
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      console.log('UI: Mise à jour du statut pour le projet ID:', id, 'Nouveau statut:', newStatus)
      const response = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: newStatus
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        console.log('UI: Statut mis à jour avec succès')
        // Mettre à jour le projet dans la liste locale
        setProjects(prev => prev.map(p => 
          p.id === id ? { ...p, status: newStatus } : p
        ))
      } else {
        console.error('UI: Erreur lors de la mise à jour du statut:', result.error)
        // Fallback: mettre à jour localement quand même pour l'UX
        setProjects(prev => prev.map(p => 
          p.id === id ? { ...p, status: newStatus } : p
        ))
      }
    } catch (error) {
      console.error('UI: Erreur réseau lors de la mise à jour du statut:', error)
      // Fallback: mettre à jour localement pour l'UX
      setProjects(prev => prev.map(p => 
        p.id === id ? { ...p, status: newStatus } : p
      ))
    }
  }

  const handleToggleTimer = async (id: string) => {
    try {
      const project = projects.find(p => p.id === id)
      if (!project) return

      const isRunning = !project.isRunning
      let newTimeSpent = project.timeSpent || 0
      let lastStarted: Date | null = null

      // Si on démarre un timer, arrêter tous les autres timers en cours
      if (isRunning) {
        console.log('UI: Démarrage du timer pour le projet ID:', id)
        
        // Trouver tous les projets avec des timers actifs
        const runningProjects = projects.filter(p => p.isRunning && p.id !== id)
        
        if (runningProjects.length > 0) {
          console.log('UI: Arrêt des autres timers en cours:', runningProjects.map(p => p.id))
          
          // Arrêter tous les autres timers et calculer leur temps
          for (const runningProject of runningProjects) {
            let updatedTimeSpent = runningProject.timeSpent || 0
            
            if (runningProject.lastStarted) {
              const now = new Date()
              const additionalTime = Math.floor((now.getTime() - new Date(runningProject.lastStarted).getTime()) / 1000)
              updatedTimeSpent += additionalTime
              console.log('UI: Arrêt du timer pour le projet ID:', runningProject.id, 'Temps ajouté:', additionalTime, 'secondes')
            }
            
            // Mettre à jour le projet arrêté dans la base de données
            try {
              await fetch(`/api/projects/${runningProject.id}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  isRunning: false,
                  timeSpent: updatedTimeSpent,
                  lastStarted: null
                })
              })
            } catch (error) {
              console.error('UI: Erreur lors de l\'arrêt du timer pour le projet:', runningProject.id, error)
            }
            
            // Mettre à jour localement
            setProjects(prev => prev.map(p => 
              p.id === runningProject.id ? { ...p, isRunning: false, timeSpent: updatedTimeSpent, lastStarted: null } : p
            ))
          }
        }
        
        // Démarrer le timer pour le projet sélectionné
        if (isRunning) {
          lastStarted = new Date()
        }
      } else {
        // Arrêter le timer et calculer le temps supplémentaire
        if (project.lastStarted) {
          const now = new Date()
          const additionalTime = Math.floor((now.getTime() - new Date(project.lastStarted).getTime()) / 1000)
          newTimeSpent += additionalTime
          console.log('UI: Arrêt du timer pour le projet ID:', id, 'Temps ajouté:', additionalTime, 'secondes')
        }
      }

      const response = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          isRunning,
          timeSpent: newTimeSpent,
          lastStarted: lastStarted instanceof Date ? lastStarted.toISOString() : null
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        console.log('UI: Timer mis à jour avec succès')
        // Mettre à jour le projet dans la liste locale
        setProjects(prev => prev.map(p => 
          p.id === id ? { ...p, isRunning, timeSpent: newTimeSpent, lastStarted } : p
        ))
      } else {
        console.error('UI: Erreur lors de la mise à jour du timer:', result.error)
        // Fallback: mettre à jour localement quand même pour l'UX
        setProjects(prev => prev.map(p => 
          p.id === id ? { ...p, isRunning, timeSpent: newTimeSpent, lastStarted } : p
        ))
      }
    } catch (error) {
      console.error('UI: Erreur réseau lors de la mise à jour du timer:', error)
      // Fallback: mettre à jour localement pour l'UX
      const project = projects.find(p => p.id === id)
      if (project) {
        const isRunning = !project.isRunning
        let newTimeSpent = project.timeSpent || 0
        let lastStarted: Date | null = null

        if (isRunning) {
          lastStarted = new Date()
        } else if (project.lastStarted) {
          const now = new Date()
          const additionalTime = Math.floor((now.getTime() - new Date(project.lastStarted).getTime()) / 1000)
          newTimeSpent += additionalTime
        }

        setProjects(prev => prev.map(p => 
          p.id === id ? { ...p, isRunning, timeSpent: newTimeSpent, lastStarted } : p
        ))
      }
    }
  }

  const handleCreateProject = () => {
    setIsCreateModalOpen(true)
    setNewProject({
      name: '',
      description: '',
      tools: [],
      resultLink: '',
      filesLink: '',
      type: 'perso' as 'perso' | 'pro',
      platform: 'pc' as 'pc' | 'mac',
      keywords: ''
    })
  }

  const handleInputChange = (field: string, value: string | string[]) => {
    console.log('handleInputChange:', field, value)
    setNewProject(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCreateToolToggle = (tool: string) => {
    const currentTools = newProject.tools || []
    if (currentTools.includes(tool)) {
      handleInputChange('tools', currentTools.filter(t => t !== tool))
    } else {
      handleInputChange('tools', [...currentTools, tool])
    }
  }

  const addCustomTool = () => {
    if (customTool.trim() && !newProject.tools.includes(customTool.trim())) {
      handleInputChange('tools', [...newProject.tools, customTool.trim()])
      setCustomTool('')
    }
  }

  const createProject = async () => {
    if (!newProject.name.trim()) {
      alert('Le nom du projet est obligatoire')
      return
    }

    try {
      console.log('UI: Création du projet:', newProject.name)
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: newProject.name.trim(),
          description: newProject.description.trim(),
          tools: newProject.tools.join(', '),
          resultLink: newProject.resultLink.trim() || null,
          filesLink: newProject.filesLink.trim() || null,
          type: newProject.type,
          platform: newProject.platform,
          keywords: newProject.keywords.trim() || null,
          status: 'idea'
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        console.log('UI: Projet créé avec succès')
        // Ajouter le nouveau projet à la liste locale
        setProjects(prev => [result.data, ...prev])
        // Fermer le modal et réinitialiser le formulaire
        setIsCreateModalOpen(false)
        setNewProject({
          name: '',
          description: '',
          tools: [],
          resultLink: '',
          filesLink: '',
          type: 'perso' as 'perso' | 'pro' | 'perso_pro',
          platform: 'pc' as 'pc' | 'mac',
          keywords: ''
        })
        setCustomTool('')
      } else {
        console.error('UI: Erreur lors de la création:', result.error)
        alert('Erreur lors de la création: ' + result.error)
      }
    } catch (error) {
      console.error('UI: Erreur réseau lors de la création:', error)
      alert('Erreur réseau lors de la création')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex-1 flex justify-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent text-center">
                Mes Projets DEV
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4 text-yellow-400" />
                ) : (
                  <Moon className="h-4 w-4 text-gray-600" />
                )}
              </Button>
              <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                    <Plus className="h-4 w-4" />
                    Nouveau Projet
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[525px] dark:bg-gray-800 dark:border-gray-700">
                  <DialogHeader>
                    <DialogTitle className="dark:text-white">Créer un nouveau projet</DialogTitle>
                    <DialogDescription className="dark:text-gray-400">
                      Remplissez les informations pour créer votre nouveau projet
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right dark:text-gray-300">
                        Nom *
                      </Label>
                      <Input
                        id="name"
                        value={newProject.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="col-span-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="Mon super projet"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description" className="text-right dark:text-gray-300">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        value={newProject.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        className="col-span-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="Description du projet..."
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                      <Label className="text-right dark:text-gray-300 pt-2">
                        Outils
                      </Label>
                      <div className="col-span-3 space-y-3">
                        <div className="flex flex-wrap gap-2">
                          {predefinedTools.map((tool) => (
                            <Button
                              key={tool}
                              type="button"
                              variant={newProject.tools.includes(tool) ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleCreateToolToggle(tool)}
                              className={`text-xs ${
                                newProject.tools.includes(tool) 
                                  ? "bg-blue-600 hover:bg-blue-700 text-white" 
                                  : "dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
                              }`}
                            >
                              {tool}
                            </Button>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Input
                            value={customTool}
                            onChange={(e) => setCustomTool(e.target.value)}
                            className="flex-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="Ajouter un outil personnalisé..."
                            onKeyPress={(e) => e.key === 'Enter' && addCustomTool()}
                          />
                          <Button
                            type="button"
                            onClick={addCustomTool}
                            disabled={!customTool.trim() || newProject.tools.includes(customTool.trim())}
                            size="sm"
                            className="dark:bg-blue-600 dark:hover:bg-blue-700"
                          >
                            Ajouter
                          </Button>
                        </div>
                        {newProject.tools.length > 0 && (
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            Outils sélectionnés: {newProject.tools.join(', ')}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Type */}
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right dark:text-gray-300">
                        Type
                      </Label>
                      <div className="col-span-3">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleInputChange('type', 'perso')}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                              newProject.type === 'perso'
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                            }`}
                          >
                            🏠 Personnel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleInputChange('type', 'pro')}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                              newProject.type === 'pro'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                            }`}
                          >
                            💼 Professionnel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleInputChange('type', 'perso_pro')}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                              newProject.type === 'perso_pro'
                                ? 'bg-purple-500 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                            }`}
                          >
                            🏠💼 Perso & Pro
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Platform */}
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right dark:text-gray-300">
                        Plateforme
                      </Label>
                      <div className="col-span-3">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleInputChange('platform', 'pc')}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                              newProject.platform === 'pc'
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                            }`}
                          >
                            🖥️ PC
                          </button>
                          <button
                            type="button"
                            onClick={() => handleInputChange('platform', 'mac')}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                              newProject.platform === 'mac'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                            }`}
                          >
                            🍎 Mac
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Keywords */}
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="keywords" className="text-right dark:text-gray-300">
                        Mots-clés
                      </Label>
                      <Input
                        id="keywords"
                        value={newProject.keywords}
                        onChange={(e) => handleInputChange('keywords', e.target.value)}
                        className="col-span-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="web, ia, mobile, design... (séparés par des virgules)"
                      />
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="resultLink" className="text-right dark:text-gray-300">
                        Lien résultats
                      </Label>
                      <Input
                        id="resultLink"
                        value={newProject.resultLink}
                        onChange={(e) => handleInputChange('resultLink', e.target.value)}
                        className="col-span-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="https://..."
                        type="url"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="filesLink" className="text-right dark:text-gray-300">
                        Lien fichiers
                      </Label>
                      <Input
                        id="filesLink"
                        value={newProject.filesLink}
                        onChange={(e) => handleInputChange('filesLink', e.target.value)}
                        className="col-span-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="https://..."
                        type="url"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsCreateModalOpen(false)}
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
                    >
                      Annuler
                    </Button>
                    <Button 
                      type="button" 
                      onClick={createProject}
                      disabled={!newProject.name.trim()}
                      className="dark:bg-blue-600 dark:hover:bg-blue-700"
                    >
                      Créer le projet
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              {/* Modal d'édition */}
              <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="sm:max-w-[525px] dark:bg-gray-800 dark:border-gray-700">
                  <DialogHeader>
                    <DialogTitle className="dark:text-white">Modifier le projet</DialogTitle>
                    <DialogDescription className="dark:text-gray-400">
                      Modifiez les informations de votre projet
                    </DialogDescription>
                  </DialogHeader>
                  {editingProject && (
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit-name" className="text-right dark:text-gray-300">
                          Nom *
                        </Label>
                        <Input
                          id="edit-name"
                          value={editingProject.name}
                          onChange={(e) => handleEditInputChange('name', e.target.value)}
                          className="col-span-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          placeholder="Mon super projet"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit-description" className="text-right dark:text-gray-300">
                          Description
                        </Label>
                        <Textarea
                          id="edit-description"
                          value={editingProject.description || ''}
                          onChange={(e) => handleEditInputChange('description', e.target.value)}
                          className="col-span-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          placeholder="Description du projet..."
                          rows={3}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-start gap-4">
                        <Label className="text-right dark:text-gray-300 pt-2">
                          Outils
                        </Label>
                        <div className="col-span-3 space-y-3">
                          <div className="flex flex-wrap gap-2">
                            {predefinedTools.map((tool) => {
                              const currentTools = Array.isArray(editingProject.tools) ? editingProject.tools : 
                                                   (editingProject.tools ? editingProject.tools.split(', ').filter(t => t.trim()) : [])
                              return (
                                <Button
                                  key={tool}
                                  type="button"
                                  variant={currentTools.includes(tool) ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => handleEditToolToggle(tool)}
                                  className={`text-xs ${
                                    currentTools.includes(tool) 
                                      ? "bg-blue-600 hover:bg-blue-700 text-white" 
                                      : "dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
                                  }`}
                                >
                                  {tool}
                                </Button>
                              )
                            })}
                          </div>
                          <div className="flex gap-2">
                            <Input
                              value={editCustomTool}
                              onChange={(e) => setEditCustomTool(e.target.value)}
                              className="flex-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              placeholder="Ajouter un outil personnalisé..."
                              onKeyPress={(e) => e.key === 'Enter' && addEditCustomTool()}
                            />
                            <Button
                              type="button"
                              onClick={addEditCustomTool}
                              disabled={!editCustomTool.trim()}
                              size="sm"
                              className="dark:bg-blue-600 dark:hover:bg-blue-700"
                            >
                              Ajouter
                            </Button>
                          </div>
                          {editingProject.tools && (
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              Outils sélectionnés: {Array.isArray(editingProject.tools) ? editingProject.tools.join(', ') : editingProject.tools}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Type */}
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right dark:text-gray-300">
                          Type
                        </Label>
                        <div className="col-span-3">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleEditInputChange('type', 'perso')}
                              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                                editingProject?.type === 'perso'
                                  ? 'bg-green-500 text-white'
                                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                              }`}
                            >
                              🏠 Personnel
                            </button>
                            <button
                              type="button"
                              onClick={() => handleEditInputChange('type', 'pro')}
                              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                                editingProject?.type === 'pro'
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                              }`}
                            >
                              💼 Professionnel
                            </button>
                            <button
                              type="button"
                              onClick={() => handleEditInputChange('type', 'perso_pro')}
                              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                                editingProject?.type === 'perso_pro'
                                  ? 'bg-purple-500 text-white'
                                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                              }`}
                            >
                              🏠💼 Perso & Pro
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Platform */}
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right dark:text-gray-300">
                          Plateforme
                        </Label>
                        <div className="col-span-3">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleEditInputChange('platform', 'pc')}
                              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                                editingProject?.platform === 'pc'
                                  ? 'bg-green-500 text-white'
                                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                              }`}
                            >
                              🖥️ PC
                            </button>
                            <button
                              type="button"
                              onClick={() => handleEditInputChange('platform', 'mac')}
                              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                                editingProject?.platform === 'mac'
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                              }`}
                            >
                              🍎 Mac
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Keywords */}
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit-keywords" className="text-right dark:text-gray-300">
                          Mots-clés
                        </Label>
                        <Input
                          id="edit-keywords"
                          value={editingProject?.keywords || ''}
                          onChange={(e) => handleEditInputChange('keywords', e.target.value)}
                          className="col-span-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          placeholder="web, ia, mobile, design... (séparés par des virgules)"
                        />
                      </div>
                      
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit-resultLink" className="text-right dark:text-gray-300">
                          Lien résultats
                        </Label>
                        <Input
                          id="edit-resultLink"
                          value={editingProject.resultLink || ''}
                          onChange={(e) => handleEditInputChange('resultLink', e.target.value)}
                          className="col-span-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          placeholder="https://..."
                          type="url"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit-filesLink" className="text-right dark:text-gray-300">
                          Lien fichiers
                        </Label>
                        <Input
                          id="edit-filesLink"
                          value={editingProject.filesLink || ''}
                          onChange={(e) => handleEditInputChange('filesLink', e.target.value)}
                          className="col-span-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          placeholder="https://..."
                          type="url"
                        />
                      </div>
                    </div>
                  )}
                  <DialogFooter>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsEditModalOpen(false)}
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
                    >
                      Annuler
                    </Button>
                    <Button 
                      type="button" 
                      onClick={updateProject}
                      disabled={!editingProject?.name?.trim()}
                      className="dark:bg-blue-600 dark:hover:bg-blue-700"
                    >
                      Mettre à jour
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 border border-gray-200/50 dark:border-gray-700/50">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Rechercher un projet..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 text-sm border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            {/* Quick Stats */}
            <div className="flex items-center space-x-3 text-xs">
              <div className="text-center">
                <div className="text-base font-semibold text-gray-900 dark:text-white">{projects.length}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Total</div>
              </div>
              <div className="text-center">
                <div className="text-base font-semibold text-blue-600 dark:text-blue-400">
                  {projects.filter(p => p.isFavorite).length}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Favoris</div>
              </div>
              <div className="text-center">
                <div className="text-base font-semibold text-green-600 dark:text-green-400">
                  {projects.filter(p => p.status === 'completed').length}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Terminés</div>
              </div>
              <div className="text-center">
                <div className="text-base font-semibold text-blue-600 dark:text-blue-400">
                  {formatTimeForStats(timeStats.declarableTime)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Déclarable</div>
              </div>
              {/* Section supprimée - currentlyRunningProject n'existe pas */}
            </div>
            
            {/* Filter Button */}
            <div className="flex items-center gap-2">
              <Button
                variant={showFilters ? "default" : "outline"}
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className={`text-xs transition-all duration-200 h-8 ${
                  showFilters 
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md' 
                    : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 dark:text-gray-300 hover:shadow-md'
                }`}
              >
                <Search className="h-3 w-3 mr-1" />
                Filtres
                {(selectedTools.length > 0 || selectedStatuses.length > 0 || selectedTypes.length > 0 || selectedPlatforms.length > 0 || keywordFilter.trim()) && (
                  <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                    {selectedTools.length + selectedStatuses.length + selectedTypes.length + selectedPlatforms.length + (keywordFilter.trim() ? 1 : 0)}
                  </span>
                )}
              </Button>
              
              {(selectedTools.length > 0 || selectedStatuses.length > 0 || selectedTypes.length > 0 || selectedPlatforms.length > 0 || keywordFilter.trim() || searchTerm) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 h-8 px-2"
                >
                  ×
                </Button>
              )}
            </div>
          </div>
          
          {/* Smart Suggestions */}
          {!showFilters && projects.length > 0 && selectedTools.length === 0 && selectedStatuses.length === 0 && selectedTypes.length === 0 && selectedPlatforms.length === 0 && !keywordFilter.trim() && (
              <div className="mt-2">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Suggestions rapides :</p>
                <div className="flex flex-wrap gap-1.5">
                  {getSmartSuggestions().map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => applySuggestion(suggestion)}
                      className="text-xs h-6 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:shadow-md transition-all duration-200"
                    >
                      {suggestion.label}
                      <span className="ml-1 text-xs text-gray-400">({suggestion.count})</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}
            {(selectedTools.length > 0 || selectedStatuses.length > 0 || selectedTypes.length > 0 || selectedPlatforms.length > 0 || keywordFilter.trim()) && (
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedTools.map(tool => (
                  <Badge key={tool} variant="secondary" className="text-xs bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-2 py-1">
                    🔧 {tool}
                    <button 
                      onClick={() => handleToolToggle(tool)}
                      className="ml-1 hover:text-blue-600 dark:hover:text-blue-100"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
                {selectedStatuses.map(status => (
                  <Badge key={status} variant="secondary" className="text-xs bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 px-2 py-1">
                    {status === 'idea' ? '💡 Idée' : status === 'in_progress' ? '⚡ En cours' : status === 'completed' ? '✅ Terminé' : '❌ Abandonné'}
                    <button 
                      onClick={() => handleStatusToggle(status)}
                      className="ml-1 hover:text-green-600 dark:hover:text-green-100"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
                {selectedTypes.map(type => (
                  <Badge key={type} variant="secondary" className="text-xs bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 px-2 py-1">
                    {type === 'perso' ? '🏠 Personnel' : '💼 Professionnel'}
                    <button 
                      onClick={() => handleTypeToggle(type)}
                      className="ml-1 hover:text-purple-600 dark:hover:text-purple-100"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
                {selectedPlatforms.map(platform => (
                  <Badge key={platform} variant="secondary" className="text-xs bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 px-2 py-1">
                    {platform === 'pc' ? '🖥️ PC' : '🍎 Mac'}
                    <button 
                      onClick={() => handlePlatformToggle(platform)}
                      className="ml-1 hover:text-green-600 dark:hover:text-green-100"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
                {keywordFilter.trim() && (
                  <Badge variant="secondary" className="text-xs bg-orange-100 dark:bg-orange-800 text-orange-800 dark:text-orange-200 px-2 py-1">
                    🔍 {keywordFilter}
                    <button 
                      onClick={() => setKeywordFilter('')}
                      className="ml-1 hover:text-orange-600 dark:hover:text-orange-100"
                    >
                      ×
                    </button>
                  </Badge>
                )}
              </div>
            )}

            {/* Compact Filter Panel */}
            {showFilters && (
              <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3">
                
                {/* Quick Search */}
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Recherche rapide</Label>
                  <Input
                    placeholder="Rechercher un projet..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                {/* Keywords */}
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Mots-clés</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Entrez des mots-clés..."
                      value={keywordFilter}
                      onChange={(e) => setKeywordFilter(e.target.value)}
                      className="flex-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    {keywordFilter.trim() && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setKeywordFilter('')}
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                      >
                        ×
                      </Button>
                    )}
                  </div>
                </div>

                {/* Tools */}
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Outils</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {getAllTools().slice(0, 8).map(tool => {
                      const isSelected = selectedTools.includes(tool)
                      const count = getToolCount(tool)
                      
                      return (
                        <Button
                          key={tool}
                          variant={isSelected ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleToolToggle(tool)}
                          className={`text-xs h-7 transition-all duration-200 ${
                            isSelected 
                              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md' 
                              : 'bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:border-gray-600 dark:text-gray-300 hover:shadow-md'
                          }`}
                        >
                          <span className="truncate">{tool}</span>
                          <span className={`ml-1 text-xs ${isSelected ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                            ({count})
                          </span>
                        </Button>
                      )
                    })}
                    {getAllTools().length > 8 && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-8 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                        disabled
                      >
                        +{getAllTools().length - 8} plus
                      </Button>
                    )}
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Statut</Label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: 'idea', label: '💡 Idée', count: projects.filter(p => p.status === 'idea').length },
                      { value: 'in_progress', label: '⚡ En cours', count: projects.filter(p => p.status === 'in_progress').length },
                      { value: 'completed', label: '✅ Terminé', count: projects.filter(p => p.status === 'completed').length }
                    ].map(status => {
                      const isSelected = selectedStatuses.includes(status.value)
                      
                      return (
                        <Button
                          key={status.value}
                          variant={isSelected ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleStatusToggle(status.value)}
                          className={`text-xs h-7 transition-all duration-200 ${
                            isSelected 
                              ? 'bg-green-600 hover:bg-green-700 text-white shadow-md' 
                              : 'bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:border-gray-600 dark:text-gray-300 hover:shadow-md'
                          }`}
                        >
                          {status.label}
                          <span className={`ml-1 text-xs ${isSelected ? 'text-green-100' : 'text-gray-500 dark:text-gray-400'}`}>
                            ({status.count})
                          </span>
                        </Button>
                      )
                    })}
                  </div>
                </div>

                {/* Type */}
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Type (sélection multiple)</Label>
                  <div className="flex gap-2">
                    {[
                      { value: 'perso', label: '🏠 Personnel', count: projects.filter(p => p.type === 'perso').length },
                      { value: 'pro', label: '💼 Professionnel', count: projects.filter(p => p.type === 'pro').length }
                    ].map(type => {
                      const isSelected = selectedTypes.includes(type.value)
                      
                      return (
                        <Button
                          key={type.value}
                          variant={isSelected ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleTypeToggle(type.value)}
                          className={`text-xs h-7 transition-all duration-200 ${
                            isSelected 
                              ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-md' 
                              : 'bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:border-gray-600 dark:text-gray-300 hover:shadow-md'
                          }`}
                        >
                          {type.label}
                          <span className={`ml-1 text-xs ${isSelected ? 'text-purple-100' : 'text-gray-500 dark:text-gray-400'}`}>
                            ({type.count})
                          </span>
                        </Button>
                      )
                    })}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Sélectionnez un ou plusieurs types. Vous pouvez choisir Personnel, Professionnel, ou les deux.
                  </p>
                </div>

                {/* Platform */}
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Plateforme (sélection multiple)</Label>
                  <div className="flex gap-2">
                    {[
                      { value: 'pc', label: '🖥️ PC', count: projects.filter(p => (p.platform || 'pc') === 'pc').length },
                      { value: 'mac', label: '🍎 Mac', count: projects.filter(p => (p.platform || 'pc') === 'mac').length }
                    ].map(platform => {
                      const isSelected = selectedPlatforms.includes(platform.value)
                      
                      return (
                        <Button
                          key={platform.value}
                          variant={isSelected ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePlatformToggle(platform.value)}
                          className={`text-xs h-7 transition-all duration-200 ${
                            isSelected 
                              ? 'bg-green-600 hover:bg-green-700 text-white shadow-md' 
                              : 'bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:border-gray-600 dark:text-gray-300 hover:shadow-md'
                          }`}
                        >
                          {platform.label}
                          <span className={`ml-1 text-xs ${isSelected ? 'text-green-100' : 'text-gray-500 dark:text-gray-400'}`}>
                            ({platform.count})
                          </span>
                        </Button>
                      )
                    })}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Sélectionnez une ou plusieurs plateformes. Vous pouvez choisir PC, Mac, ou les deux.
                  </p>
                </div>

              </div>
            )}
          </div>
        </div>

      {/* Projects Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4 mt-12">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="h-12 w-12 text-blue-400 dark:text-blue-500" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
              {searchTerm ? 'Aucun projet trouvé' : 'Aucun projet pour le moment'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
              {searchTerm 
                ? 'Essayez de modifier vos termes de recherche ou vos filtres.' 
                : 'Créez votre premier projet pour commencer à organiser votre travail.'
              }
            </p>
            {!searchTerm && (
              <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Créer mon premier projet
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[525px] dark:bg-gray-800 dark:border-gray-700">
                  <DialogHeader>
                    <DialogTitle className="dark:text-white">Créer un nouveau projet</DialogTitle>
                    <DialogDescription className="dark:text-gray-400">
                      Remplissez les informations pour créer votre nouveau projet
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right dark:text-gray-300">
                        Nom
                      </Label>
                      <Input
                        id="name"
                        value={newProject.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="col-span-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description" className="text-right dark:text-gray-300">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        value={newProject.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        className="col-span-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" onClick={handleCreateProject} className="bg-blue-600 hover:bg-blue-700">
                      Créer
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        ) : (
          <div>
            {/* Statistiques - Version compacte avec toutes les cartes */}
            <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2 mb-4">
              <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700 cursor-pointer" onDoubleClick={handleStatsEdit}>
                <CardContent className="p-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-green-600 dark:text-green-400 uppercase tracking-wide">Déclarable</p>
                      <p className="text-lg font-bold text-green-700 dark:text-green-300">{formatTimeForStats(timeStats.declarableTime)}</p>
                    </div>
                    <div className="p-1 bg-green-200/50 dark:bg-green-800/50 rounded-lg">
                      <Clock className="h-3 w-3 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700 cursor-pointer" onDoubleClick={handleStatsEdit}>
                <CardContent className="p-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">Total</p>
                      <p className="text-lg font-bold text-blue-700 dark:text-blue-300">{formatTimeForStats(timeStats.totalTimeSpent)}</p>
                    </div>
                    <div className="p-1 bg-blue-200/50 dark:bg-blue-800/50 rounded-lg">
                      <Timer className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700 cursor-pointer" onDoubleClick={handleStatsEdit}>
                <CardContent className="p-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-purple-600 dark:text-purple-400 uppercase tracking-wide">Moy/Jour</p>
                      <p className="text-lg font-bold text-purple-700 dark:text-purple-300">{formatTimeForStats(timeStats.timeToday)}</p>
                    </div>
                    <div className="p-1 bg-purple-200/50 dark:bg-purple-800/50 rounded-lg">
                      <TrendingUp className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200 dark:border-amber-700 cursor-pointer" onDoubleClick={handleStatsEdit}>
                <CardContent className="p-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wide">Semaine</p>
                      <p className="text-lg font-bold text-amber-700 dark:text-amber-300">{formatTimeForStats(timeStats.timeThisWeek)}</p>
                    </div>
                    <div className="p-1 bg-amber-200/50 dark:bg-amber-800/50 rounded-lg">
                      <Calendar className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 border-indigo-200 dark:border-indigo-700 cursor-pointer" onDoubleClick={handleStatsEdit}>
                <CardContent className="p-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">Mois</p>
                      <p className="text-lg font-bold text-indigo-700 dark:text-indigo-300">{formatTimeForStats(timeStats.timeThisMonth)}</p>
                    </div>
                    <div className="p-1 bg-indigo-200/50 dark:bg-indigo-800/50 rounded-lg">
                      <Calendar className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-700 cursor-pointer" onDoubleClick={handleStatsEdit}>
                <CardContent className="p-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-orange-600 dark:text-orange-400 uppercase tracking-wide">Projets</p>
                      <p className="text-lg font-bold text-orange-700 dark:text-orange-300">{projects.length}</p>
                    </div>
                    <div className="p-1 bg-orange-200/50 dark:bg-orange-800/50 rounded-lg">
                      <BarChart3 className="h-3 w-3 text-orange-600 dark:text-orange-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Section sticky avec résumé des projets */}
            <div className="sticky top-0 bg-white dark:bg-gray-900 z-20 pb-3 mb-4">
              {/* Résumé rapide */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-3 border border-gray-200/50 dark:border-gray-700/50 mb-3">
                <div className="text-center">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {filteredProjects.length} projet(s) au total
                  </h2>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {projects.filter(p => p.status === 'completed').length} terminés • 
                    {projects.filter(p => p.status === 'in_progress').length} en cours • 
                    {projects.filter(p => p.status === 'idea').length} idées
                  </div>
                </div>
              </div>

              {/* Projets en cours */}
              {projects.some(p => p.isRunning || p.status === 'in_progress') && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-3 border border-gray-200/50 dark:border-gray-700/50">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                    <div>
                      <h3 className="text-sm font-semibold text-orange-800 dark:text-orange-200">
                        {projects.filter(p => p.isRunning || p.status === 'in_progress').length} projet(s) en cours
                      </h3>
                      <div className="text-xs text-orange-600 dark:text-orange-300">
                        {projects.filter(p => p.isRunning || p.status === 'in_progress').map(p => p.name).join(', ')}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-2">
            {filteredProjects.slice(0, 6).map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleFavorite={handleToggleFavorite}
                onStatusChange={handleStatusChange}
                onToggleTimer={handleToggleTimer}
                onTimeEdit={handleTimeEdit}
                onResetStats={handleResetStats}
                onResetTimer={handleResetTimer}
              />
            ))}
            </div>
            
            {/* Pagination ou indication pour plus de projets */}
            {filteredProjects.length > 6 && (
              <div className="text-center mt-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {filteredProjects.length - 6} projet(s) de plus - Faites défiler pour voir la suite
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modale d'édition de temps */}
      <Dialog open={isTimeEditModalOpen} onOpenChange={setIsTimeEditModalOpen}>
        <DialogContent className="sm:max-w-[500px] dark:bg-gray-800 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Modifier le temps</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Modifiez le temps passé pour le projet : {editingTimeProject?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Toggle entre mode simple et avancé */}
            <div className="flex items-center justify-center space-x-2">
              <Button
                variant={timeInputMode === 'simple' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeInputMode('simple')}
                className="dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                Simple
              </Button>
              <Button
                variant={timeInputMode === 'advanced' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeInputMode('advanced')}
                className="dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                Avancé
              </Button>
            </div>

            {/* Mode simple : saisie en minutes */}
            {timeInputMode === 'simple' && (
              <div className="space-y-2">
                <Label htmlFor="simpleMinutes" className="text-sm font-medium dark:text-gray-300">
                  Temps total en minutes
                </Label>
                <Input
                  id="simpleMinutes"
                  type="number"
                  value={simpleMinutes}
                  onChange={(e) => setSimpleMinutes(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleTimeSave()
                    }
                  }}
                  placeholder="Ex: 90 pour 1h30"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  min="0"
                />
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Saisissez simplement le nombre de minutes (ex: 90 = 1h30)
                </div>
              </div>
            )}

            {/* Mode avancé : heures et minutes séparées */}
            {timeInputMode === 'advanced' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="advancedHours" className="text-sm font-medium dark:text-gray-300">
                      Heures
                    </Label>
                    <Input
                      id="advancedHours"
                      type="number"
                      value={advancedHours}
                      onChange={(e) => setAdvancedHours(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleTimeSave()
                        }
                      }}
                      placeholder="0"
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="advancedMinutes" className="text-sm font-medium dark:text-gray-300">
                      Minutes
                    </Label>
                    <Input
                      id="advancedMinutes"
                      type="number"
                      value={advancedMinutes}
                      onChange={(e) => setAdvancedMinutes(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleTimeSave()
                        }
                      }}
                      placeholder="0"
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      min="0"
                      max="59"
                    />
                  </div>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  Saisissez les heures et minutes séparément
                </div>
              </div>
            )}

            {/* Aperçu du temps total */}
            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400">Temps total :</div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {(() => {
                  const totalSeconds = parseSimpleTimeInput()
                  const hours = Math.floor(totalSeconds / 3600)
                  const minutes = Math.floor((totalSeconds % 3600) / 60)
                  if (hours > 0) {
                    return `${hours}h ${minutes}min`
                  } else {
                    return `${minutes}min`
                  }
                })()}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsTimeEditModalOpen(false)}
              className="dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              Annuler
            </Button>
            <Button onClick={handleTimeSave} className="dark:bg-blue-600 dark:hover:bg-blue-700">
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modale de reset des statistiques */}
      <Dialog open={isResetModalOpen} onOpenChange={setIsResetModalOpen}>
        <DialogContent className="sm:max-w-[400px] dark:bg-gray-800 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Reset des statistiques</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Voulez-vous vraiment réinitialiser les statistiques du projet "{projectToReset?.name}" ?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
              <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                <RotateCcw className="h-4 w-4" />
                <span className="text-sm font-medium">Attention : Cette action est irréversible</span>
              </div>
              <div className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                • Le temps passé sera remis à 0<br/>
                • Le timer sera arrêté s'il est en cours<br/>
                • Toutes les statistiques seront perdues
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsResetModalOpen(false)}
              className="dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              Annuler
            </Button>
            <Button onClick={handleResetAll} className="dark:bg-red-600 dark:hover:bg-red-700">
              Reset complet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modale d'édition des statistiques */}
      <Dialog open={isStatsEditModalOpen} onOpenChange={setIsStatsEditModalOpen}>
        <DialogContent className="sm:max-w-[450px] dark:bg-gray-800 dark:border-gray-700">
          <DialogHeader className="space-y-3">
            <DialogTitle className="dark:text-white text-lg">Modifier les statistiques</DialogTitle>
            <DialogDescription className="dark:text-gray-400 text-sm">
              Modifiez les statistiques globales du projet. Les modifications seront appliquées proportionnellement à tous les projets.
            </DialogDescription>
          </DialogHeader>
          
          {/* Avertissement en haut */}
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 mb-4">
            <div className="flex items-start space-x-2">
              <span className="text-amber-600 dark:text-amber-400 text-sm">⚠️</span>
              <div className="text-xs text-amber-700 dark:text-amber-300">
                <p className="font-medium mb-1">Seul le temps total peut être modifié. Les autres statistiques sont calculées automatiquement.</p>
                <p className="text-amber-600 dark:text-amber-400">Formats acceptés : 1:30:00 (1h30), 30:00 (30min), 45 (45sec)</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Temps total - Modifiable */}
            <div className="space-y-2">
              <Label htmlFor="totalTimeSpent" className="text-sm font-medium dark:text-gray-300">
                Temps total
              </Label>
              <Input
                id="totalTimeSpent"
                value={editingStats.totalTimeSpent}
                onChange={(e) => setEditingStats({...editingStats, totalTimeSpent: e.target.value})}
                placeholder="6:44"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* Statistiques calculées automatiquement */}
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500 dark:text-gray-400">Moy./jour</Label>
                  <div className="text-sm font-mono bg-gray-50 dark:bg-gray-700/50 p-2 rounded border dark:border-gray-600 text-gray-600 dark:text-gray-400">
                    {editingStats.timeToday}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500 dark:text-gray-400">Cette semaine</Label>
                  <div className="text-sm font-mono bg-gray-50 dark:bg-gray-700/50 p-2 rounded border dark:border-gray-600 text-gray-600 dark:text-gray-400">
                    {editingStats.timeThisWeek}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500 dark:text-gray-400">Ce mois</Label>
                  <div className="text-sm font-mono bg-gray-50 dark:bg-gray-700/50 p-2 rounded border dark:border-gray-600 text-gray-600 dark:text-gray-400">
                    {editingStats.timeThisMonth}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsStatsEditModalOpen(false)}
              className="dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              Annuler
            </Button>
            <Button onClick={handleStatsSave} className="dark:bg-blue-600 dark:hover:bg-blue-700">
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}