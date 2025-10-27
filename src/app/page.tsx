
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
  Zap,
  Clock,
  Sparkles
} from 'lucide-react';
import { agents } from '@/lib/agents';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const iconMap: { [key: string]: React.FC<any> } = {
  'legal-assistant': Scale,
  'career-coach': Briefcase,
  'travel-planner': Plane,
  'fitness-trainer': HeartPulse,
  'content-creator': PenSquare,
  'quran-tutor': Bot,
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
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl font-headline">
            <BrainCircuit className="h-8 w-8 text-primary" />
            <span>AfgAiHub</span>
          </Link>
          <nav className="ml-auto flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Log In</Link>
            </Button>
            <Button asChild className="shadow-lg shadow-primary/20">
              <Link href="/login">Get Started Free</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <motion.section
          className="container flex flex-col items-center justify-center text-center py-24 md:py-40"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Sparkles className="mr-2 h-4 w-4" />
              Now with 10 Specialized AI Agents
            </span>
          </motion.div>
          <motion.h1
            className="text-5xl md:text-7xl font-extrabold tracking-tighter font-headline mb-4 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70"
            variants={itemVariants}
          >
            Your AI-Powered Copilot for Modern Problems
          </motion.h1>
          <motion.p
            className="max-w-3xl text-lg md:text-xl text-muted-foreground mb-10"
            variants={itemVariants}
          >
            AfgAiHub is a modular ecosystem of specialized AI agents designed to solve complex tasks, boost your productivity, and unlock your creative potential.
          </motion.p>
          <motion.div variants={itemVariants}>
            <Button size="lg" asChild>
              <Link href="/login">Explore Agents Now</Link>
            </Button>
          </motion.div>
        </motion.section>

        <section className="bg-card/50 py-24">
            <div className="container">
                <h2 className="text-4xl font-bold text-center mb-4 font-headline">Why AfgAiHub?</h2>
                <p className="text-lg text-muted-foreground text-center mb-16 max-w-2xl mx-auto">Go beyond generic chatbots. Our specialized agents provide expert-level assistance across a variety of domains.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <motion.div variants={itemVariants}>
                        <Card className="bg-card/70 border-border/50 h-full">
                            <CardHeader>
                                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mx-auto mb-4">
                                    <Clock className="h-8 w-8" />
                                </div>
                                <CardTitle className="font-headline">Save Time & Effort</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">Automate tedious tasks like research, drafting, and planning. Get instant, high-quality results and focus on what truly matters.</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                         <Card className="bg-card/70 border-border/50 h-full">
                            <CardHeader>
                                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mx-auto mb-4">
                                    <Sparkles className="h-8 w-8" />
                                </div>
                                <CardTitle className="font-headline">Boost Creativity</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">Overcome creative blocks with endless ideas for content, app prototypes, and more. Your AI partner for brainstorming and creation.</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                         <Card className="bg-card/70 border-border/50 h-full">
                            <CardHeader>
                                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mx-auto mb-4">
                                    <Zap className="h-8 w-8" />
                                </div>
                                <CardTitle className="font-headline">Make Informed Decisions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">From preliminary legal information to medical symptom analysis, get structured data to make better, more informed choices.</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </section>

        <section id="agents" className="py-24">
          <div className="container">
            <h2 className="text-4xl font-bold text-center mb-12 font-headline">Meet Your Team of AI Agents</h2>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={containerVariants}
            >
              {allAgents.map((agent) => {
                const Icon = iconMap[agent.id] || Bot;
                return (
                  <motion.div key={agent.id} variants={itemVariants}>
                    <Card className="bg-card/70 border-border/50 hover:border-primary/50 transition-colors h-full flex flex-col">
                      <CardHeader>
                          <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-primary/10 text-primary mb-4">
                            <Icon className="h-7 w-7" />
                          </div>
                          <CardTitle className="font-headline">{agent.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <CardDescription>
                          {agent.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        <section className="bg-card/50 py-24">
          <div className="container">
            <h2 className="text-4xl font-bold text-center mb-12 font-headline">What Our Users Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <motion.div variants={itemVariants}>
                <Card className="h-full bg-card/70 border-border/50">
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground mb-4">
                      "The Career Coach agent gave me the confidence to apply for a management role. The resume feedback was invaluable, and I got the job!"
                    </p>
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">John D.</p>
                        <p className="text-sm text-muted-foreground">
                          Newly Promoted Manager
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Card className="h-full bg-card/70 border-border/50">
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground mb-4">
                      "I used the Travel Planner for my trip to Japan. The itinerary was flawless and saved me hours of research. The restaurant recommendations were spot-on."
                    </p>
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src="https://i.pravatar.cc/150?u=a04258114e29026702d" />
                        <AvatarFallback>AS</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">Aisha S.</p>
                        <p className="text-sm text-muted-foreground">
                          Travel Enthusiast
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Card className="h-full bg-card/70 border-border/50">
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground mb-4">
                      "As a student, the Quran Tutor is like having a personal scholar available 24/7. It has deepened my understanding and connection to my faith."
                    </p>
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704e" />
                        <AvatarFallback>FK</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">Fatima K.</p>
                        <p className="text-sm text-muted-foreground">
                          University Student
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>
        
        <section className="py-24">
          <div className="container text-center max-w-3xl">
            <h2 className="text-4xl font-bold mb-4 font-headline">
              Ready to Transform Your Workflow?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Sign up today and get instant access to our full suite of AI agents. Your free trial awaits.
            </p>
            <Button size="lg" asChild className="shadow-lg shadow-primary/20">
              <Link href="/login">Claim Your Free Trial</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/50 py-8">
        <div className="container text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} AfgAiHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
