export interface Database {
  public: {
    Tables: {
      cordis_projects: {
        Row: {
          id: number;
          acronym: string | null;
          title: string | null;
          objective: string | null;
          status: string | null;
          startdate: string | null;
          enddate: string | null;
          contentupdatedate: string | null;
          frameworkprogramme: string | null;
          legalbasis: string | null;
          mastercall: string | null;
          subcall: string | null;
          fundingscheme: string | null;
          ecmaxcontribution: number | null;
          totalcost: number | null;
          org_names: string | null;
          roles: string | null;
          org_countries: string | null;
          cities: string | null;
          organization_urls: string | null;
          contact_forms: string | null;
          project_urls: string | null;
          topics_codes: string | null;
          topics_desc: string | null;
          euroscivoc_labels: string | null;
          euroscivoc_codes: string | null;
          rcn: number | null;
          grantdoi: string | null;
          programmesource: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          acronym?: string | null;
          title?: string | null;
          objective?: string | null;
          status?: string | null;
          startdate?: string | null;
          enddate?: string | null;
          contentupdatedate?: string | null;
          frameworkprogramme?: string | null;
          legalbasis?: string | null;
          mastercall?: string | null;
          subcall?: string | null;
          fundingscheme?: string | null;
          ecmaxcontribution?: number | null;
          totalcost?: number | null;
          org_names?: string | null;
          roles?: string | null;
          org_countries?: string | null;
          cities?: string | null;
          organization_urls?: string | null;
          contact_forms?: string | null;
          project_urls?: string | null;
          topics_codes?: string | null;
          topics_desc?: string | null;
          euroscivoc_labels?: string | null;
          euroscivoc_codes?: string | null;
          rcn?: number | null;
          grantdoi?: string | null;
          programmesource?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          acronym?: string | null;
          title?: string | null;
          objective?: string | null;
          status?: string | null;
          startdate?: string | null;
          enddate?: string | null;
          contentupdatedate?: string | null;
          frameworkprogramme?: string | null;
          legalbasis?: string | null;
          mastercall?: string | null;
          subcall?: string | null;
          fundingscheme?: string | null;
          ecmaxcontribution?: number | null;
          totalcost?: number | null;
          org_names?: string | null;
          roles?: string | null;
          org_countries?: string | null;
          cities?: string | null;
          organization_urls?: string | null;
          contact_forms?: string | null;
          project_urls?: string | null;
          topics_codes?: string | null;
          topics_desc?: string | null;
          euroscivoc_labels?: string | null;
          euroscivoc_codes?: string | null;
          rcn?: number | null;
          grantdoi?: string | null;
          programmesource?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          research_interests: string[] | null;
          institution: string | null;
          role: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          research_interests?: string[] | null;
          institution?: string | null;
          role?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          research_interests?: string[] | null;
          institution?: string | null;
          role?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_bookmarks: {
        Row: {
          id: string;
          user_id: string;
          project_id: number;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          project_id: number;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          project_id?: number;
          notes?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
