import { Award, Users, Clock, Shield } from "lucide-react";
import { Reveal } from "@/components/Reveal";

const stats = [
  {
    icon: Clock,
    value: "10+",
    label: "Années d'expérience",
    description: "Plus d'une décennie au service de nos clients"
  },
  {
    icon: Users,
    value: "500+",
    label: "Projets réalisés",
    description: "Des centaines de clients satisfaits"
  },
  {
    icon: Award,
    value: "100%",
    label: "Satisfaction client",
    description: "Notre priorité absolue"
  },
  {
    icon: Shield,
    value: "10 ans",
    label: "Garantie décennale",
    description: "Votre sérénité assurée"
  }
];

export const About = () => {
  return (
    <section id="about" className="py-24 bg-neutral-950">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <Reveal>
            <div className="text-xs font-medium tracking-[0.2em] text-sky-400 uppercase mb-4">
              Pourquoi Atouts Services
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Une équipe, tous vos travaux.
            </h2>
            <p className="text-lg text-neutral-400 mb-8">
              Implantée à Issy-les-Moulineaux dans le département des Hauts-de-Seine,
              notre entreprise forte de plus de 10 ans d&apos;expérience s&apos;est spécialisée
              dans la rénovation complète et les services du bâtiment.
            </p>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-sky-400/10 rounded-lg flex items-center justify-center">
                  <Award className="h-6 w-6 text-sky-400" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Expertise reconnue</h3>
                  <p className="text-neutral-400">Des artisans qualifiés et certifiés pour tous vos travaux</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-sky-400/10 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-sky-400" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Accompagnement personnalisé</h3>
                  <p className="text-neutral-400">Un suivi de projet de A à Z avec un interlocuteur unique</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-sky-400/10 rounded-lg flex items-center justify-center">
                  <Shield className="h-6 w-6 text-sky-400" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Garantie et assurance</h3>
                  <p className="text-neutral-400">Tous nos travaux sont garantis et assurés décennale</p>
                </div>
              </div>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, index) => (
              <Reveal key={index} delay={index * 100}>
                <div className="text-center border border-white/10 rounded-xl bg-white/5 hover:bg-white/10 transition-colors p-6">
                  <div className="text-sky-400 mb-4 flex justify-center">
                    <stat.icon className="h-8 w-8" aria-hidden="true" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-sm font-semibold text-neutral-200 mb-2">{stat.label}</div>
                  <div className="text-xs text-neutral-500">{stat.description}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
