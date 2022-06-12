import axios from "axios";
import PayJobBtn from "./components/PayJobBtn";

const instance = axios.create({
    baseURL: "http://localhost:3001",
    timeout: 1000,
    //headers: {'X-Custom-Header': 'foobar'}
});

const defaultRequestOptions = {
    headers: {
        'profile_id' : null,
    }
}
const api = {
    get(url, customAxiosOptions = {}){
        return instance.get(url, {
            ...defaultRequestOptions,
            ...customAxiosOptions
        }).then(res => res.data);
    },
    post(url, data = {}, customAxiosOptions = {}){
        return instance.post(url, data, {
            ...defaultRequestOptions,
            ...customAxiosOptions
        }).then(res => res.data);
    },
    /**
     * Get's current user's profile data
     */
    getProfile(){
        return this.get(`/profiles/${defaultRequestOptions.headers.profile_id}`);
    },
    setAuth(profileId){
        console.log("Setting new token: ", profileId);
        defaultRequestOptions.headers.profile_id = profileId;
    },
    getUsers(){
        return this.get('/profiles');
    },
    getContracts(){
        return this.get('/contracts?include=Contractor,Client');
    },
    getJobs(){
        return this.get('/jobs');
    },
    deposit(ammount, userId = null){
        return this.post(
            `/balances/deposit/${userId || defaultRequestOptions.headers.profile_id}`,
            {
                ammount
            }
        );
    },
    payJob(id){
        return this.post(`/jobs/${id}/pay`);
    }
}

export default api;