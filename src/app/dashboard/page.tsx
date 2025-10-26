import Link from 'next/link';
import Image from 'next/image';
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
  return (
    <div className="flex flex-col w-full">
      <Header title="Dashboard" />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => {
            const placeholderImage = PlaceHolderImages.find(p => p.id === agent.id);
            return (
              <Link href={agent.href} key={agent.id}>
                <Card className="group overflow-hidden h-full flex flex-col hover:border-primary transition-colors duration-300">
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                     <div className="absolute bottom-4 left-4">
                       <agent.icon className="h-10 w-10 text-white" />
                     </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="font-headline text-xl">{agent.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <CardDescription>{agent.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
