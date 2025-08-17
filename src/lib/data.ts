export const personalInfo = {
  name: 'Cyril PHAM LE',
  location: 'Paris',
  email: 'cyril.phamle@gmail.com',
  github: 'https://github.com/Cyphle',
  linkedin: 'https://www.linkedin.com/in/cyrilphamle/',
  profilePicture: '/profile.jpeg',
  heroDescription:
      'Développeur passionné, j’aime sortir du cadre du développement logiciel en cultivant un mindset transversal. J’aime m’impliquer et comprendre tous les aspects d’un projet, allant des enjeux d’infrastructure à ceux de produit, en passant par la sécurité, l’industrialisation, les coûts, l’architecture et la gestion d’équipe. Egalement software crafter et pragmatique, les techniques de clean code et d’architecture me permettent de créer des logiciels maintenables et ayant une valeur ajoutée. J\'apporte des solutions à des problématiques métiers et utilisateurs.'
};

export const workExperience = [
  {
    company: 'BPI France pour le compte de Shodo',
    location: 'Paris, France',
    position: 'DevSecOps Engineer',
    period: 'May 2025 - Aujourd\'hui',
    achievements: [
      'BPI France a entamé une grande transformation de ses équipes techniques autour des pratiques Safe et DevSecOps.',
      'J’ai intégré BPI France au sein de l’équipe DevSecOps. Nous avons pour mission d’accompagner les équipes dans la mise en place de bonnes pratiques et de montée en compétence sur les outils appuyant les pratiques.',
      'Mes missions :',
      '- Concevoir et développer des outils pour faciliter le travail des équipes comme un runner « universel » pour des tests de disponibilité fonctionnelle',
      '- Débloquer les équipes sur leurs sujets techniques allant de bonnes pratiques et architectures de développement à l’utilisation d’outils comme Datadog, Jenkins, Kubernetes, etc',
      '- Accompagner un train au sens Safe dans la mise en place de bonnes pratiques de développement, d’observabilité, de sécurité, d’organisation et d’outillage',
      '',
      'Environnement technique : Java, Spring, Angular, Python, Kubernetes, AWS, Datadog, Jenkins'
    ],
    tools: ['Java', 'Spring', 'Angular', 'Python', 'Kubernetes', 'AWS', 'Datadog', 'Jenkins']
  },
  {
    company: 'Lite pour le compte de Shodo',
    location: 'Paris, France',
    position: 'Tech Lead & accompagnement de CTO',
    period: 'Nov 2024 - Avr 2025',
    achievements: [
      'Lite propose une plate-forme pour les particuliers et les pros permettant de suivre sa consommation énergétique d’électricité ainsi que des leviers pour effectuer des économies dans sa consommation.\n' +
      'Lite a également gagné un projet CEE permettant au particulier d’estimer les gains énergétiques, financiers et émissions de CO2 suite à des travaux de rénovation énergétiques tels l’isolation, le changement de moyen de chauffage, le changement de fenêtres, etc.\n' +
      'Les deux projets de Lite reposent sur la récupération en masse de données de consommations énergétiques, principalement gaz et électricité. Pour ce faire, un projet de data pipeline a été lancé.',
      'Mon intervention au sein de Lite s’est porté sur deux axes principaux :',
      '- Coach et support organisationnel au CTO :',
      '> Stratégie de recrutement et recrutements',
      '> Organisation des équipes',
      '> Mise en place de principes et de culture d’industrialisation et de production',
      '- Tech Lead sur le projet CEE Economee',
      '> Développement de la solution Economee',
      '> Encadrement des développeurs',
      '> Mise en place d’outillages et automatisation comme la CI/CD avec Github Action',
      '- Tech Lead sur le projet datap ipeline',
      '> Pilotage et synchronisation des différents intervenants (data scientist, data engineer, développeur, CTO)',
      '> Industrialisation',
      '> Développement',
    ],
    tools: ['Kotlin', 'Spring Boot 3', 'React 18', 'MockK', 'Jest', 'Vite', 'Tailwind', 'CleverCloud', 'AWS ECS', 'AWS Glue', 'AWS SQS', 'Docker', 'architecture CQS', 'TDD', 'SOLID'],
  },
  {
    company: 'Stonal',
    location: 'Paris, France',
    position: 'CTPO',
    period: 'Jun 2021 - Oct 2024',
    achievements: [
      'Stonal est éditeur d’une plate-forme du même nom répondant au challenge du numérique dans le secteur de l’immobilier. La plate-forme se voit comme le centre des données immobilière, alphanumérique, documents et plans, afin de les fiabiliser et les servir au travers d’usages tels que des dashboard, applications métiers et APIs.',
      'J’ai eu l’opportunité de prendre le rôle de CTO afin de structurer l’équipe R&D. Mon rôle a notamment été mu par une volonté de faire grandir une équipe autour d’un produit avec comme mot d’ordre la bienveillance.\n' +
      'Ma vision d’un lead est d’avoir de la bienveillance, d’apporter une dynamique d’équipe, d’accompagner chaque individu, de débloquer des situation et de participer à l’amélioration continue.\n',
      'Mes axes d’interventions ont notamment été : ',
      '- Gestion des équipes techniques et fonctionnelles',
      '> Scaler l\'équipe de 4 à 30 personnes incluant 10 personnes issues d\'un rachat',
      '> Définir la stratégie de recrutement',
      '> Mise en place de process de recrutement selon les profils PO, SRE et Développeu·r·se·s',
      '> Mise en place de feature teams',
      '> Mise en place de cycles de formations interne ',
      '> Management des PO, UX, SRE et Développeu·r·se·s (environ 30 personnes)',
      '- Stratégie technique de la plate-forme et roadmap',
      '> Définir de la stratégie technique',
      '> Architecture logicielle de la plate-forme',
      '> Développement de la plate-forme',
      '> Industrialisation de la plate-forme: architecture, CI/CD, process, outils',
      '> Plan de sécurité notamment au niveau de notre brique d’authentification et architecture cloud (philosophie DevSecOps)',
      '> Définition et suivi de la roadmap',
      '- Mise en place du mindset des équipes',
      '> Software craftsmanship : maîtrise des bonnes pratiques de développement, mindset produit et softskills. Construction d’équipes de passionnés voulant toujours aller plus loin',
      '> Trunk based developments',
      '> Mises en prod régulières',
      '> Maintien en conditions opérationnelles',
      '> Amélioration continue',
      '> Partages de connaissances et formations sur la base de volontariat',
      'J’ai également eu l’occasion d’intrégrer une équipe technique suite au rachat de la société Labeo, éditeur de logiciel créé il y a une trentaine d’année. J’ai notamment : ',
      '- Géré l’intégration des équipes R&D et déconstruis les silos',
      '- Fais monter en compétences les équipes sur les mêmes pratiques et technos que les autres équipes',
      '- Mis en place une stratégie de refonte'
    ],
    tools: ['Kotlin & Java (JDK 17 et 21)','Spring Boot 3', 'Angular 15 à 18', 'NgRxStore', 'NodeJS', 'ExpressJs', 'GraphQL', 'Apollo Server', 'JGiven', 'MockK', 'Jasmine', 'Jest', 'Docker', 'Kubernetes', 'RabbitMQ', 'Kafka', 'AWS SQS/SNS', 'Jenkins', 'DDD', 'TDD', 'SOLID', 'architecture hexagonal', 'clean architecture', 'CQS', 'micro-services'],
  },
];

