import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { RiShoppingCartLine } from 'react-icons/ri';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const isOutOfStock = product.quantity === 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to add to cart'); return; }
    if (user.role === 'admin') { toast.error('Admins cannot shop'); return; }
    const res = await dispatch(addToCart({ productId: product._id, quantity: 1 }));
    if (res.meta.requestStatus === 'fulfilled') toast.success('Added to cart!');
    else toast.error(res.payload || 'Failed to add');
  };

  return (
    <Link
      to={`/products/${product._id}`}
      className="group bg-white rounded-2xl border border-zinc-200 hover:border-zinc-300 hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col"
    >
      <div className="relative flex items-center justify-center overflow-hidden bg-zinc-100 aspect-square">
        <img
          src={product.images?.[0]?.url || 'https://placehold.co/400x400?text=No+Image'}
          alt={product.name}
          className="w-[80%] h-[80%] object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
        />
        {isOutOfStock && (
          <span className="absolute top-3 left-3 bg-zinc-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg">
            Out of Stock
          </span>
        )}
        {product.status === 'Low Stock' && !isOutOfStock && (
          <span className="absolute top-3 left-3 bg-amber-500 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg">
            Low Stock
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        {product.category?.name && (
          <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
            {product.category.name}
          </p>
        )}
        <h3 className="font-medium text-zinc-900 text-sm leading-snug line-clamp-2 flex-1">
          {product.name}
        </h3>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-100">
          <span className="text-base font-bold text-zinc-900">${product.price.toFixed(2)}</span>
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="flex items-center gap-1.5 bg-zinc-900 text-white text-xs font-semibold px-3 py-2 rounded-xl hover:bg-zinc-700 disabled:bg-zinc-200 disabled:text-zinc-400 disabled:cursor-not-allowed transition-colors"
          >
            <RiShoppingCartLine size={14} />
            {isOutOfStock ? 'Unavailable' : 'Add'}
          </button>
        </div>
      </div>
    </Link>
  );
}
