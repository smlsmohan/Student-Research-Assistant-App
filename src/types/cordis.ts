export interface CordisProject {
  id: string;
  acronym: string;
  title: string;
  objective: string;
  status: string;
  startdate: string;
  enddate: string;
  contentupdatedate: string;
  frameworkprogramme: string;
  legalbasis: string;
  mastercall: string;
  subcall: string;
  fundingscheme: string;
  ecmaxcontribution: number;
  totalcost: number;
  org_names: string;
  roles: string;
  org_countries: string;
  org_country_names: string; // New column for full country names
  cities: string;
  organization_urls: string;
  contact_forms: string;
  project_urls: string;
  topics_codes: string;
  topics_desc: string;
  euroscivoc_labels: string; // Updated column for domain search
  euroscivoc_codes: string;
  rcn: string;
  grantdoi: string;
  programmesource: string;
}

export interface SearchFilters {
  query?: string;
  frameworkProgramme?: string;
  country?: string;
  role?: string; // New filter for roles
  domain?: string; // New filter for research domains using euroscivoc_labels
  status?: string;
  minBudget?: number;
  maxBudget?: number;
  startYear?: number;
  endYear?: number;
}

export interface ProjectStats {
  totalProjects: number;
  totalBudget: number;
  averageBudget: number;
  frameworkDistribution: Record<string, number>;
  countryDistribution: Record<string, number>;
  statusDistribution: Record<string, number>;
}
