export default function RatingDitsribution({ rating, total, count }) {
  return (
    <div className="grid grid-cols-[30px_1fr_50px] gap-[30px] flex items-center">
      <p className="text-sm font-semibold">{rating}점</p>
      <progress
        className="product-review-progress w-[300px]"
        value={total > 0 ? (count / total) * 100 : 0}
        min={0}
        max={100}
      />
      <p className="text-sm font-semibold">{count}</p>
    </div>
  );
}
