import React from "react";

const Ordersummary = ({
  subtotal,
  itemCount,
  deliveryFee,
  serviceFee,
  tax,
  tip,
  total,
  useCredit,
  deliveryMethod,
  setTip,
  setUseCredit,
  setDeliveryMethod,
}) => {
  return (
    <div className="space-y-6">

      {/* Coupon Card */}

      <div className="bg-white border border-gray-200 p-5 w-[340px]">
        <p className="text-gray-600 text-sm mb-4 font-medium">
          Coupons
        </p>

        <div className="flex">
          <input
            type="text"
            placeholder="Coupon code"
            className="flex-1 border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black"
          />

          <button className="bg-black text-white px-5 text-xs font-semibold hover:bg-gray-800 transition">
            APPLY NOW
          </button>
        </div>
      </div>

      {/* Order Summary */}

      <div className="bg-white border border-gray-200 w-[340px] p-5">

        <h2 className="text-2xl font-semibold text-gray-700">
          Your Order
        </h2>

        <hr className="my-5" />

        {/* Subtotal */}

        <div className="flex justify-between items-center text-sm">

          <span className="text-gray-500">
            Subtotal ({itemCount} items)
          </span>

          <span className="font-semibold">
            ${subtotal.toFixed(2)}
          </span>

        </div>

        <hr className="border-dashed my-5" />

        {/* Delivery */}

        <div>

          <p className="font-semibold text-gray-700 mb-3">
            Delivery
          </p>

          <div className="flex justify-between items-center mb-3">

            <label className="flex items-center gap-2 text-sm cursor-pointer">

              <input
                type="radio"
                name="delivery"
                checked={deliveryMethod === "delivery"}
                onChange={() => setDeliveryMethod("delivery")}
              />

              <span>
                Delivery : ${deliveryFee.toFixed(2)}
              </span>

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

        {/* Tip */}

        <div>

          <p className="font-semibold text-gray-700 mb-3">
            Tip
          </p>

          <div className="grid grid-cols-3 gap-3">

            <label
              className={`border p-2 flex items-center gap-2 cursor-pointer ${
                tip === 2 ? "border-orange-500" : ""
              }`}
            >
              <input
                type="radio"
                name="tip"
                checked={tip === 2}
                onChange={() => setTip(2)}
              />

              $2
            </label>

            <label
              className={`border p-2 flex items-center gap-2 cursor-pointer ${
                tip === 4 ? "border-orange-500" : ""
              }`}
            >
              <input
                type="radio"
                name="tip"
                checked={tip === 4}
                onChange={() => setTip(4)}
              />

              $4
            </label>

            <label
              className={`border p-2 flex items-center gap-2 cursor-pointer ${
                tip === 7 ? "border-orange-500" : ""
              }`}
            >
              <input
                type="radio"
                name="tip"
                checked={tip === 7}
                onChange={() => setTip(7)}
              />

              $7
            </label>

          </div>

        </div>

        <hr className="my-5" />

        {/* Charges */}

        <div className="space-y-4 text-sm">

          <div className="flex justify-between">

            <span>Service Fee</span>

            <span>${serviceFee.toFixed(2)}</span>

          </div>

          <div className="flex justify-between">

            <span>Tax</span>

            <span>${tax.toFixed(2)}</span>

          </div>

          <div className="flex justify-between items-center">

            <label className="flex items-center gap-2 cursor-pointer">

              <input
                type="checkbox"
                checked={useCredit}
                onChange={() =>
                  setUseCredit(!useCredit)
                }
              />

              Use E-Markets Credits

            </label>

            <span>$8.00</span>

          </div>

        </div>

        <hr className="my-5" />

        {/* Total */}

        <div className="flex justify-between items-center text-xl font-semibold">

          <span>Total Payable</span>

          <span>${total.toFixed(2)}</span>

        </div>

        <button className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded font-semibold transition">

          PROCEED TO CHECKOUT

        </button>

      </div>

    </div>
  );
};

export default Ordersummary;