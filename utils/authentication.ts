import { APIRequestContext } from "@playwright/test"


export class Authentication {

    private request: APIRequestContext

    constructor(request: APIRequestContext){
        this.request = request
    }

    async getToken(): Promise<string> {
        const loginResponse = await this.request.post('https://conduit-api.bondaracademy.com/api/users/login', {
            data: { "user": { "email": process.env.EMAIL, "password": process.env.PASSWORD } }
        })
        const loginResponseJSON = await loginResponse.json()
        const authToken = `Token ${loginResponseJSON.user.token}`

        if(!loginResponse.ok()){
            throw new Error ('Login failed with status: ' + loginResponse.status())
        }

        return authToken
    }
}