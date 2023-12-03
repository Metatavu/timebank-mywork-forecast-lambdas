import { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { CreatePipedriveApiService, PipedriveApiService } from 'src/apis/pipedrive-api-service';

export interface AddInterestToDealParameters {
    rowtype: string,
    uid: string,
    pid: string,
    existingInterest: string
}

interface Response {
    response: any;
}


const addInterestToDeal = async (api: PipedriveApiService, param: AddInterestToDealParameters): Promise<string> => {
    // Assuming the add operation was successful

    const newValue = param.uid + ";";
    let updatedInterested = "";

    if (param.existingInterest === null || param.existingInterest === "null" || param.existingInterest === "") {
      updatedInterested = newValue;
    }
    else {
      updatedInterested = param.existingInterest + newValue;
    }
  
    await api.addDealInterestById( param.pid, updatedInterested );

    return 'Interest added successfully';
};

const addInterestToDealHandler: ValidatedEventAPIGatewayProxyEvent<any> = async event => {
    const api = CreatePipedriveApiService();
    const getDataFromBody: AddInterestToDealParameters = JSON.parse(JSON.stringify(event.body)) as AddInterestToDealParameters;
    const res = await addInterestToDeal(api, getDataFromBody);
    
    return {
        statusCode: 200,
        body: res     
    };
}

export const main = middyfy(addInterestToDealHandler);