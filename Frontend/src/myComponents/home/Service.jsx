import { Separator } from '@/components/ui/separator'
import ButtonCustom from '@/utils/ButtonCustom'
import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import Swiper from 'swiper'
import { SwiperSlide } from 'swiper/react'

import Cookies from "js-cookie";
import { jwtDecode } from 'jwt-decode'

const Service = () => {
    const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [decodedUserData, setDecodedUserData] = useState();

  const refreshToken = Cookies.get("refreshToken");
  const accessToken = Cookies.get("accessToken");

  const authCheck = () => {
    if (accessToken) {
      const decoded = jwtDecode(accessToken);
      setIsLoggedIn(true);
      setDecodedUserData(decoded);
    }
  };
    useEffect(() => {
    authCheck();
  }, [refreshToken, accessToken]);
    return (
        <div className='bg-[#F2FAFF] mt-14'>
            <section className='container  mx-auto py-10'>
                <div className='flex flex-col justify-center items-center mb-10'>
                    <p className='text-[#004e2e] font-semibold text-[15px]'>Your Satisfaction is Our Priority – Build, Buy, Sell, Rent, or Partner with Confidence</p>
                    <h1 className='text-xl lg:text-3xl font-semibold text-center mb-2'>Comprehensive Real Estate and Construction Solutions for All</h1>
                </div>

                <div>
                    {/* <Swiper>
                        <SwiperSlide></SwiperSlide>
                    </Swiper> */}

                    <img src="/assets/img/image.png" alt="" className='w-full' />
                </div>

                <div className='grid grid-cols-2 mx-12 my-8 mb-10'>
                    <div>
                        <h1 className='uppercase lg:text-2xl text-lg font-semibold'>for buyers</h1>
                    </div>
                    <div className='flex flex-col gap-6 text-[#2f2f2f]'>
                        <h2>Looking to buy your dream home or invest in a commercial property? Rsusb2sbuilders Foundation offers expert guidance and a wide range of residential and commercial properties to match your needs. Let us help you find the perfect space.</h2>
                        <ButtonCustom title={'Buy a Property'} onClick={() => navigate('/buy')} />
                    </div>

                </div>

                <Separator />
                <div className='grid grid-cols-2 mx-12 my-8 mb-10'>
                    <div>
                        <h1 className='uppercase lg:text-2xl text-lg font-semibold'>For Sellers</h1>
                    </div>
                    <div className='flex flex-col gap-6 text-[#2f2f2f]'>
                        <h2>Ready to sell your property? We provide expert strategies and leverage our social media marketing partnerships to maximize your property’s value. Sell with ease and confidence with Rsusb2sbuilders Foundation.</h2>
                        
                        {
                    isLoggedIn ?
                      <NavLink to='/add_properties'>
                <ButtonCustom title={'Sell a Property'} />
                      </NavLink>
                      :
                      <NavLink to='/login'>
                         <ButtonCustom title={'Sell a Property'} />
                        </NavLink>
                  }
                    </div>

                </div>

            </section>
        </div>
    )
}

export default Service