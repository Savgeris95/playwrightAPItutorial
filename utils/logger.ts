export class APILogger{
    private recentLogs: any[] = []

    logRequest(method: string, url: string, headers: object, body?: object){
        const logEntry = {method,url,headers,body}
        this.recentLogs.push({type:'Request Details', data: logEntry})
    }

    logResponse(statusCode:number, responseBody?: object){
        const logEntry = {statusCode, responseBody}
        this.recentLogs.push({type:'Request Response', data: logEntry})
    }

    getRecentLogs(){
        const logs = this.recentLogs.map(log => {
            return `===${log.type}=== \n \n ${JSON.stringify(log.data,null,4)}`
        }).join("\n\n")
        return logs
    }

}