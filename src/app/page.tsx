
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  BrainCircuit,
  Bot,
  Scale,
  Briefcase,
  Plane,
  HeartPulse,
  PenSquare,
} from 'lucide-react';
import { agents } from '@/lib/agents';
import { Header } from '@/components/layout/header';

const iconMap: { [key: string]: React.FC<any> } = {
  'legal-assistant': Scale,
  'career-coach': Briefcase,
  'travel-planner': Plane,
  'fitness-trainer': HeartPulse,
  'content-creator': PenSquare,
  'quran-tutor': Bot, // Using Bot as a default for existing
  'doctor-assistant': Bot,
  'real-estate-agent': Bot,
  'app-prototyper': Bot,
  'antique-authenticator': Bot,
};

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };
  
  const allAgents = agents;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <BrainCircuit className="h-7 w-7 text-primary" />
            <span>AfgAiHub</span>
          </Link>
          <nav className="ml-auto flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Log In</Link>
            </Button>
            <Button asChild>
              <Link href="/login">Get Started</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <motion.section
          className="container flex flex-col items-center justify-center text-center py-20 md:py-32"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <BrainCircuit className="h-20 w-20 text-primary mb-6" />
          </motion.div>
          <motion.h1
            className="text-4xl md:text-6xl font-extrabold tracking-tighter font-headline mb-4"
            variants={itemVariants}
          >
            Welcome to AfgAiHub
          </motion.h1>
          <motion.p
            className="max-w-2xl text-lg md:text-xl text-muted-foreground mb-8"
            variants={itemVariants}
          >
            A modular AI ecosystem designed to solve modern problems. Access a
            suite of specialized AI agents to enhance your productivity and creativity.
          </motion.p>
          <motion.div variants={itemVariants}>
            <Button size="lg" asChild>
              <Link href="/login">Explore Agents</Link>
            </Button>
          </motion.div>
        </motion.section>

        {/* Features Section */}
        <section className="bg-card/30 py-20">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12 font-headline">
              Our Agents
            </h2>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={containerVariants}
            >
              {allAgents.map((agent) => {
                 const Icon = iconMap[agent.id] || Bot;
                 return(
                <motion.div key={agent.id} variants={itemVariants}>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-6 w-6" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 font-headline">{agent.name}</h3>
                      <p className="text-muted-foreground">
                        {agent.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
                 );
              })}
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} AfgAiHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
