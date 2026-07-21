import { applyCoupon } from "../utils/discountEngine";
const [couponCode, setCouponCode] = useState("");

const [discountData, setDiscountData] = useState({
    success: false,
    appliedCoupon: null,
    discount: 0,
    finalTotal: 0,
    savings: 0,
    message: "",
});
const [cartItems, setCartItems] = useState([]);
<CartContext.Provider
    value={{
        cartItems,
        couponCode,
        discountData,
        applyCartCoupon,
    }}
></CartContext.Provider>

if (cartItems.length === 0) {
    setDiscountData({
        success: false,
        message: "Your cart is empty.",
    });

    return;
}

const subtotal = useMemo(() => {
    return cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
}, [cartItems]);

const applyCartCoupon = (couponCode) => {
    const result = applyCoupon(subtotal, couponCode.trim());

    setDiscountData(result);
    setCouponCode(couponCode.trim().toUpperCase());
};