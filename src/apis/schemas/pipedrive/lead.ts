export interface Lead {
    id: string;
    title: string;
    interested: string; // NOTE: Might need to be changed to pipedrive api item-key
    usedTech: string; // NOTE: Might need to be changed to pipedrive api item-key
    add_time: string; 
    update_time: string;
    next_activity_date: string;
    label_ids: string[];
  }