import React, {useState} from "react";
import Product from "./Product";

const Dashboard = () =>{
    const [products, setProducts] = useState([]);

    const addProduct = (newProduct) =>{
        setProducts(prevProducts =>{
            return [...prevProducts, newProduct];
        });
    }

    const setButton = () => {
        const newProduct = {
            title: "Produs Fictiv",
            description: "Acesta este un produs adăugat prin buton.",
            stock: 10,
            price: 99.99
        };
        addProduct(newProduct);
    };

    return(
    <div>
        <header>
            <h1>Welcome to QuickSell</h1>
            <button onClick={setButton}>Adaugă Produs Fictiv</button>
        </header>
        {products.map((item, index) =>{
            return(
                <Product
                id={index}
                title={item.title}
                description={item.description}
                stock={item.stock}
                price={item.price}
                />
            )
        })}
    </div>
    );
}

export default Dashboard