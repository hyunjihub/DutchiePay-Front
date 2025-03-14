'use client';

export default function Quantity({ salePrice, quantity, setQuantity }) {
  const handleQuantity = (e) => {
    if (e.target.value === '-') {
      if (quantity === 1) return;
      setQuantity(quantity - 1);
    } else {
      if (quantity >= 99) return;
      setQuantity(quantity + 1);
    }
  };

  return (
    <>
      <div className="w-full flex justify-end gap-[1px] mb-[4px]">
        <button
          className="w-[32px] h-[32px] bg-gray--100 font-bold"
          value="-"
          onClick={(e) => handleQuantity(e)}
        >
          -
        </button>
        <input
          className="border w-[32px] h-[32px] font-bold text-center product-quantity__input"
          type="number"
          value={quantity}
          onChange={(e) => {
            const inputValue = e.target.value;
            if (inputValue === '') {
              setQuantity('');
            } else {
              const newValue = parseInt(inputValue, 10);
              if (newValue >= 99) {
                if (newValue > 99) alert('최대 99개까지 구매 가능합니다.');
                setQuantity(99);
              } else if (newValue >= 1) {
                setQuantity(newValue);
              }
            }
          }}
          min={1}
          max={99}
        />
        <button
          className="w-[32px] h-[32px] bg-gray--100 font-bold"
          value="+"
          onClick={(e) => handleQuantity(e)}
        >
          +
        </button>
      </div>
      <p className="text-end text-xs text-gray--500">
        1인 최대 구매 가능 수량은 99개 입니다.
      </p>
      <div className="flex justify-between items-center my-[8px]">
        <strong className="text-sm font-bold">총 상품 금액</strong>
        <p className="text-blue--500 text-lg font-semibold">
          {(salePrice * quantity).toLocaleString('ko-KR')}원
        </p>
      </div>
    </>
  );
}
