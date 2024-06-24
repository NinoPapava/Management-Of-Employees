import React from 'react'
import { Carousel } from 'antd';
import '../../../styles/home.css'

const HomePage = () => {
  return (
    <div>
      <h2>Home Page</h2>
      <Carousel autoplay autoplaySpeed={3000} dots={true}>
        <div>
          <h3>Slide 1</h3>
          <img src="/images/team2.jpg" alt="team img" className="carousel-image" />
        </div>
        <div>
          <h3>Slide 2</h3>
          <img src="/images/team4.jpeg" alt="team img" className="carousel-image" />
        </div>
        <div>
          <h3>Slide 3</h3>
          <img src="/images/team3.jpg" alt="team img" className="carousel-image" />
        </div>
      </Carousel>
    </div>
  )
}

export default HomePage