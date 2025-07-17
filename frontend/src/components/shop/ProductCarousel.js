import React, { Component } from "react";
import { Box } from '@mui/material';
import Slider from "react-slick";
import img1 from '../../assets/images/products/product-detail-1.jpg';
import img2 from '../../assets/images/products/product-detail-2.jpg';
import img3 from '../../assets/images/products/product-detail-3.jpg';
import img4 from '../../assets/images/products/product-detail-4.jpg';
import './carousel.css';


const images = [
  {
    imgPath: img1,
    id: 1,
  },
  {
    imgPath: img2,
    id: 2,
  },
  {
    imgPath: img3,
    id: 3,
  },
  {
    imgPath: img4,
    id: 4,
  },
];

// CAROUSEL SETTINGS

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
      <div
          className={className}
          style={{ ...style, background: "rgba(0,0,0,-1.9)", borderRadius: "0px", zIndex: 1, marginRight: "40px"}}
          onClick={onClick}
      />
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
      <div
          className={className}
          style={{ ...style, background: "rgba(0,0,0,-1.9)", borderRadius: "0px", zIndex: 1, marginLeft: "40px" }}
          onClick={onClick}
      />
  );
}

export default class SimpleSlider extends Component {
  render() {
    const settings = {
      dots: true,
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: true,
      autoplay: false,
      nextArrow: <SampleNextArrow className={undefined} style={undefined} onClick={undefined} />,
      prevArrow: <SamplePrevArrow className={undefined} style={undefined} onClick={undefined} />,
      speed: 500,
      autoplaySpeed: 2000,
    };

    const imageStyle = {
      borderRadius: '20px', // Set the borderRadius to 20px
      width: '100%',
      height: '100%',
    };

    return (
      <Box mb={5}>
        <Slider {...settings}>
          {images.map((items, i) => (
            <div key={i}>
              <img src={items.imgPath} alt="nm" style={imageStyle} sx={{}} />
            </div>
          ))}
        </Slider>
      </Box>
    );
  };
}
