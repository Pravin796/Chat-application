import { Axios } from "./AxiosHelper";

export const createRoomApi = async (roomDetail) => {
    const response = await Axios.post('/createroom', roomDetail, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
};

export const joinRoomApi = async (roomId) => {
    const response = await Axios.get(`/${roomId}`);
    return response.data;
};
