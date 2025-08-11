# Copilot Instructions for CORDIS Research Explorer

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

This is a Next.js application that connects to a Supabase database containing CORDIS (European research project) data.

## Project Context
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL) with 79,069+ European research project records
- **Data Source**: CORDIS JSON dataset including projects from HORIZON, H2020, and FP7 programmes

## Database Schema
The `cordis_projects` table contains:
- **Core Info**: id, acronym, title, objective, status
- **Dates**: startdate, enddate, contentupdatedate  
- **Programme**: frameworkprogramme, legalbasis, mastercall, subcall, fundingscheme
- **Financial**: ecmaxcontribution, totalcost
- **Organizations**: org_names, roles, org_countries, cities (pipe-separated values)
- **URLs**: organization_urls, contact_forms, project_urls (pipe-separated values)
- **Topics**: topics_codes, topics_desc (pipe-separated values)
- **Classifications**: euroscivoc_labels, euroscivoc_codes
- **Technical**: rcn, grantdoi, programmesource

## Development Guidelines
1. Use TypeScript with proper type definitions for all CORDIS data
2. Implement responsive design with Tailwind CSS
3. Create reusable components for project cards, filters, and search
4. Handle pipe-separated values (|) for multi-value fields properly
5. Implement proper error handling for database queries
6. Use modern React patterns (hooks, context, etc.)
7. Follow Next.js best practices for performance and SEO
8. Create intuitive search and filtering capabilities
9. Display financial data in user-friendly formats (€ symbols, thousand separators)
10. Implement proper loading states and pagination for large datasets

## Key Features to Implement
- Project search and filtering by multiple criteria
- Framework programme visualization
- Organization and country analysis
- Financial data insights
- Topic and classification browsing
- Detailed project views with all metadata
- Responsive design for mobile and desktop
