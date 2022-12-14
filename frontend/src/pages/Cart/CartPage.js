import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import './CartPage.css'
import { addCartItems, deleteCartItems } from '../../features/cart/cartSlice'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'

const CartPage = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const { id } = useParams()
  const quantity = location.search ? Number(location.search.split('=')[1]) : 1

  const product = useSelector((state) => state.cart)
  const { cartItems } = product

  const userInfo = useSelector((state) => state.users)
  const { user } = userInfo

  const deleteItem = (id) => {
    dispatch(deleteCartItems(id))
  }

  useEffect(() => {
    if (id && quantity) {
      dispatch(addCartItems({ id, quantity }))
    }
  }, [id, quantity, dispatch])

  const navigateToShippingHandler = () => {
    if (!user) {
      navigate('/login')
    } else {
      navigate('/shippingaddress')
    }
  }

  return (
    <div>
      {cartItems.length !== 0 ? (
        <div className='shoppingCartContainer'>
          <div className='shoppingCartProducts'>
            <p className='shoppingCartLabels'>Shopping Cart Products</p>
            <div>
              {cartItems.map((p) => (
                <div>
                  <div className='productList'>
                    <div className='productDetailsList'>
                      <img className='productDetailsListImage' src={p.image} />
                    </div>
                    <div className='productDetailsList'>{p.name}</div>
                    <div className='productDetailsList'>{p.price} $</div>
                    <div className='productDetailsList'>
                      <select
                        className='productQuantitySelect'
                        value={p.quantity}
                        onChange={(e) =>
                          dispatch(
                            addCartItems({
                              id: p.product,
                              quantity: e.target.value,
                            })
                          )
                        }
                      >
                        {[...Array(p.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className='productDetailsList'>
                      <button
                        className='deleteButton'
                        onClick={() => deleteItem(p.product)}
                      >
                        <i class='fa-solid fa-trash fa-lg'></i>
                      </button>
                    </div>
                  </div>
                  <hr className='productDetailsListLine'></hr>
                </div>
              ))}
            </div>
          </div>
          <div className='shoppingCartPrices'>
            <p className='shoppingCartLabels'>
              Subtotal (
              {cartItems.reduce((acc, item) => acc + Number(item.quantity), 0)})
            </p>
            <hr></hr>
            <div className='shoppingCartLabels'>
              All Products Price :{' '}
              {cartItems
                .reduce(
                  (acc, item) => acc + Number(item.quantity) * item.price,
                  0
                )
                .toFixed(2)}{' '}
              $
            </div>
            <div className='shoppingCartLabels'>
              Shipping Price:{' '}
              {cartItems
                .reduce(
                  (acc, item) =>
                    acc + (Number(item.quantity) * item.price * 5) / 100,
                  0
                )
                .toFixed(2)}{' '}
              $
            </div>
            <hr></hr>
            <div className='shoppingCartLabels'>
              total Price:{' '}
              {cartItems
                .reduce(
                  (acc, item) =>
                    acc +
                    Number(item.quantity) * item.price +
                    (Number(item.quantity) * item.price * 5) / 100,
                  0
                )
                .toFixed(2)}{' '}
              $
            </div>
            <div className='shoppingCartLabels'>
              <button
                className='checkoutCartButton'
                onClick={navigateToShippingHandler}
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p style={{ minHeight: '80vh' }}>
          No Items In Cart Yet.
          <Link to='/'>
            <strong> Go Back To Shopping</strong>
          </Link>
        </p>
      )}
    </div>
  )
}

export default CartPage
