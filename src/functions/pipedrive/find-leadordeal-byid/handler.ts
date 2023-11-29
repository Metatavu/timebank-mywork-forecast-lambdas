import { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { CreatePipedriveApiService, PipedriveApiService } from 'src/apis/pipedrive-api-service';


interface Response {
    id: string;
    title: string;
    interested: string; // NOTE: Might need to be changed to pipedrive api item-key
    usedTech: string; // NOTE: Might need to be changed to pipedrive api item-key
    add_time: string;
    update_time: string;
    next_activity_date: string;
    status: string; // Added from Deal
    next_activity_subject?: string;
    next_activity_note?: string;
    value?: number; // Added from Deal
    currency?: string; // Added from Deal
    label_ids?: string[]; // Added from Lead
}

const getLeadOrDealById = async (api: PipedriveApiService, rowtype: string, id: string): Promise<Response[]> => {
    const leadOrDeal = await api.getLeadOrDealById(rowtype, id);

    return (leadOrDeal);    // Not sure if this is how to handle single object, but hey, let's try!

};

const getLeadOrDealByIdHandler: ValidatedEventAPIGatewayProxyEvent<any> = async (event) => {
    const { rowtype, id } = event.pathParameters;
    const api = CreatePipedriveApiService();
    const salesItem = await getLeadOrDealById(api, rowtype, id);

    return {
        statusCode: 200,
        body: JSON.stringify(salesItem)
    };
};

export const main = middyfy(getLeadOrDealByIdHandler);