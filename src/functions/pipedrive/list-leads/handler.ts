import { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { CreatePipedriveApiService, PipedriveApiService } from 'src/apis/pipedrive-api-service';

interface Response {
    id: string;
    title: string;
    interested: string;
    add_time: string; 
    update_time: string;
    next_activity_date: string;
    label_ids: string[];
}

const listLeads = async (api: PipedriveApiService): Promise<Response[]> => {

    const leads = await api.getAllLeads();

    return leads.map(lead => {
        return { 
            id: lead.id,
            title: lead.title,
            interested: lead.interested,
            add_time: lead.add_time,
            update_time: lead.update_time,
            next_activity_date: lead.next_activity_date,
            label_ids: lead.label_ids
        }
    })
}

const listLeadsHandler: ValidatedEventAPIGatewayProxyEvent<any> = async () => {
    
    const api = CreatePipedriveApiService();
    const leads = await listLeads(api);

    return {
        statusCode: 200,
        body: JSON.stringify(leads)
    };
}

export const main = middyfy(listLeadsHandler);