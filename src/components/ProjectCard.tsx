'use client';

import { CordisProject } from '@/types/cordis';
import { formatCurrency, parsePipeValues, truncateText, getYearFromDate } from '@/lib/utils';
import { Calendar, MapPin, Building2, Euro, ExternalLink } from 'lucide-react';

interface ProjectCardProps {
  project: CordisProject;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const organizations = parsePipeValues(project.org_names);
  const countries = parsePipeValues(project.org_countries);
  const topics = parsePipeValues(project.topics_desc);

  const startYear = project.startdate ? getYearFromDate(project.startdate) : null;
  const endYear = project.enddate ? getYearFromDate(project.enddate) : null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-start justify-between mb-2">
          <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {project.frameworkprogramme}
          </span>
          <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
            project.status === 'SIGNED' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
            project.status === 'CLOSED' ? 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' :
            'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}>
            {project.status}
          </span>
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
          {project.acronym}
        </h3>
        
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          {truncateText(project.title, 100)}
        </h4>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
        {truncateText(project.objective, 150)}
      </p>

      {/* Key Info */}
      <div className="space-y-2 mb-4">
        {/* Duration */}
        {startYear && endYear && (
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{startYear} - {endYear}</span>
          </div>
        )}

        {/* Budget */}
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <Euro className="w-4 h-4 mr-2" />
          <span>{formatCurrency(project.ecmaxcontribution)}</span>
        </div>

        {/* Organizations */}
        {organizations.length > 0 && (
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Building2 className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">
              {organizations.slice(0, 2).join(', ')}
              {organizations.length > 2 && ` +${organizations.length - 2} more`}
            </span>
          </div>
        )}

        {/* Countries */}
        {countries.length > 0 && (
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">
              {countries.slice(0, 3).join(', ')}
              {countries.length > 3 && ` +${countries.length - 3} more`}
            </span>
          </div>
        )}
      </div>

      {/* Topics */}
      {topics.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {topics.slice(0, 2).map((topic, index) => (
              <span
                key={index}
                className="inline-block px-2 py-1 text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded"
              >
                {truncateText(topic, 30)}
              </span>
            ))}
            {topics.length > 2 && (
              <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 rounded">
                +{topics.length - 2} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
        <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
          View Details
        </button>
        {project.project_urls && (
          <a
            href={parsePipeValues(project.project_urls)[0]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
}
