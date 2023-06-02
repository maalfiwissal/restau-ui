import { DirectionsRenderer, GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";
import LoginService from "../services/LoginService";

const { useMemo, useState, useEffect } = require("react");
const { default: RestaurantService } = require("../services/RestaurantService");
const { default: React } = require("react");

const Restaurants = () => {

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: 'AIzaSyCp4Er17i7r-8PdEN8SKH41Yd5W9zSMT7c',
      });
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [auth, setAuth] = useState(false)  
    const [restaurants, setRestaurants] = useState([]);
    const [currentLocation, setCurrentLocation] = useState({lat: 31.65701691499339, lng: -8.022952839649317})
    const [center, setCenter] = useState({ lat: 31.65701691499339, lng: -8.022952839649317 })
    const [zoom, setZoom] = useState(20);
    const [reservation, setReservation] = useState(0);
    const [loginError, setLoginError] = useState('')
    const [dateReservation, setDateReservation] = useState('');
    const [reservationError, setReservationError] = useState('');
    const [reservations, setReservations] = useState([]);
    const [screen, setScreen] = useState('restaurants');
    const [directions, setDirectionss] = useState(null);

    // useEffect(() => {
    //     RestaurantService.getRestaurants().then((res) => {
    //         setRestaurants(res.data);
    //     });

    //     RestaurantService.getReservations().then((res) => {
    //         console.log(res.data)
    //         setReservations(res.data);
    //     })
    // }, [])

    const login = () => {
        LoginService.authenticate(email, password).then(res => {
            if(res.data !== "") {
                RestaurantService.getRestaurants().then((res) => {
                    setRestaurants(res.data);
                });
                RestaurantService.getReservations().then((res) => {
                    setReservations(res.data);
                })
                setLoginError('')
                localStorage.setItem('nom', res.data.nom);
                localStorage.setItem('id', res.data.id);
                setAuth(true);
            }
            setLoginError('authentification échouée!')
        })
    }

    const logout = () => {
        setLoginError('')
        localStorage.removeItem('nom');
        localStorage.removeItem('id');
        setAuth(false);
    }

    const changeLocation = (lat, lng) => {
        let currentLat;
        let currentLng;

        setZoom(25);
        setCurrentLocation({lat: Number(lat), lng: Number(lng)});
        setCenter({lat: Number(lat), lng: Number(lng)});
        const DirectionsService = new window.google.maps.DirectionsService();
        navigator.geolocation.getCurrentPosition(function(position) {
            currentLat = position.coords.latitude;
            currentLng = position.coords.longitude;
          });

        DirectionsService.route({
            origin: new window.google.maps.LatLng(currentLat, currentLng),
            destination: new window.google.maps.LatLng(currentLocation.lat, currentLocation.lng),
            travelMode: window.google.maps.TravelMode.DRIVING
        },(result, status) => {
            if (status === window.google.maps.DirectionsStatus.OK) {
                setDirectionss(result);
            }
        })


    }

    const reserver = (restau) => {
        setReservation(restau);
    }
    const envoyerReservation = () => {
        RestaurantService.reserver(reservation, dateReservation).then(res => {
            setReservations([...reservations, res.data])
            setReservation(0);
        }, error => {
            setReservationError('Erreur lors de la Reservation')
        })
    }

    const annulerReservation = (idReservation) => {
        RestaurantService.annulerReservation(idReservation).then(res => {
            setReservations(reservations.filter(res => res.id !== idReservation))
        })
    }
          
        return (

            
            <div> 
                {/*login*/}
                {
                    !auth &&
                <div className="login">
                    <div className="panel-heading">
                        <h3 className="panel-title">Authentification</h3>
                    </div>
                    <div className="panel-body">
                        <div role="form">
                            <fieldset>
                                <div className="form-group">
                                    <input className="form-control" placeholder="E-mail" name="email" type="email" onChange={e => setEmail(e.target.value)}/>
                                </div>
                                <div className="form-group">
                                    <input className="form-control" placeholder="Mot de passe" name="password" type="password" onChange={e => setPassword(e.target.value)}/>
                                </div>
                                <button className="btn btn-primary" onClick={() => login()}>S'authentifier</button>
                            </fieldset>
                        </div>
                    </div>
                    <span className="text-danger">{loginError}</span>
                </div>
}

                {/*restaurants list */}
                {
                    auth && screen === 'restaurants' && <div>
                        <button className="btn btn-danger" onClick={() => logout()}> Se déconnecter </button>
                        <h3>Bienvenue {localStorage.getItem('nom')}</h3>

                 <h2 className="text-center">Liste des restaurants</h2>
                 <button className="btn btn-secondary" onClick={() => setScreen('reservations')}>Voir mes reservations</button>
                                 {/* reservation */}
                {reservation !== 0  && <div>
                    date de reservation <input type="date" className="form-control" onChange={e => setDateReservation(e.target.value)}/>
                    <button className="btn btn-success" onClick={() => envoyerReservation()}> Envoyer </button>
                    <div className="text-danger">{reservationError}</div>
                </div>}

                 {/* <div className = "row">
                    <button className="btn btn-primary"> Add Restaurant</button>
                 </div> */}
                 <br></br>
                 <div  className="d-flex flex-row mx-3 my-3">
                 <div className = "table-content">
                        <table className = "table-striped table-bordered">

                            <thead>
                                <tr>
                                    <th> Nom Restaurant</th>
                                    <th> Addresse </th>
                                    <th> Rank </th>
                                    <th> Serie </th>
                                    <th> Localisation </th>
                                    <th> Reserver </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    restaurants.map(
                                        restau => 
                                        <tr key = {restau.id}>
                                             <td> { restau.nom} </td>   
                                             <td> {restau.address}</td>
                                             <td> {restau.rank}</td>
                                             <td>
                                                 {restau.serie?.nom}
                                             </td>
                                             <td>
                                                <button className="btn btn-info" onClick={() => changeLocation(restau.latitude, restau.longitude)}> Afficher dans la carte </button>
                                             </td>
                                             <td>
                                                <button className="btn btn-success" onClick={() => reserver(restau)}> reserver </button>
                                             </td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>
               
                 </div>
                 {!isLoaded ? (
            <h1>Loading...</h1>
          ) : (<GoogleMap
          mapContainerClassName="map-container"
          center={center}
          zoom={zoom}
          onClick={(e) => {
            console.log(e.latLng.toJSON())
        }}
        >
          <MarkerF position={currentLocation}/>
          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{
                polylineOptions: {
                  strokeOpacity: 0.4,
                  strokeWeight: 4,
                },
                preserveViewport: true,
                suppressMarkers: true,
              }}
            />
          )}
        </GoogleMap>)}
        </div>
                 </div>
            }
            {/* liste des reservations */}
            {
                                 auth && screen === 'reservations' && <div className = "row mx-3 my-3">
                                    <button className="btn btn-secondary" onClick={() => setScreen('restaurants')}>Voir les restaurants</button>
                                 <table className = "table table-striped table-bordered mx-3 my-3">
         
                                     <thead>
                                         <tr>
                                             <th> id reservation</th>
                                             <th> date </th>
                                             <th> restaurant</th>
                                             <th> Annuler </th>
                                         </tr>
                                     </thead>
                                     <tbody>
                                         {
                                             reservations.map(
                                                 reservation => 
                                                 <tr key = {reservation.id}>
                                                      <td> { reservation.id} </td>   
                                                      <td> {reservation.dateReservation}</td>
                                                      <td> {reservation.restaurant?.nom} </td>
                                                      <td>
                                                         <button className="btn btn-danger" onClick={() => annulerReservation(reservation.id)}> annuler </button>
                                                      </td>
                                                 </tr>
                                             )
                                         }
                                     </tbody>
                                 </table>
                          </div>
            }
            </div>
        )
    
}

export default Restaurants