import { Card, CardContent } from "@/components/ui/card";
import { Award, Users, Clock, Shield } from "lucide-react";

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
    <section id="about" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Pourquoi choisir A Touts Services ?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Implantée à Issy-les-Moulineaux dans le département des Hauts-de-Seine,
              notre entreprise forte de plus de 10 ans d&apos;expérience s&apos;est spécialisée
              dans la rénovation complète et les services du bâtiment.
            </p>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Expertise reconnue</h3>
                  <p className="text-gray-600">Des artisans qualifiés et certifiés pour tous vos travaux</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Accompagnement personnalisé</h3>
                  <p className="text-gray-600">Un suivi de projet de A à Z avec un interlocuteur unique</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Garantie et assurance</h3>
                  <p className="text-gray-600">Tous nos travaux sont garantis et assurés décennale</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center border-0 shadow-elegant hover-lift">
                <CardContent className="p-6">
                  <div className="text-primary mb-4 flex justify-center">
                    <stat.icon className="h-8 w-8" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-sm font-semibold text-gray-700 mb-2">{stat.label}</div>
                  <div className="text-xs text-gray-500">{stat.description}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