export const education = [
  {
    institution: 'Lorem Ipsum University',
    location: 'Lorem City',
    degree: 'BSc Lorem Ipsum',
    period: '2015 - 2019',
    achievements: [
      'President of Lorem Ipsum Club',
      'Organized multiple lorem events',
      'Represented university in national competitions.',
      'Graduated with honors.',
    ],
  },
];
export const skills = {
  programmingLanguages: [
    'LoremLang',
    'IpsumScript',
    'DolorLang',
    'SitLang',
    'AmetLang',
    'ConsecteturLang',
  ],
  frontendDevelopment: [
    'LoremJS',
    'IpsumJS',
    'Dolor Native',
    'Sit UI',
    'Amet CSS',
    'HTML',
    'CSS',
  ],
  backendDevelopment: ['LoremNode', 'IpsumExpress'],
  databaseAndStorage: ['LoremDB', 'IpsumORM'],
  cloudAndDevOps: ['LoremCloud'],
  toolsAndServices: [
    'LoremAuth',
    'IpsumCMS',
    'DolorAnalytics',
    'SitValidator',
    'AmetMonitor',
    'ConsecteturPanel',
    'AdipiscingTrigger',
  ],
};

export const projects = [
  {
    title: 'Lorem Ipsum Project',
    github: 'https://github.com/loremipsum/project',
    description: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco.',
      'Duis aute irure dolor in reprehenderit in voluptate velit esse.',
      'Excepteur sint occaecat cupidatat non proident.',
    ],
  },
  {
    title: 'Dolor Sit Amet App',
    github: 'https://github.com/loremipsum/dolorapp',
    description: [
      'Morbi in sem quis dui placerat ornare.',
      'Pellentesque odio nisi, euismod in, pharetra a, ultricies in, diam.',
      'Praesent dapibus, neque id cursus faucibus.',
      'Fusce feugiat malesuada odio.',
      'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices.',
    ],
  },
];

export const awards = [
  {
    name: 'Lorem Ipsum Award',
    issuer: 'Lorem Organization',
    date: 'Jan 2020',
    type: 'International',
    position: 'First Place',
  },
  {
    name: 'Dolor Sit Amet Prize',
    issuer: 'Ipsum Foundation',
    date: 'Feb 2021',
    type: 'National',
    position: 'Runner-up',
  },
  {
    name: 'Consectetur Hackathon',
    issuer: 'Adipiscing Org',
    date: 'Mar 2022',
    type: 'National',
    position: 'Winner',
  },
  {
    name: 'Vestibulum Event',
    issuer: 'Vestibulum College',
    date: 'Apr 2022',
    type: 'National',
    position: 'First Prize',
  },
  {
    name: 'Curabitur Hackfest',
    issuer: 'Curabitur Institute',
    date: 'May 2022',
    type: 'National',
    position: 'Second Prize',
  },
  {
    name: 'Praesent Hacks',
    issuer: 'Praesent Group',
    date: 'Jun 2022',
    type: 'National',
    position: 'Second Runner-up',
  },
  {
    name: 'Fusce Hack',
    issuer: 'Fusce Club',
    date: 'Jul 2022',
    type: 'National',
    position: 'Most Impactful Hack',
  },
];
