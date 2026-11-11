import { test as base } from '@playwright/test';
import { RequestHandler } from './request-handler';
import { APILogger } from './logger';
import { getLogger } from './custom-expect';
import { Authentication } from './authentication';


// Declare your options to type-check your configuration.
export type MyOptions = {
  api: RequestHandler;
};


// Specify both option and fixture types.
export const test = base.extend<MyOptions>({

  api: async ({ request }, use) => {

    //Take token
    const auth = new Authentication(request)
    const authToken = await auth.getToken()
    console.log(authToken)

    //Set base Url
    const defaultUrl = process.env.DEFAULT_URL

    const logger = new APILogger()
    getLogger(logger)

    const requestHandler = new RequestHandler(request, defaultUrl!, authToken, logger)
    await use(requestHandler);
  },

});

export { expect } from '@playwright/test';