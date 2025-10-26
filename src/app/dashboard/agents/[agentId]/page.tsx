import { notFound } from 'next/navigation';
import { agents } from '@/lib/agents';
import { Header } from '@/components/layout/header';
import QuranTutor from '@/components/agents/quran-tutor';
import DoctorAssistant from '@/components/agents/doctor-assistant';
import RealEstateAgent from '@/components/agents/real-estate-agent';
import AppPrototyper from '@/components/agents/app-prototyper';
import AntiqueAuthenticator from '@/components/agents/antique-authenticator';

type AgentPageProps = {
  params: {
    agentId: string;
  };
};

const agentComponents: Record<string, React.ComponentType> = {
  'quran-tutor': QuranTutor,
  'doctor-assistant': DoctorAssistant,
  'real-estate-agent': RealEstateAgent,
  'app-prototyper': AppPrototyper,
  'antique-authenticator': AntiqueAuthenticator,
};

export default function AgentPage({ params }: AgentPageProps) {
  const { agentId } = params;
  const agent = agents.find((a) => a.id === agentId);
  const AgentComponent = agentComponents[agentId];

  if (!agent || !AgentComponent) {
    notFound();
  }

  return (
    <div className="flex flex-col w-full">
      <Header title={agent.name} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <AgentComponent />
      </main>
    </div>
  );
}

export function generateStaticParams() {
  return agents.map((agent) => ({
    agentId: agent.id,
  }));
}
