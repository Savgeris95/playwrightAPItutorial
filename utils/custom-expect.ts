import { expect as baseExpect } from '@playwright/test';
import { APILogger } from './logger';

let apiLogger: APILogger

export const getLogger = (logger: APILogger) => {
    apiLogger = logger
}

declare global{
    namespace PlaywrightTest {
        interface Matchers<R,T>{
            shouldEqual(expected: T): R
        }
    }
}

export const expect = baseExpect.extend({
    shouldEqual(received: any, expected: any) {
        const assertionName = 'shouldEqual';
        let pass: boolean;
        let logs = ''
        try {

            if (this.isNot) {
                baseExpect(received).not.toEqual(expected);
            } else {
                baseExpect(received).toEqual(expected);
            }
            pass = true;

        } catch (e: any) {
            pass = false;
            logs = apiLogger.getRecentLogs()
        }

        const hint = this.isNot ? 'not' : ''
        const message = () => {
            return    this.utils.matcherHint(assertionName, undefined, undefined, { isNot: this.isNot }) +
                '\n\n' +
                `Expected: ${hint} ${this.utils.printExpected(expected)}\n` +
                `Received: ${this.utils.printReceived(received)}\n\n`+
                `Recent API Log activity: ${logs}`
        }
                 
        return {
            message,
            pass
        }
            
    }
})