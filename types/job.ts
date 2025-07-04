export interface Job {
  id: number;
  title: string;
  description: string;
  number_of_labourers: number;
  required_skills?: string[];
  latitude: number;
  longitude: number;
  daily_wage: number;
  perks?: string[];
  start_date: string;
  end_date?: string;
  status: number;
  farmer_name?: string;
  created_at?: string;
  distance?: number;
}

export interface CreateJobRequest {
  title: string;
  description: string;
  number_of_labourers: number;
  required_skills?: string[];
  latitude: number;
  longitude: number;
  daily_wage: number;
  perks?: string[];
  start_date: string;
  end_date?: string;
}

export interface NearbyJobsRequest {
  latitude: number;
  longitude: number;
  k: number;
}