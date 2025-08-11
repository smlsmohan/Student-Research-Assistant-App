'use client';

import { useState } from 'react';
import { CordisProject } from '@/types/cordis';
import { formatCurrency, parsePipeValues, truncateText, getYearFromDate } from '@/lib/utils';
import { Calendar, MapPin, Building2, Euro, ExternalLink } from 'lucide-react';

interface ProjectCardProps {
  project: CordisProject;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [showAllDomains, setShowAllDomains] = useState(false);
  const [showAllTopics, setShowAllTopics] = useState(false);
  
  const organizations = parsePipeValues(project.org_names);
  const countries = parsePipeValues(project.org_countries);
  const countryNames = parsePipeValues(project.org_country_names); // Use full country names
  const topics = parsePipeValues(project.topics_desc);
  const roles = parsePipeValues(project.roles);
  const domains = parsePipeValues(project.euroscivoc_labels);
  const projectUrls = parsePipeValues(project.project_urls);

  const startYear = project.startdate ? getYearFromDate(project.startdate) : null;
  const endYear = project.enddate ? getYearFromDate(project.enddate) : null;

  // Display full country names if available, fallback to codes
  const displayCountries = countryNames.length > 0 ? countryNames : countries;

  // Check if project has valid URLs
  const hasValidUrl = projectUrls.length > 0 && projectUrls[0] && projectUrls[0].trim() !== '';

  const handleResearchDetails = () => {
    if (hasValidUrl) {
      window.open(projectUrls[0], '_blank', 'noopener,noreferrer');
    } else if (project.grantdoi) {
      window.open(`https://doi.org/${project.grantdoi}`, '_blank', 'noopener,noreferrer');
    } else {
      // Search for project by title and RCN
      const searchQuery = encodeURIComponent(`${project.title} ${project.rcn} CORDIS`);
      window.open(`https://www.google.com/search?q=${searchQuery}`, '_blank', 'noopener,noreferrer');
    }
  };

