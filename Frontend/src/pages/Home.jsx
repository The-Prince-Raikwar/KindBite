import React from 'react'
import Header from '../components/Header'
import Hero from '../components/Hero'
import Section from '../components/Section'


function Home({setshowLogIn}) {
  


  return (
    <>
    <Header setshowLogIn={setshowLogIn}/>
    <Section setshowLogIn={setshowLogIn}/>
    <Hero/>
    </>
     
  )
}

export default Home