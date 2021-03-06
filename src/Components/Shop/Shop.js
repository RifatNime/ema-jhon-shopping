import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { hasSelectionSupport } from '@testing-library/user-event/dist/utils';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useProducts from '../../hooks/useProducts';
import { addToDb, getStoredCart, deleteShoppingCart } from '../../utilities/fakedb';
import Cart from '../Cart/Cart';
import Product from '../Product/Product';
import './Shop.css';

const Shop = () => {
    //data load from array and state jekhane event handaler sekhane
    const [products, setProducts] = useProducts();
    // const [products, setProducts] = useState([]);
    //cart state declare and change will occur here
    const [cart, setCart] = useState([]);

    useEffect(() => {
        //get object so in 
        const storedCart = getStoredCart();
        const savedCart = [];
        // console.log(storedCart)
        for (const id in storedCart) {
            const addedProduct = products.find(product => product.id === id);
            // console.log(addedProduct);
            if (addedProduct) {
                const quantity = storedCart[id];
                addedProduct.quantity = quantity;
                savedCart.push(addedProduct)
            }
        }
        setCart(savedCart);

    }, [products]) //product dependency

    //event handler add to cart
    const handleAddToCart = (selectedProduct) => {
        // console.log('clicked',product)
        // cart.push(product)
        let newCart = [];
        const exists = cart.find(product => product.id === selectedProduct.id);
        //quantity fixing
        if (!exists) {
            selectedProduct.quantity = 1; // 0+1
            newCart = [...cart, selectedProduct]; //add with old like push
        }
        else {
            const rest = cart.filter(product => product.id !== selectedProduct.id);
            exists.quantity = exists.quantity + 1;
            newCart = [...rest, exists];
        }
        setCart(newCart);
        addToDb(selectedProduct.id)
    }
    const clearCart = (id) => {
        setCart([]);
        deleteShoppingCart(id);
    }

    const confirmOrder = () => {
        alert("Thank you for your order!");
        setCart([]);
    }

    return (
        <div className='shop-container'>

            <div className="products-container">
                {
                    products.map(product => <Product

                        key={product.id}
                        product={product}
                        handleAddToCart={handleAddToCart}
                    ></Product>)
                }
            </div>
            <div className="cart-container">
                <Cart
                    cart={cart}
                    clearCart={clearCart}
                    confirmOrder={confirmOrder}
                >
                    <Link to='/orders'>
                        <button id='btn2'>Review Order <FontAwesomeIcon className='icon' icon={faArrowRight}></FontAwesomeIcon></button>
                    </Link>
                </Cart>
            </div>
        </div>

    );
};

export default Shop;