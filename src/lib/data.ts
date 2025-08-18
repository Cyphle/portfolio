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
      'Lite propose une plate-forme pour les particuliers et les pros permettant de suivre sa consommation énergétique d’électricité ainsi que des leviers pour effectuer des économies dans sa consommation.',
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
    tools: ['Kotlin & Java (JDK 17 et 21)', 'Spring Boot 3', 'Angular 15 à 18', 'NgRxStore', 'NodeJS', 'ExpressJs', 'GraphQL', 'Apollo Server', 'JGiven', 'MockK', 'Jasmine', 'Jest', 'Docker', 'Kubernetes', 'RabbitMQ', 'Kafka', 'AWS SQS/SNS', 'Jenkins', 'DDD', 'TDD', 'SOLID', 'architecture hexagonal', 'clean architecture', 'CQS', 'micro-services'],
  },
  {
    company: 'Stonal',
    location: 'Paris, France',
    position: 'Développeur Full Stack',
    period: 'Déc 2019 - Juin 2021',
    achievements: [
      'En arrivant au sein de Stonal, j’ai eu le rôle de Tech Lead. Mes missions ont été',
      '- Le développement de la plate-forme',
      '- La mise en place de l\'architecture de la plate-forme ainsi qu\'un sein des différents services back et front',
      '- La mise en place d\'un mindset autour du Software Craftsmanship et DevOps',
      '- L\'industrialisation de la plate-forme via la mise en place d\'outils tels que Jenkins et Kibana ainsi que de flux de travail comme les mises en production régulières',
      '- La mise en place de l\'équipe ainsi que les critères de recrutements de développeurs',
      '- La formation des PO à des techniques de conception comme l\'Event Storming',
    ],
    tools: ['Kotlin & Java', 'Spring Boot 2', 'Angular', 'NgRxStore', 'Docker', 'Kubernetes', 'Rancher', 'Kafka', 'Jenkins', 'DDD', 'TDD', 'SOLID', 'Clean code', 'architecture hexagonal', 'CQS', 'micro-services', 'Agile Scrum'],
  },
  {
    company: 'Société Général CIB pour le compte de La Combe Du Lion Vert',
    location: 'Paris, France',
    position: 'Développeur Full Stack',
    period: 'Août 2017 - Nov 2019',
    achievements: [
      'Développeur full stack pour La Combe Du Lion Vert, j\'ai été missionné au sein de la Société Générale Corporate and Investment Banking.',
      'J\'ai intégré une des 8 feature teams d\'une plate-forme visant la création d’un logiciel de financement professionnel.',
      'Au sein de la SGCIB, mes tâches ont été :' +
      '- Le développement de plusieurs microservices back en Java et Kotlin avec Spring 1.5 et 2 et Axon ainsi qu’en NodeJS avec Express',
      '- Le développement de plusieurs front-end en Javascript et Typescript sous AngularJS 1.5, Angular 5 et 6 avec NgRxStore et ReactJS avec Redux',
      '- Le testing avec Junit, Mockito, Mocha, Chai, Karma, Jasmine, Jest, JGiven, Cucumber',
      '- La mise en place de communications entre services via RabbitMQ et REST API',
      '- Le stockage des données dans une base Oracle et ElasticSearch',
      '- Le logging avec Kibana, Logstach et Zipkin',
      '- La gestion des sources avec Git et package managing avec Maven et NPM',
      '- Le déploiements sous Docker Swarm',
      '- La CI avec Jenkins',
      '- La mise en place des architectures Hexagonale, Event Sourcing, CQRS, Lambda Core (Programmation Fonctionnelle), Redux',
      'L\'ensemble des développements a été effectué en plaçant la logique métier en premier grâce au DDD et au BDD. La robustesse et la qualité des développements ont été assurés grâce aux bonnes pratiques comme le TDD, le clean code et les principes SOLID.',
      'Les projets ont été effectués avec la méthodologie Scrum puis Kanban. J\'ai également eu l\'occasion de faire du coaching au sein d’équipes sur des problématiques d’architecture et de bonnes pratiques ainsi qu\'auprès de juniors.'
    ],
    tools: ['Java 8', 'Kotlin', 'Spring Boot 1 et 2', 'AngularJS', 'React', 'NodeJS', 'JUnit', 'MockK', 'Jasmine', 'Jest'],
  },
  {
    company: 'BNP Paris Real Estate pour le compte d\'Extia',
    location: 'Paris, France',
    position: 'Chef de projet technico fonctionnel',
    period: 'Déc 2015 - Jui 2017',
    achievements: [
      'Employé au sein d\'Extia, je suis intervenu chez BNP Paribas Real Estate. Ma mission m\'a permis d\'avoir la double casquette de développeur et chef de projet au sein de l\'équipe en charge de sites vitrines et sites de vente/location de bureaux.',
      'Mes tâches ont été :',
      '- L\'analyse du besoin, la conception technique, la gestion de projet (cadrage, estimation de charge) et le développement d’un outil de ticketing en PHP sous Symfony2 ainsi que d’un générateur de site en PHP et Javascript',
      '- Le testing avec PHPUnit et Karma/Jasmine',
      '- La mise en place d’une usine logicielle pour sites statiques sous Docker (Openshift) avec Jenkins, SonarQube, Gitlab, PHPUnit et Selenium',
      '- La gestion de nouveaux sites statiques et de vente',
      '- La coordination et planification',
      '- Le recrutement de prestataires et membres de l’équipe',
      '- La direction de projet et la gestion de la relation avec la DSI',
    ],
    tools: ['PHP', 'MySQL'],
  },
  {
    company: 'LMC',
    location: 'Paris, France',
    position: 'Chef de projet & développeur',
    period: 'Fév 2015 - Nov 2015',
    achievements: [
      'Au sein de l\'agence web LMC, j\'ai eu la double casquette développeur et chef de projet. Mes tâches ont été :',
      '- Le développement d’une application sous AngularJS et Ionic pour l\'Observatoire des Loyer Parisiens',
      '- Le éveloppement d’une carte des piscines française en Javascript pour la Fédération Française de Natation',
      'La gestion de projet (analyse du besoin, conception technico-fonctionnelle, estimation de charge, planification, gestion de la relation client) pour des sites vitrines et applications web (site eLearning pour Darty, site de vente en gros pour Avesta)',
      '- Le pilotage d’équipes de développement',
      'Au sein de LMC, j\'ai également eu l\'occasion de sensibiliser l\'entreprise aux pratiques Agile Scrum en mettant en place une transition Agile (plan de transition, formations, gestion du changement) et donnant des formations sur ces pratiques.'
    ],
    tools: ['AngularJS', 'Ionic'],
  },
  {
    company: 'Sanofi',
    location: 'Paris, France',
    position: 'Architecte SAP pour le compte d\'Accenture',
    period: 'Fév 2012 - Jan 2015',
    achievements: [
      'Employé en tant qu\'architecte technologique sur des sujets ERP SAP pour Accenture, j\'ai été missionné au sein de Sanofi sur des problématiques de portails applicatifs.',
      'Mes tâches ont été :',
      '- Le développement d’un outil de synchronisation d’autorisations en Javascript, PHP',
      '- La mise en place de communication SOAP',
      '- La gestion de portail application (mise en place d’évolutions, de montées de version) sous SAP sur stack JEE',
      '- Etre consultant sur des problématiques d’architecture SI',
      '- La gestion de l’intégration des différentes applications',
      '- Le pilotage d’équipes inshore et offshore',
      '- La gestion du changement',
      '- L\'analyse du besoin, ateliers de définition du besoin',
      '- La conception fonctionnelle et conception d’architectures SAP',
      '- La définition de schémas d’autorisation',
      '- La gestion de déploiements internationaux',
    ],
    tools: ['SAP Netweaver Portal'],
  },
  {
    company: 'Klee Group',
    location: 'Paris, France',
    position: 'Développeur C++',
    period: 'Sep 2011 - Jan 2012',
    achievements: [
      'Klee commercialise un outil permettant entre autres de faire du reporting pour la grande distribution (par exemple, fournir des statistiques de présence en rayon).',
      'Mes principales missions ont été de :',
      '- Développer des évolutions pour l\'application de reporting',
      '- Développer un logiciel de récupération de photos géolocalisées permettant de faire des statistiques de présence géographique',
      '- Environnement C++ et MySQL sur VisualStudio\n',
    ],
    tools: ['C+++', 'MySQL', 'Visual Studio'],
  },
];

