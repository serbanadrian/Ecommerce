import React from "react";

const Product = (props) => {
    return(
    <div>
        <h1>{props.title}</h1>
        <img src={props.imgPath}/>
        <p>{props.description}</p>
        <p>{props.stock}</p>
        <p>{props.price}</p>
    </div>
);
}

export default Product