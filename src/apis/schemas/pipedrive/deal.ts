export interface Deal {
    id: string;
    title: string;
    interested: string;
    value: number;
    currency: string;
    add_time: string; 
    update_time: string; 
    next_activity_date: string; 
    status: string;
    next_activity_subject?: string;
    next_activity_note?: string;
  }