import React, { useEffect, useState } from 'react'
import MyContext from './MyContext'
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'

function MyState({ children }) {

    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [decodedUserData, setDecodedUserData] = useState()
    const [homeData, setHomeData] = useState()
    const [landData, setLandData] = useState()
    const refreshToken = Cookies
        .get('refreshToken')
    const accessToken = Cookies
        .get('accessToken')

    const authCheck = () => {
        if (accessToken) {
            const decoded = jwtDecode(accessToken)
            setIsLoggedIn(true)
            setDecodedUserData(decoded)
        }
    }

    useEffect(() => {
        authCheck()
    }, [refreshToken, accessToken])
    useEffect(() => {
        authCheck()
    }, [])

    const [userData, setUserData] = useState()

    const getUserData = () => {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'https://admin.samadhaangroups.co.in/api/v1/users/me',
            headers: {
                'Authorization': accessToken
            }
        };

        axios.request(config)
            .then((response) => {
               // console.log(response.data);
                setUserData(response?.data?.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const getHomeData = () => {
        axios.get('https://admin.samadhaangroups.co.in/api/v1/home/get-home-user')
            .then((response) => {
               // console.log('Home Data:', response?.data?.data)
                setHomeData(response?.data?.data)
            })
            .catch((error) => {
                console.error('Error fetching home data:', error)
            })
    }

    const getLandData = () => {
        axios.get('https://admin.samadhaangroups.co.in/api/v1/land/get-land-user')
            .then((response) => {
               // console.log('Land Data:', response?.data?.data)
                setLandData(response?.data?.data)
            })
            .catch((error) => {
                console.error('Error fetching land data:', error)
            })
    }



    useEffect(() => {
        getUserData()
        getLandData()
        getHomeData()
    }, [])


    return (
        <MyContext.Provider value={{ isLoggedIn, homeData, landData, getHomeData, getLandData, decodedUserData, userData, getUserData, accessToken }}>{
            children}</MyContext.Provider>
    )
}

export default MyState