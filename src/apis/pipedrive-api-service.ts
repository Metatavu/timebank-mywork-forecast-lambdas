import { Deal } from "./schemas/pipedrive/deal";
import { Lead } from "./schemas/pipedrive/lead";
import { Interest } from "./schemas/pipedrive/interest";
import { LeadOrDeal } from "./schemas/pipedrive/leadordeal";
import Config from "../app/config";
import fetch from "node-fetch";

export interface PipedriveApiService {
    getAllLeads: () => Promise<Lead[]>;
    getAllDeals: () => Promise<Deal[]>;
    getAllDealsWon: () => Promise<Deal[]>;
    getLeadOrDealById: (rowtype: string, id: string) => Promise<LeadOrDeal[]>;
    addDealInterestById: (id: string, interest: string) => Promise<Interest[]>;
    addLeadInterestById: (id: string, interest: string) => Promise<Interest[]>;
    removeDealInterestById: (id: string, interest: string) => Promise<Interest[]>;
    removeLeadInterestById: (id: string, interest: string) => Promise<Interest[]>;
  }



export function CreatePipedriveApiService(): PipedriveApiService {
    const apiKey: string = Config.get().pipedriveApi.apiKey;

    return{
        
        
        async getAllLeads(): Promise<Lead[]> {
            const response = await fetch(`https://metatavu.pipedrive.com/api/v1/leads/?archived_status=not_archived&${apiKey}`);
            return response.json();
          },
          
          async getAllDeals(): Promise<Deal[]> {
            const response = await fetch(`https://metatavu.pipedrive.com/api/v1/deals/?${apiKey}`);
            return response.json();
          },
          
          async getAllDealsWon(): Promise<Deal[]> {
            const response = await fetch(`https://metatavu.pipedrive.com/api/v1/deals/?status='won'&${apiKey}`);
            return response.json();
          },
          
          async getLeadOrDealById(rowtype: string, id: string): Promise<LeadOrDeal[]> {
            const response = await fetch(`https://metatavu.pipedrive.com/api/v1/${rowtype}/?${id}&${apiKey}`);
            return response.json();
          },
          
          async addDealInterestById(id: string, interest: string): Promise<Interest[]> {
            const response = await fetch(`https://metatavu.pipedrive.com/api/v1/deals/?${id}&${apiKey}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: { "9f6a98bf5664693aa24a0e5473bef88e1fae3cb3": interest } // STRING IS THE VARIABLE KEY FOR INTEREST

            });
            return response.json();
          },
          
          async addLeadInterestById(id: string, interest: string): Promise<Interest[]> {
            const response = await fetch(`https://metatavu.pipedrive.com/api/v1/leads/?${id}&${apiKey}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              },
              body: { "9f6a98bf5664693aa24a0e5473bef88e1fae3cb3": interest } // STRING IS THE VARIABLE KEY FOR INTEREST

            });
            return response.json();
          },
          
          async removeDealInterestById(id: string, interest: string): Promise<Interest[]> {
            const response = await fetch(`https://metatavu.pipedrive.com/api/v1/deals/?${id}&${apiKey}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: { "9f6a98bf5664693aa24a0e5473bef88e1fae3cb3": interest } // STRING IS THE VARIABLE KEY FOR INTEREST

            });
            return response.json();
          },
          
          async removeLeadInterestById(id: string, interest: string): Promise<Interest[]> {
            const response = await fetch(`https://metatavu.pipedrive.com/api/v1/leads/?${id}&${apiKey}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              },
              body: { "9f6a98bf5664693aa24a0e5473bef88e1fae3cb3": interest } // STRING IS THE VARIABLE KEY FOR INTEREST

            });
            return response.json();
          }





    }



}