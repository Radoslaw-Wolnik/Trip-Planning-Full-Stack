import React from 'react';

interface ProductDetails {
    title: string;
    image: string;
    content: string;
    buttonText: string;
  }

interface ProductProps {
    Details: ProductDetails;
  }

const Product: React.FC<ProductProps> = ( {Details} ) => {
  console.log(Details);
  return (
    <div>
        <h5 className="modal-title">{Details.title}</h5>
        <hr />
        <div className="modal-image text-center mt-lg-2">
        <img src={Details.image} alt="image" />
        </div>
        <p className="mt-lg-3 modalText">{Details.content}</p>
        <div className="modal-button text-end">
        <button>{Details.buttonText}</button>
        </div>
    </div>
  );
};

export default Product;
