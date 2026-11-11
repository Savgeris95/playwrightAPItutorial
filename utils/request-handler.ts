import { APIRequestContext, expect } from "@playwright/test"
import { APILogger } from "./logger"

export class RequestHandler {

    private baseUrl?: string
    private defaultUrl: string
    private apiPath: string = ''
    private queryParams: object = {}
    private apiHeaders: object = {}
    private apiBody: object = {}
    private request: APIRequestContext
    private authToken: string
    private logger: APILogger



    constructor(request: APIRequestContext, defaultUrl: string, authToken: string,logger: APILogger) {
        this.request = request
        this.defaultUrl = defaultUrl
        this.authToken = authToken
        this.logger = logger
    }

    url(url: string) {
        this.baseUrl = url
        return this
    }

    path(path: string) {
        this.apiPath = path
        return this
    }

    params(queryParams: object) {
        this.queryParams = queryParams
        return this
    }

    headers(headers: object) {
        this.apiHeaders = headers
        return this
    }

    body(body: object) {
        this.apiBody = body
        return this
    }

    async getRequest(expectedStatusCode: number) {
        const url = this.getUrl()
        this.logger.logRequest('GET',url,this.headers)
        const response = await this.request.get(url, {
            headers: { Authorization: this.authToken }
        })

        const actualStatusCode = response.status()
        this.logger.logResponse(actualStatusCode,await response.json())
        this.statusCodeValidator(actualStatusCode,expectedStatusCode,this.getRequest)
        this.cleanUpFields()
        return response.json()
    }

    async postRequest(expectedStatusCode: number) {
        const url = this.getUrl()
        this.logger.logRequest('POST',url,this.headers,this.apiBody)
        const response = await this.request.post(url, { data: this.apiBody, headers: { Authorization: this.authToken } })

        const actualStatusCode =  response.status()
        this.logger.logResponse(actualStatusCode,await response.json())

        this.statusCodeValidator(actualStatusCode,expectedStatusCode,this.postRequest)
        this.cleanUpFields()
        return response.json()
    }

    async deleteRequest(expectedStatusCode: number) {
        const url = this.getUrl()
        this.logger.logRequest('POST',url,this.headers,this.apiBody)
        const response = await this.request.delete(url, { headers: { Authorization: this.authToken } })

        const actualStatusCode =  response.status()
        this.logger.logResponse(actualStatusCode)

        this.statusCodeValidator(actualStatusCode,expectedStatusCode,this.deleteRequest)
        this.cleanUpFields()
    }

    async updateRequest(expectedStatusCode: number, slugId: number) {

        const url = this.getUrl()
        this.logger.logRequest('POST',url,this.headers,this.apiBody)
        const response = await this.request.put(`${url}/${slugId}`, { data: this.apiBody, headers: { Authorization: this.authToken } })

        const actualStatusCode =  response.status()
        this.logger.logResponse(actualStatusCode,await response.json())

        this.statusCodeValidator(actualStatusCode,expectedStatusCode,this.updateRequest)
        this.cleanUpFields()
        return response.json()
    }

    private getUrl() {
        const url = new URL(`${this.baseUrl ?? this.defaultUrl}${this.apiPath}`)

        for (const [key, value] of Object.entries(this.queryParams)) {
            url.searchParams.append(key, value)
        }

        return url.toString()
    }

    private statusCodeValidator(actualStatusCode: number, expectedStatusCode:number, callingFunction: Function){
        if(actualStatusCode != expectedStatusCode){
            const logs = this.logger.getRecentLogs()
            const error = new Error(`Expected status code ${expectedStatusCode} but got ${actualStatusCode}\n Recent Logs activity \n ${logs}`)
            Error.captureStackTrace(error,callingFunction)
            throw error
        }
    }

    private cleanUpFields() {
        this.apiPath = ''
        this.queryParams = {}
        this.apiHeaders = {}
        this.apiBody = {}
    }
}