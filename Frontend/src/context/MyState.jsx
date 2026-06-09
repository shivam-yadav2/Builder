import { useEffect, useState } from 'react';
import MyContext from './MyContext';
import axios from 'axios';

function MyState({ children }) {
    const [homeData, setHomeData] = useState();
    const [landData, setLandData] = useState();

    const getHomeData = () => {
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/home/get-home`)
            .then((response) => {
                setHomeData(response?.data?.data);
            })
            .catch((error) => {
                console.error('Error fetching home data:', error);
            });
    };

    const getLandData = () => {
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/land/get-land`)
            .then((response) => {
                setLandData(response?.data?.data);
            })
            .catch((error) => {
                console.error('Error fetching land data:', error);
            });
    };

    useEffect(() => {
        getHomeData();
        getLandData();
    }, []);

    return (
        <MyContext.Provider value={{ homeData, landData, getHomeData, getLandData }}>
            {children}
        </MyContext.Provider>
    );
}

export default MyState;
