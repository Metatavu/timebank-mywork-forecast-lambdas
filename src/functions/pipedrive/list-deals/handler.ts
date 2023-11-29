
import { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { CreatePipedriveApiService, PipedriveApiService } from 'src/apis/pipedrive-api-service';


interface Response {
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

const listDeals = async (api: PipedriveApiService): Promise<Response[]> => {

    const deals = await api.getAllDeals();


    return deals.map(deal => {
        return{ 
            id: deal.id,
            title: deal.title,
            interested: deal.interested,
            value: deal.value,
            currency: deal.currency,
            add_time: deal.add_time,
            update_time: deal.update_time,
            next_activity_date: deal.next_activity_date,
            status: deal.status,
            next_activity_subject: deal.next_activity_subject,
            next_activity_note: deal.next_activity_note,
        }
    })
}

const listDealsHandler: ValidatedEventAPIGatewayProxyEvent<any> = async () => {
    const api = CreatePipedriveApiService();

    const deals = await listDeals(api);
    return{
        statusCode: 200,
        body: JSON.stringify(deals)
    };
}

export const main = middyfy(listDealsHandler);