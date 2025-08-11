// Fallback data for when Supabase is unavailable
export const fallbackProjects = [
  {
    id: '1',
    title: 'AI for Sustainable Development',
    acronym: 'AI4SD',
    objective: 'Developing AI solutions for sustainable development goals in European cities.',
    frameworkprogramme: 'HORIZON EUROPE',
    status: 'SIGNED',
    startdate: '2023-01-01',
    enddate: '2025-12-31',
    ecmaxcontribution: 1500000,
    totalcost: 2000000,
    org_names: 'Technical University of Munich|University of Cambridge|INRIA',
    org_countries: 'Germany|United Kingdom|France',
    roles: 'coordinator|participant|participant',
    euroscivoc_labels: 'artificial intelligence|sustainability|smart cities',
    contentupdatedate: '2024-01-15'
  },
  {
    id: '2',
    title: 'Climate Change Adaptation in Coastal Areas',
    acronym: 'COAST-ADAPT',
    objective: 'Research on climate adaptation strategies for European coastal regions.',
    frameworkprogramme: 'HORIZON EUROPE',
    status: 'SIGNED',
    startdate: '2022-09-01',
    enddate: '2025-08-31',
    ecmaxcontribution: 3200000,
    totalcost: 4000000,
    org_names: 'University of Copenhagen|CNR|University of Porto',
    org_countries: 'Denmark|Italy|Portugal',
    roles: 'coordinator|participant|participant',
    euroscivoc_labels: 'climate change|coastal management|adaptation',
    contentupdatedate: '2024-02-10'
  },
  {
    id: '3',
    title: 'Digital Health Innovation Network',
    acronym: 'DHIN',
    objective: 'Building a European network for digital health innovation and telemedicine.',
    frameworkprogramme: 'HORIZON EUROPE',
    status: 'SIGNED',
    startdate: '2023-06-01',
    enddate: '2026-05-31',
    ecmaxcontribution: 850000,
    totalcost: 1200000,
    org_names: 'Karolinska Institute|University of Oxford|Charité Berlin',
    org_countries: 'Sweden|United Kingdom|Germany',
    roles: 'coordinator|participant|participant',
    euroscivoc_labels: 'digital health|telemedicine|healthcare innovation',
    contentupdatedate: '2024-03-05'
  }
];

export const fallbackStats = {
  totalProjects: 79069,
  totalFunding: '€45.2B',
  activeProjects: 12847,
  countries: 27
};
