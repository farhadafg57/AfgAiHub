
import type { LucideIcon } from 'lucide-react';
import {
  AppWindow,
  BookOpen,
  Gem,
  Home,
  LayoutDashboard,
  Stethoscope,
  CreditCard,
  Scale,
  Briefcase,
  Plane,
  HeartPulse,
  PenSquare,
} from 'lucide-react';

export type Agent = {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  href: string;
};

export const agents: Agent[] = [
  {
    id: 'quran-tutor',
    name: 'Quran Tutor',
    description: 'Spiritual guidance and knowledge from the Quran.',
    icon: BookOpen,
    href: '/dashboard/agents/quran-tutor',
  },
  {
    id: 'doctor-assistant',
    name: 'Doctor Assistant',
    description: 'Preliminary medical information and assistance.',
    icon: Stethoscope,
    href: '/dashboard/agents/doctor-assistant',
  },
  {
    id: 'real-estate-agent',
    name: 'Real Estate Agent',
    description: 'Real estate inquiries and property information.',
    icon: Home,
    href: '/dashboard/agents/real-estate-agent',
  },
  {
    id: 'app-prototyper',
    name: 'App Prototyper',
    description: 'Prompt-to-app builder for generating prototypes.',
    icon: AppWindow,
    href: '/dashboard/agents/app-prototyper',
  },
  {
    id: 'antique-authenticator',
    name: 'Antique Authenticator',
    description: 'Analyzes images of antiques for authentication.',
    icon: Gem,
    href: '/dashboard/agents/antique-authenticator',
  },
  {
    id: 'legal-assistant',
    name: 'Legal Assistant',
    description: 'Preliminary legal information and simple document drafting.',
    icon: Scale,
    href: '/dashboard/agents/legal-assistant',
  },
  {
    id: 'career-coach',
    name: 'Career Coach',
    description: 'Get career advice, resume feedback, and job search strategies.',
    icon: Briefcase,
    href: '/dashboard/agents/career-coach',
  },
  {
    id: 'travel-planner',
    name: 'Travel Planner',
    description: 'Creates personalized travel itineraries and provides recommendations.',
    icon: Plane,
    href: '/dashboard/agents/travel-planner',
  },
  {
    id: 'fitness-trainer',
    name: 'Fitness Trainer',
    description: 'Designs custom workout plans and offers fitness advice.',
    icon: HeartPulse,
    href: '/dashboard/agents/fitness-trainer',
  },
  {
    id: 'content-creator',
    name: 'Content Creator',
    description: 'Generates content ideas, drafts articles, and suggests social media posts.',
    icon: PenSquare,
    href: '/dashboard/agents/content-creator',
  },
];

export const navigationLinks = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  ...agents.map(({ name, href, icon }) => ({ name, href, icon })),
  {
    name: 'Payments',
    href: '/dashboard/payment',
    icon: CreditCard,
  },
];
