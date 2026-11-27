export type Step = 'idea' | 'shape' | 'write' | 'publish'
export type Question = 'idea' | 'aud' | 'tone' | 'len' | 'story' | 'summary' | 'title' | 'plan'
export type Status = 'planned' | 'queued' | 'writing' | 'done' | 'failed'
export type ParaKind = 'shorter' | 'simpler' | 'example' | 'warmer'
export type ChapterKind = 'shorter' | 'practical' | 'personal' | 'fresh'
export type Layout = 'object' | 'type' | 'pattern' | 'frame'
export type FontKey = 'editorial' | 'modern' | 'classic'
export type Motif = 'loaf' | 'wheat' | 'leaf' | 'wave' | 'sun' | 'peak' | 'star' | 'circle' | 'none'
export type Theme = 'classic' | 'modern' | 'warm'
export type RefineTab = 'text' | 'chapters' | 'cover' | 'style'

export interface Version { label: string; paras: string[] }

export interface Chapter {
  id: number
  key: string
  title: string
  status: Status
  paras: string[]
  versions: Version[]
  failedOnce: boolean
  doneAt?: number
}

export interface CoverSpec { layout: Layout; pal: number; font: FontKey; motif: Motif }

export interface Book {
  title: string
  subtitle: string
  author: string
  chapters: Chapter[]
  cover: CoverSpec
  style: { theme: Theme; dropcap: boolean }
}

export interface Message { from: 'ai' | 'me'; text: string; undo?: boolean; card?: boolean; at: number }
