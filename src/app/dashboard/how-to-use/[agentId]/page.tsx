
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { guides, AgentGuide } from '@/lib/how-to-use-guides';
import { agents } from '@/lib/agents';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Terminal } from 'lucide-react';

type HowToUsePageProps = {
  params: {
    agentId: string;
  };
};

export default function HowToUsePage({ params }: HowToUsePageProps) {
  const { agentId } = params;
  const guide = guides[agentId];
  const agent = agents.find((a) => a.id === agentId);

  if (!guide || !agent) {
    notFound();
  }

  return (
    <div className="flex flex-col w-full">
      <Header title={`How to Use: ${agent.name}`} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <agent.icon className="h-10 w-10 text-primary" />
                <div>
                  <CardTitle className="font-headline text-2xl">{guide.title}</CardTitle>
                  <CardDescription>{guide.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl">Core Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
                {guide.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
                <div className='flex items-center gap-2'>
                    <Lightbulb className="h-5 w-5 text-yellow-400" />
                    <CardTitle className="font-headline text-xl">Tips for Best Results</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
              <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
                {guide.tips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Terminal className="h-5 w-5 text-green-400" />
                    <CardTitle className="font-headline text-xl">Example Prompts</CardTitle>
                </div>
              <CardDescription>
                Use these examples as inspiration for your own queries.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {guide.examplePrompts.map((prompt, index) => (
                <div key={index} className="rounded-md border bg-card p-4">
                  <p className="font-code text-sm text-primary-foreground">
                    {prompt.prompt}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground italic">
                    - {prompt.explanation}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {guide.disclaimer && (
            <Card className="border-destructive/50">
              <CardHeader>
                <CardTitle className="font-headline text-lg text-destructive">
                  Important Disclaimer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-destructive/90">{guide.disclaimer}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}

export function generateStaticParams() {
  return Object.keys(guides).map((agentId) => ({
    agentId,
  }));
}