  const handleFindContacts = () => {
    // Parse contact information
    const contactForms = parsePipeValues(project.contact_forms || '');
    const organizationUrls = parsePipeValues(project.organization_urls || '');
    
    // Strategy 1: Direct contact forms
    if (contactForms.length > 0 && contactForms[0] && contactForms[0].trim() !== '') {
      window.open(contactForms[0], '_blank', 'noopener,noreferrer');
      return;
    }
    
    // Strategy 2: Organization URLs
    if (organizationUrls.length > 0 && organizationUrls[0] && organizationUrls[0].trim() !== '') {
      window.open(organizationUrls[0], '_blank', 'noopener,noreferrer');
      return;
    }
    
    // Strategy 3: DOI search for contact info
    if (project.grantdoi) {
      const doiUrl = `https://doi.org/${project.grantdoi}`;
      const confirmed = window.confirm(
        `No direct contact forms found. Would you like to:\n\n` +
        `1. Open the project DOI to find contact information?\n` +
        `2. Or search for "${project.acronym}" researchers online?\n\n` +
        `Click OK for DOI, Cancel for search.`
      );
      
      if (confirmed) {
        window.open(doiUrl, '_blank', 'noopener,noreferrer');
      } else {
        const searchQuery = encodeURIComponent(`${project.acronym} ${organizations[0] || ''} researchers contact`);
        window.open(`https://www.google.com/search?q=${searchQuery}`, '_blank', 'noopener,noreferrer');
      }
      return;
    }
    
    // Strategy 4: General search for project contacts
    const leadOrg = organizations[0] || '';
    const searchTerms = [project.acronym, project.title, leadOrg, 'contact', 'coordinator'].filter(Boolean);
    const searchQuery = encodeURIComponent(searchTerms.join(' '));
    
    const confirmed = window.confirm(
      `No direct contact information available. Would you like to search for:\n\n` +
      `"${project.acronym}" project contacts and coordinators?\n\n` +
      `This will search for researchers and contact information online.`
    );
    
    if (confirmed) {
      window.open(`https://www.google.com/search?q=${searchQuery}`, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="theme-card border theme-border rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-start justify-between mb-2">
          <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 warm:bg-amber-100 warm:text-amber-800">
            {project.frameworkprogramme}
          </span>
          <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
            project.status === 'SIGNED' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 warm:bg-green-100 warm:text-green-700' :
            project.status === 'CLOSED' ? 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 warm:bg-amber-50 warm:text-amber-700' :
            'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 warm:bg-red-100 warm:text-red-700'
          }`}>
            {project.status}
          </span>
        </div>
        
        <h3 className="text-lg font-bold theme-text mb-1">
          {project.acronym}
        </h3>
        
        <h4 className="text-sm font-medium text-muted-foreground mb-3">
          {truncateText(project.title, 100)}
        </h4>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
        {truncateText(project.objective, 150)}
      </p>

      {/* Key Info */}
      <div className="space-y-2 mb-4">
        {/* Duration */}
        {startYear && endYear && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{startYear} - {endYear}</span>
          </div>
        )}

        {/* Budget */}
        <div className="flex items-center text-sm text-muted-foreground">
          <Euro className="w-4 h-4 mr-2" />
          <span>{formatCurrency(project.ecmaxcontribution)}</span>
        </div>

        {/* Organizations */}
        {organizations.length > 0 && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Building2 className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">
              {organizations.slice(0, 2).join(', ')}
              {organizations.length > 2 && ` +${organizations.length - 2} more`}
            </span>
          </div>
        )}

        {/* Countries */}
        {displayCountries.length > 0 && (
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">
              {displayCountries.slice(0, 3).join(', ')}
              {displayCountries.length > 3 && ` +${displayCountries.length - 3} more`}
            </span>
          </div>
        )}
      </div>

      {/* Topics */}
      {topics.length > 0 && (
        <div className="mb-3">
          <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase">Research Topics</h4>
          <div className="flex flex-wrap gap-1">
            {(showAllTopics ? topics : topics.slice(0, 2)).map((topic, index) => (
              <span
                key={index}
                className="inline-block px-2 py-1 text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 warm:bg-purple-100 warm:text-purple-700 rounded"
              >
                {truncateText(topic, 30)}
              </span>
            ))}
            {topics.length > 2 && (
              <button
                onClick={() => setShowAllTopics(!showAllTopics)}
                className="inline-block px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-400 warm:bg-amber-100 warm:hover:bg-amber-200 warm:text-amber-700 rounded transition-colors cursor-pointer"
              >
                {showAllTopics ? 'Show less' : `+${topics.length - 2} more`}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Research Domains */}
      {domains.length > 0 && (
        <div className="mb-3">
          <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase">Research Domains</h4>
          <div className="flex flex-wrap gap-1">
            {(showAllDomains ? domains : domains.slice(0, 3)).map((domain, index) => (
              <span
                key={index}
                className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 warm:bg-green-100 warm:text-green-700 rounded"
              >
                {truncateText(domain, 25)}
              </span>
            ))}
            {domains.length > 3 && (
              <button
                onClick={() => setShowAllDomains(!showAllDomains)}
                className="inline-block px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-400 warm:bg-amber-100 warm:hover:bg-amber-200 warm:text-amber-700 rounded transition-colors cursor-pointer"
              >
                {showAllDomains ? 'Show less' : `+${domains.length - 3} more`}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Organization Roles */}
      {roles.length > 0 && (
        <div className="mb-4">
          <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase">Roles Available</h4>
          <div className="flex flex-wrap gap-1">
            {roles.slice(0, 3).map((role, index) => (
              <span
                key={index}
                className="inline-block px-2 py-1 text-xs bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 warm:bg-orange-100 warm:text-orange-700 rounded"
              >
                {role}
              </span>
            ))}
            {roles.length > 3 && (
              <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 warm:bg-amber-100 warm:text-amber-700 rounded">
                +{roles.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between items-center pt-4 border-t theme-border">
        <div className="flex gap-2">
          <button 
            onClick={handleResearchDetails}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 warm:text-amber-600 warm:hover:text-amber-800 text-sm font-medium hover:underline"
            title={hasValidUrl ? "View Official Project Page" : project.grantdoi ? "View DOI" : "Search for project details"}
          >
            Research Details
          </button>
          <button 
            onClick={handleFindContacts}
            className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 warm:text-green-600 warm:hover:text-green-800 text-sm font-medium hover:underline"
            title="Find contact information for project coordinators and participants"
          >
            Find Contacts
          </button>
        </div>
        <div className="flex items-center gap-2">
          {hasValidUrl && (
            <a
              href={projectUrls[0]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-accent transition-colors"
              title="View Official Project Page"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
