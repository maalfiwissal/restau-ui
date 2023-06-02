import axios from 'axios';

const RESTAU_API_BASE_URL = "https://restau-api.onrender.com/restaurants";

class RestaurantService {

    getRestaurants () {
        return axios.get(RESTAU_API_BASE_URL)
    }

    reserver(restau, dateReservation) {
        return axios.post(`${RESTAU_API_BASE_URL}/reserver/restau/${restau.id}/user/
        ${localStorage.getItem('id')}`, {dateReservation: dateReservation})
    }

    getReservations() {
        return axios.get(`${RESTAU_API_BASE_URL}/reservations/user/${localStorage.getItem('id')}`);
    }

    annulerReservation(idReservation) {
        return axios.delete(`${RESTAU_API_BASE_URL}/reservation/${idReservation}`);
    }
}

export default new RestaurantService()