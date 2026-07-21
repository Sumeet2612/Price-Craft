import { AlertCircle, CheckCircle2, Tag, X } from "lucide-react";

const formatRupees = (value) => `Rs. ${Number(value).toFixed(2)}`;

const Ordersummary = ({
  subtotal,
  discountedSubtotal,
  itemCount,
  deliveryFee,
  serviceFee,
  tax,
  tip,
  total,
  useCredit,
  deliveryMethod,
  couponCode,
  couponStatus,
  discountAmount,
  appliedCoupons,
  setCouponCode,
  setTip,
  setUseCredit,
  setDeliveryMethod,
  onApplyCoupon,
  onRemoveCoupon,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 p-5 w-[340px]">
        <p className="text-gray-600 text-sm mb-4 font-medium">Coupons</p>

        <div className="flex">
          <input
            type="text"
            value={couponCode}
            onChange={(event) => setCouponCode(event.target.value)}
            placeholder="Coupon code"
            className="flex-1 border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black"
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                onApplyCoupon();
              }
            }}
          />

          <button
            onClick={onApplyCoupon}
            className="bg-black text-white px-5 text-xs font-semibold hover:bg-gray-800 transition"
          >
            APPLY NOW
          </button>
        </div>

        {couponStatus?.message ? (
          <div
            className={`mt-3 flex items-start gap-2 rounded-md border px-3 py-2 text-sm ${
              couponStatus.type === "success"
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {couponStatus.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{couponStatus.message}</span>
          </div>
        ) : null}

        {appliedCoupons?.length ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {appliedCoupons.map((code) => (
              <span
                key={code}
                className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-700"
              >
                <Tag size={12} />
                {code}
                <button
                  type="button"
                  onClick={() => onRemoveCoupon(code)}
                  className="rounded-full p-0.5 hover:bg-orange-100"
                >
                  <X size={11} />
                </button>
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <div className="bg-white border border-gray-200 w-[340px] p-5">
        <h2 className="text-2xl font-semibold text-gray-700">Your Order</h2>
        <hr className="my-5" />

        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">Subtotal ({itemCount} items)</span>
          <span className="font-semibold">{formatRupees(subtotal)}</span>
        </div>

        {discountAmount > 0 ? (
          <div className="flex justify-between items-center text-sm mt-3 text-green-600">
            <span>Discount</span>
            <span className="font-semibold">-{formatRupees(discountAmount)}</span>
          </div>
        ) : null}

        <div className="flex justify-between items-center text-sm mt-3">
          <span className="text-gray-500">Discounted subtotal</span>
          <span className="font-semibold">{formatRupees(discountedSubtotal)}</span>
        </div>

        <hr className="border-dashed my-5" />

        <div>
          <p className="font-semibold text-gray-700 mb-3">Delivery</p>

          <div className="flex justify-between items-center mb-3">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name="delivery"
                checked={deliveryMethod === "delivery"}
                onChange={() => setDeliveryMethod("delivery")}
              />

              <span>Delivery : {formatRupees(deliveryFee)}</span>
            </label>
          </div>

          <div className="flex justify-between items-center">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name="delivery"
                checked={deliveryMethod === "pickup"}
                onChange={() => setDeliveryMethod("pickup")}
              />

              <span>Pick Up</span>
            </label>

            <select className="border px-2 py-1 text-sm rounded">
              <option>Asap</option>
              <option>10 AM</option>
              <option>12 PM</option>
              <option>3 PM</option>
            </select>
          </div>
        </div>

        <hr className="my-5" />

        <div>
          <p className="font-semibold text-gray-700 mb-3">Tip <span className="text-xs font-normal text-gray-400">(optional)</span></p>

          <div className="grid grid-cols-2 gap-3">
            <label
              className={`tip-option ${
                tip === 0 ? "border-orange-500 bg-orange-50" : ""
              }`}
            >
              <input
                type="radio"
                name="tip"
                checked={tip === 0}
                onChange={() => setTip(0)}
              />
              No tip
            </label>

            <label
              className={`tip-option ${
                tip === 20 ? "border-orange-500" : ""
              }`}
            >
              <input
                type="radio"
                name="tip"
                checked={tip === 20}
                onChange={() => setTip(20)}
              />
              Rs. 20
            </label>

            <label
              className={`tip-option ${
                tip === 40 ? "border-orange-500" : ""
              }`}
            >
              <input
                type="radio"
                name="tip"
                checked={tip === 40}
                onChange={() => setTip(40)}
              />
              Rs. 40
            </label>

            <label
              className={`tip-option ${
                tip === 70 ? "border-orange-500" : ""
              }`}
            >
              <input
                type="radio"
                name="tip"
                checked={tip === 70}
                onChange={() => setTip(70)}
              />
              Rs. 70
            </label>
          </div>
        </div>

        <hr className="my-5" />

        <div className="space-y-4 text-sm">
          <div className="flex justify-between">
            <span>Service Fee</span>
            <span>{formatRupees(serviceFee)}</span>
          </div>

          <div className="flex justify-between">
            <span>Tax</span>
            <span>{formatRupees(tax)}</span>
          </div>

          <div className="flex justify-between items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={useCredit}
                onChange={() => setUseCredit(!useCredit)}
              />
              Use E-Markets Credits
            </label>
            <span>Rs. 80.00</span>
          </div>
        </div>

        <hr className="my-5" />

        <div className="flex justify-between items-center text-xl font-semibold">
          <span>Total Payable</span>
          <span>{formatRupees(total)}</span>
        </div>

        <button className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded font-semibold transition">
          PROCEED TO CHECKOUT
        </button>
      </div>
    </div>
  );
};

export default Ordersummary;
