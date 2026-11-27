import {
  AlignLeft, ArrowLeft, ArrowRight, ArrowUp, ArrowUpRight, Baby, BookOpen, BookOpenText, Check, ChefHat, ChevronLeft, ChevronRight,
  CircleCheck, Clock, Copy, FileDown, FileText, Flag, Heart, History, Image, Lightbulb, Link, Linkedin, ListChecks, ListOrdered,
  Loader, Mail, MessageCircleQuestion, Minimize2, MousePointerClick, PenLine, Pencil, Plus, RefreshCw, RotateCcw, Send,
  ShieldCheck, Shuffle, Sparkles, TriangleAlert, Type, Undo2, UserPen, X, Feather, GripVertical,
  Library, BookmarkPlus, Trash2, Sprout, Users, Briefcase, Share2, Palette, type LucideIcon,
} from 'lucide-react'

const ICONS = {
  'align-left': AlignLeft, 'arrow-left': ArrowLeft, 'arrow-right': ArrowRight, 'arrow-up': ArrowUp, 'arrow-up-right': ArrowUpRight,
  baby: Baby, 'book-open': BookOpen, 'book-open-text': BookOpenText, check: Check, 'chef-hat': ChefHat, 'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight, 'circle-check': CircleCheck, clock: Clock, copy: Copy, 'file-down': FileDown, 'file-text': FileText,
  flag: Flag, heart: Heart, history: History, image: Image, lightbulb: Lightbulb, link: Link, linkedin: Linkedin, 'list-checks': ListChecks,
  'list-ordered': ListOrdered, loader: Loader, mail: Mail, 'message-circle-question': MessageCircleQuestion, 'minimize-2': Minimize2,
  'mouse-pointer-click': MousePointerClick, 'pen-line': PenLine, pencil: Pencil, plus: Plus, 'refresh-cw': RefreshCw, 'rotate-ccw': RotateCcw,
  send: Send, 'shield-check': ShieldCheck, shuffle: Shuffle, sparkles: Sparkles, 'triangle-alert': TriangleAlert, type: Type,
  'undo-2': Undo2, 'user-pen': UserPen, x: X, feather: Feather, 'grip-vertical': GripVertical, library: Library, 'bookmark-plus': BookmarkPlus, trash: Trash2, sprout: Sprout, users: Users, briefcase: Briefcase, share: Share2, palette: Palette,
} satisfies Record<string, LucideIcon>

export type IconName = keyof typeof ICONS

export function Icon({ name }: { name: IconName }) {
  const C = ICONS[name]
  return <C className="lucide" strokeWidth={1.75} aria-hidden="true" />
}
