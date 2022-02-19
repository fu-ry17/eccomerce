import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Loading from '../../components/alert/Loading';
import NotFound from '../../components/NotFound';
import { ALERT } from '../../redux/types/alertTypes';
import { getAPI } from '../../utils/fetchData';
import { IProducts, RootStore } from '../../utils/TypeScript';
import { Image } from '@chakra-ui/react';
import { addToCart } from '../../redux/actions/cartActions';
import ShopCard from '../../components/shop/ShopCard';

function ProductDetails() {
  const slug = useParams<string>().slug
  const dispatch = useDispatch()
  const [product, setProduct] = useState<IProducts>()
  const [relatedProducts, setRelatedProducts] = useState<IProducts[]>()
  const { cart, products } = useSelector((state: RootStore) => state)


   useEffect(()=> {
       getAPI(`products/${slug}`)
         .then(res =>{
             setProduct(res.data.product)
         })
         .catch(error => dispatch({ type: ALERT, payload: { error: error.response.data.msg}}))
   },[slug, dispatch])

   useEffect(()=> {
       if(!product) return
       let new_products = products.filter(item => item.category === product.category)
       setRelatedProducts(new_products)
   },[product, products])

   if(!slug) return <NotFound />

   if(!product) return <Loading />

   if(!relatedProducts) return <Loading />

  return <div className='max-w-4xl mx-auto mb-8'>
      
       <div className='grid grid-cols-1 md:grid-cols-2 gap-4 py-8'>

         <div className='mb-4'>
            <Image src={product.images[0].url} alt="images"
            className='rounded-md w-full max-w-[416px] max-h-[400px] object-cover object-top block shadow-sm hover:shadow-lg '/>

                  <div className='grid grid-cols-4 gap-2 max-h-[130px] overflow-auto py-2'>
                    {
                      product.images.length > 1 && product.images.map((item, i) =>(
                            <div key={i}>
                               <img src={item.url} alt="images" 
                               className='block w-full max-h-[110px] cursor-pointer rounded-md'/>
                            </div>  
                        ))
                    }
                  
                </div>
         </div>
       
          <div>
            
            <div className='flex justify-between '>
              <h1 className='text-3xl font-bold uppercase tracking-wider pb-4'> {product.title} </h1>
              <i className='bx bx-heart text-2xl font-bold cursor-pointer hover:text-red-400'></i>
            </div>
          

            <div>
                <p className='text-justify'>{product.description}</p>
                <h1 className='text-xl font-bold py-4'> ksh: {product.price}</h1>
                <div className='flex justify-between mb-4 font-semibold'>
                   <span> sold: {product.sold}</span>
                   <span> rating: {product.rating}</span>
                   <span> reviews: {product.reviews} </span>
                </div>
            </div>

            <div className='py-4'>
              {
                 product.quantityInStock === 0 ?   <button className='bg-red-400 text-white py-2 md:w-1/2 px-2 w-full rounded-md'> Out Of Stock </button>
                 : <button className='bg-red-400 text-white py-2 md:w-1/2 px-2 w-full rounded-md' onClick={()=> dispatch(addToCart(product, cart))}> Add To Cart </button>
              }
              
            </div>

          </div>

       </div>

       <h1> Related Products </h1>
       <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 w-full'>
           {
              relatedProducts.map(product => (
               <ShopCard key={product._id} product={product}/>
              ))
            }
        </div>

  </div>;
}

export default ProductDetails;