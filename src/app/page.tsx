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
  Sparkles,
  Clock,
  Zap,
  Languages,
} from 'lucide-react';
import { agents } from '@/lib/agents';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from '@/components/language-switcher';
import { PlaceHolderImages } from '@/lib/placeholder-images';

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
  const t = useTranslations('LandingPage');

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

  const testimonials = [
    {
      quote: t('testimonials.0.quote'),
      name: t('testimonials.0.name'),
      role: t('testimonials.0.role'),
      avatar: PlaceHolderImages.find(p => p.id === 'testimonial-1')?.imageUrl,
    },
    {
      quote: t('testimonials.1.quote'),
      name: t('testimonials.1.name'),
      role: t('testimonials.1.role'),
      avatar: PlaceHolderImages.find(p => p.id === 'testimonial-2')?.imageUrl,
    },
    {
      quote: t('testimonials.2.quote'),
      name: t('testimonials.2.name'),
      role: t('testimonials.2.role'),
      avatar: PlaceHolderImages.find(p => p.id === 'testimonial-3')?.imageUrl,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl font-headline">
            <BrainCircuit className="h-8 w-8 text-primary" />
            <span>AfgAiHub</span>
          </Link>
          <nav className="ml-auto flex items-center gap-2">
            <LanguageSwitcher />
            <Button variant="ghost" asChild>
              <Link href="/login">{t('header.login')}</Link>
            </Button>
            <Button asChild className="shadow-lg shadow-primary/20">
              <Link href="/login">{t('header.getStarted')}</Link>
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
              {t('hero.badge')}
            </span>
          </motion.div>
          <motion.h1
            className="text-5xl md:text-7xl font-extrabold tracking-tighter font-headline mb-4 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70"
            variants={itemVariants}
          >
            {t('hero.title')}
          </motion.h1>
          <motion.p
            className="max-w-3xl text-lg md:text-xl text-muted-foreground mb-10"
            variants={itemVariants}
          >
            {t('hero.subtitle')}
          </motion.p>
          <motion.div variants={itemVariants}>
            <Button size="lg" asChild>
              <Link href="/login">{t('hero.cta')}</Link>
            </Button>
          </motion.div>
        </motion.section>

        <section className="bg-card/50 py-24">
            <div className="container">
                <h2 className="text-4xl font-bold text-center mb-4 font-headline">{t('why.title')}</h2>
                <p className="text-lg text-muted-foreground text-center mb-16 max-w-2xl mx-auto">{t('why.subtitle')}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <motion.div variants={itemVariants}>
                        <Card className="bg-card/70 border-border/50 h-full">
                            <CardHeader>
                                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mx-auto mb-4">
                                    <Clock className="h-8 w-8" />
                                </div>
                                <CardTitle className="font-headline">{t('why.reasons.0.title')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{t('why.reasons.0.description')}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                         <Card className="bg-card/70 border-border/50 h-full">
                            <CardHeader>
                                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mx-auto mb-4">
                                    <Sparkles className="h-8 w-8" />
                                </div>
                                <CardTitle className="font-headline">{t('why.reasons.1.title')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{t('why.reasons.1.description')}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                         <Card className="bg-card/70 border-border/50 h-full">
                            <CardHeader>
                                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mx-auto mb-4">
                                    <Zap className="h-8 w-8" />
                                </div>
                                <CardTitle className="font-headline">{t('why.reasons.2.title')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{t('why.reasons.2.description')}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </section>

        <section id="agents" className="py-24">
          <div className="container">
            <h2 className="text-4xl font-bold text-center mb-12 font-headline">{t('agents.title')}</h2>
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
                          <CardTitle className="font-headline">{t(`agentNames.${agent.id}`)}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-muted-foreground">
                          {t(`agentDescriptions.${agent.id}`)}
                        </p>
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
            <h2 className="text-4xl font-bold text-center mb-12 font-headline">{t('testimonials.title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                 <motion.div key={index} variants={itemVariants}>
                  <Card className="h-full bg-card/70 border-border/50">
                    <CardContent className="pt-6">
                      <p className="text-muted-foreground mb-4">
                        "{testimonial.quote}"
                      </p>
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={testimonial.avatar} />
                          <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{testimonial.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {testimonial.role}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        <section className="py-24">
          <div className="container text-center max-w-3xl">
            <h2 className="text-4xl font-bold mb-4 font-headline">
              {t('cta.title')}
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
             {t('cta.subtitle')}
            </p>
            <Button size="lg" asChild className="shadow-lg shadow-primary/20">
              <Link href="/login">{t('cta.button')}</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/50 py-8">
        <div className="container text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {t('footer.copyright')}</p>
        </div>
      </footer>
    </div>
  );
}
