'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Header } from '@/components/layout/header';
import { agents } from '@/lib/agents';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Dashboard() {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: 'easeOut',
      },
    }),
  };

  return (
    <div className="flex flex-col w-full">
      <Header title="Dashboard" />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent, i) => {
            const placeholderImage = PlaceHolderImages.find(
              (p) => p.id === agent.id
            );
            return (
              <motion.div
                key={agent.id}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={cardVariants}
                whileHover={{ y: -5, boxShadow: '0 8px 30px rgba(var(--primary), 0.2)' }}
                transition={{ duration: 0.3 }}
              >
                <Link href={agent.href}>
                  <Card className="group overflow-hidden h-full flex flex-col bg-card/60 backdrop-blur-sm border-white/10 hover:border-primary transition-all duration-300">
                    <div className="relative h-48 w-full overflow-hidden">
                      {placeholderImage && (
                        <Image
                          src={placeholderImage.imageUrl}
                          alt={placeholderImage.description}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          data-ai-hint={placeholderImage.imageHint}
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        <agent.icon className="h-10 w-10 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
                      </div>
                       <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-transparent via-transparent to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    <CardHeader>
                      <CardTitle className="font-headline text-xl text-primary-foreground">
                        {agent.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <CardDescription className="text-muted-foreground">
                        {agent.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
