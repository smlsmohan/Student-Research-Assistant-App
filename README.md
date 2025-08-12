# CORDIS Research Explorer

A modern Next.js web application for exploring European research and innovation projects from the CORDIS database. This application provides an intuitive interface to search, filter, and analyze 79,069+ research projects from HORIZON, H2020, and FP7 programmes.

## 🌟 Features

- **Comprehensive Search**: Search projects by title, description, acronym, and other metadata
- **Advanced Filtering**: Filter by framework programme, country, status, budget range, and time period
- **Rich Visualizations**: Interactive stats and charts showing funding distribution and project metrics
- **Project Details**: Detailed project cards with organization info, funding details, and topic classifications
- **Responsive Design**: Modern, mobile-friendly interface built with Tailwind CSS
- **Real-time Data**: Connected to live Supabase database with latest CORDIS data

## 🏗️ Tech Stack

- **Frontend**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **UI Components**: Headless UI

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- CORDIS data loaded in Supabase (see ETL pipeline in parent directory)

### Installation

1. **Clone and install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   ```
   
   Then edit `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 Database Schema

The application expects a `cordis_projects` table with the following structure:

```sql
- id (text, primary key)
- acronym (text)
- title (text)
- objective (text)
- status (text)
- startdate (date)
- enddate (date)
- contentupdatedate (date)
- frameworkprogramme (text)
- legalbasis (text)
- mastercall (text)
- subcall (text)
- fundingscheme (text)
- ecmaxcontribution (numeric)
- totalcost (numeric)
- org_names (text) -- pipe-separated values
- roles (text) -- pipe-separated values
- org_countries (text) -- pipe-separated values
- cities (text) -- pipe-separated values
- organization_urls (text) -- pipe-separated values
- contact_forms (text) -- pipe-separated values
- project_urls (text) -- pipe-separated values
- topics_codes (text) -- pipe-separated values
- topics_desc (text) -- pipe-separated values
- euroscivoc_labels (text) -- pipe-separated values
- euroscivoc_codes (text) -- pipe-separated values
- rcn (text)
- grantdoi (text)
- programmesource (text)
```

## 🎯 Key Components

- **ProjectsSearchView**: Main search interface with filters and pagination
- **ProjectCard**: Individual project display component
- **ProjectStats**: Dashboard with funding and distribution statistics
- **SearchInput**: Search functionality with real-time filtering
- **FilterPanel**: Advanced filtering controls

## 🌍 Data Source

This application uses data from [CORDIS](https://cordis.europa.eu/), the European Commission's primary source of results from EU-funded research projects. The data includes:

- **79,069+** research projects
- **HORIZON Europe** (2021-2027)
- **Horizon 2020** (2014-2020)
- **FP7** (2007-2013)
- Project metadata, funding details, organizations, and topics

## 📈 Performance

- Server-side rendering with Next.js App Router
- Optimized database queries with pagination
- Responsive design for all device sizes
- Efficient data loading with Supabase

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- European Commission for providing CORDIS data
- Supabase for the database platform
- Next.js team for the excellent framework
- All contributors to the open-source libraries used
# Deployment Fix - Tue Aug 12 16:42:59 IST 2025
