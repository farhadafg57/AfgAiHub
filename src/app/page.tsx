
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
  Check,
} from 'lucide-react';
import { agents } from '@/lib/agents';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
                return (
                  <motion.div key={agent.id} variants={itemVariants}>
                    <Card>
                      <CardHeader>
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 text-primary">
                              <Icon className="h-6 w-6" />
                            </div>
                          </div>
                          <div>
                            <CardTitle>{agent.name}</CardTitle>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4">
                          {agent.description}
                        </p>
                        <Button asChild>
                          <Link href={`/dashboard/agents/${agent.id}`}>
                            View Demo
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12 font-headline">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mx-auto mb-4">
                      <Check className="h-8 w-8" />
                    </div>
                    <CardTitle>Choose an Agent</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Select from our diverse range of specialized AI agents to best suit your needs.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mx-auto mb-4">
                      <BrainCircuit className="h-8 w-8" />
                    </div>
                    <CardTitle>Interact and Collaborate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Engage with your chosen AI agent to generate content, solve problems, and unlock new insights.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mx-auto mb-4">
                      <Bot className="h-8 w-8" />
                    </div>
                    <CardTitle>Achieve Your Goals</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Leverage the power of AI to streamline your workflow, enhance your creativity, and achieve your goals faster.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="bg-card/30 py-20">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12 font-headline">
              What Our Users Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <motion.div variants={itemVariants}>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">John Doe</p>
                        <p className="text-sm text-muted-foreground">
                          CEO, Tech Corp
                        </p>
                      </div>
                    </div>
                    <p className="text-muted-foreground">
                      "AfgAiHub has revolutionized our workflow. The AI agents are incredibly powerful and easy to use."
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">Jane Smith</p>
                        <p className="text-sm text-muted-foreground">
                          Freelance Writer
                        </p>
                      </div>
                    </div>
                    <p className="text-muted-foreground">
                      "I can't imagine my creative process without AfgAiHub. The content creator agent is a game-changer."
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">Peter Jones</p>
                        <p className="text-sm text-muted-foreground">
                          Student
                        </p>
                      </div>
                    </div>
                    <p className="text-muted-foreground">
                      "The quran tutor agent has been an invaluable tool for my studies. It's like having a personal tutor 24/7."
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-4 font-headline">
              Ready to Get Started?
            </h2>
            <p className="text-muted-foreground mb-8">
              Join AfgAiHub today and unlock the power of AI.
            </p>
            <Button size="lg" asChild>
              <Link href="/login">Sign Up Now</Link>
            </Button>
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