export const education = [
  {
    institution: 'Mines De Nantes',
    location: 'Nantes, France',
    degree: 'Ingénieur Automatique et Informatique Industrielle',
    period: '2008 - 2011',
    achievements: [
      'Projet de robot téléopéré entre la France et les USA avec des Lego Mindstorm.'
    ],
  },
];
export const skills = {
  programmingLanguages: [
    'Kotlin', 'Java', 'Javascript', 'TypeScript', 'Python', 'Rust', 'Go', 'HTML/CSS'
  ],
  frontendDevelopment: [
    'Angular',
    'React',
    'D3js',
    'Redux',
    'NgRxStore',
  ],
  backendDevelopment: ['Spring', 'Axon', 'Fastify', 'Express', 'ApolloServer', 'NodeJS', 'Actix'],
  testing: ['Junit', 'MockK', 'Mockito', 'Jest', 'Jasmine', 'Pytest', 'JGiven', 'Cucumber'],
  databaseAndStorage: ['PostgreSQL', 'MongoDB', 'Hibernate', 'JOOQ', 'SeaORM'],
  cloudAndDevOps: ['AWS', 'Scaleway', 'Terraform'],
  toolsAndServices: [
    'Docker', 'Kubernetes', 'GitHub Actions', 'Jenkins', 'Keycloak', 'OAuth2', 'OIDC', 'Kafka', 'RabbitMQ', 'Kibana', 'Grafana'
  ],
  architecturesAndPatterns: [
    'Microservices',
    'Event Sourcing',
    'CQRS',
    'Architecture hexagonale',
    'Domain-Driven Design (DDD)',
    'Clean Architecture',
    'Trunk Based Development',
    'Lambda Core',
    'TDD',
    'BDD',
  ],
  others: [
    'Gestion d\'équipe',
    'Stratégie technique',
    'Organisation d\'équipes'
  ]
};

export const projects = [
  {
    title: 'Banana',
    github: 'https://github.com/Cyphle/banana-back',
    description: [
      'Gestionnaire de comptes bancaires et de dépenses personnelles.',
      'More to come...',
    ],
  },
  {
    title: 'Navigator',
    github: 'https://github.com/Cyphle/navigator-back',
    description: [
      'Pour la vie de tous les jours, un navigateur qui t\'accompgne',
      'More to come...',
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
