import axios from "axios"

export class AxiosProvider {
    static async communication(method, path = "", body) {
        try {
            const options = {
                method: method,
                url: `http://localhost:3001/products${path}`,
                headers: {
                    'Content-Type': 'application/json',
                },
                data: body
            };
            return axios.request(options)
        } catch (err) {
            return err.response
        }
    }
}