
import { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { CreatePipedriveApiService, PipedriveApiService } from 'src/apis/pipedrive-api-service';

export interface AddInterestToLeadParameters {
    rowtype: string,
    uid: string,
    pid: string,
    existingInterest: string
}

interface Response {
    response: any;
}


const addInterestToLead = async (api: PipedriveApiService, param: AddInterestToLeadParameters): Promise<string> => {
    // Assuming the add operation was successful

    const newValue = param.uid + ";";
    let updatedInterested = "";

    if (param.existingInterest === null || param.existingInterest === "null" || param.existingInterest === "") {
      updatedInterested = newValue;
    }
    else {
      updatedInterested = param.existingInterest + newValue;
    }
  
    await api.addLeadInterestById(param.pid, updatedInterested );

    return 'Interest added successfully';
};



const addInterestToLeadHandler: ValidatedEventAPIGatewayProxyEvent<any> = async event => {
    const api = CreatePipedriveApiService();
    const getDataFromBody: AddInterestToLeadParameters = JSON.parse(JSON.stringify(event.body)) as AddInterestToLeadParameters;
    const deals = await addInterestToLead(api, getDataFromBody);
    return {
        statusCode: 200,
        body: deals     
    };
}

export const main = middyfy(addInterestToLeadHandler);