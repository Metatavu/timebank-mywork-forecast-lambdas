import { Deal } from "./schemas/pipedrive/deal";
import { Lead } from "./schemas/pipedrive/lead";
import { Interest } from "./schemas/pipedrive/interest";
import { Project } from "./schemas/pipedrive/salesproject";
import Config from "../app/config";
import fetch from "node-fetch";

export interface PipedriveApiService {
    getAllLeads: () => Promise<Lead[]>;
    getAllDeals: () => Promise<Deal[]>;
    getAllDealsWon: () => Promise<Deal[]>;
    getDealById: (rowtype: string, id: string) => Promise<Project[]>;
    addDealInterestById: (id: string) => Promise<Interest[]>;
    addLeadInterestById: (id: string) => Promise<Interest[]>;
    removeDealInterestById: (id: string) => Promise<Interest[]>;
    removeLeadInterestById: (id: string) => Promise<Interest[]>;
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
          
          async getDealById(rowtype: string, id: string): Promise<Project[]> {
            const response = await fetch(`https://metatavu.pipedrive.com/api/v1/${rowtype}/?${id}&${apiKey}`);
            return response.json();
          },
          
          async addDealInterestById(id: string): Promise<Interest[]> {
            const response = await fetch(`https://metatavu.pipedrive.com/api/v1/deals/?${id}&${apiKey}`, {
              method: 'PUT'
            });
            return response.json();
          },
          
          async addLeadInterestById(id: string): Promise<Interest[]> {
            const response = await fetch(`https://metatavu.pipedrive.com/api/v1/leads/?${id}&${apiKey}`, {
              method: 'PATCH'
            });
            return response.json();
          },
          
          async removeDealInterestById(id: string): Promise<Interest[]> {
            const response = await fetch(`https://metatavu.pipedrive.com/api/v1/deals/?${id}&${apiKey}`, {
              method: 'PUT'
            });
            return response.json();
          },
          
          async removeLeadInterestById(id: string): Promise<Interest[]> {
            const response = await fetch(`https://metatavu.pipedrive.com/api/v1/leads/?${id}&${apiKey}`, {
              method: 'PATCH'
            });
            return response.json();
          }





    }



}