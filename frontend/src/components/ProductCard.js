import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWeb3 } from '../context/Web3Context';
import { shortenAddress } from '../utils/api';
import { ethers } from 'ethers';

function Stars({ rating }) {
  return (
    <div className="stars">
      {[1,2,3,4,5].map(s => (
        <span key={s} className={s <= Math.round(parseFloat(rating)) ? 'star-filled' : 'star-empty'} style={{ fontSize: 12 }}>★</span>
      ))}
    </div>
  );
}

export default function ProductCard({ product, style }) {
  const { addItem, inCart } = useCart();
  const { account } = useWeb3();
  const already = inCart(product.id);

  const priceEth = product.priceEth || ethers.formatEther(product.priceWei || '0');

  return (
    <div className="card card-glow fade-up" style={{ display: 'flex', flexDirection: 'column', ...style }}>
      {/* Image */}
      <Link to={`/products/${product.id}`}>
        <div style={{ height: 200, overflow: 'hidden', position: 'relative', background: 'var(--bg3)' }}>
          <img
            src={product.imageURI}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
            onMouseEnter={e => e.target.style.transform = 'scale(1.06)'}
            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'; }}
          />
          {product.stock <= 5 && product.stock > 0 && (
            <span className="badge badge-yellow" style={{ position: 'absolute', top: 10, left: 10, fontSize: 10 }}>
              Only {product.stock} left
            </span>
          )}
          {product.stock === 0 && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontWeight: 700 }}>Sold Out</span>
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div style={{ padding: 16, flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* Category */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="badge badge-accent" style={{ fontSize: 10 }}>{product.category}</span>
          <span className="text-muted text-xs">#{product.id}</span>
        </div>

        {/* Name */}
        <Link to={`/products/${product.id}`}>
          <h3 style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.4, color: 'var(--text)', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text)'}
          >{product.name}</h3>
        </Link>

        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Stars rating={product.avgRating || 0} />
          <span className="text-xs text-muted">({product.ratingCount || 0})</span>
        </div>

        {/* Seller */}
        <div style={{ fontSize: 11, color: 'var(--text3)' }}>
          <span>Seller: </span>
          <span className="mono" style={{ color: 'var(--text2)' }}>{shortenAddress(product.seller)}</span>
        </div>

        {/* Price + CTA */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 8, borderTop: '1px solid var(--border)' }}>
          <div>
            <div className="eth-price" style={{ fontSize: 18, fontWeight: 700 }}>{parseFloat(priceEth).toFixed(4)}</div>
            <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 1 }}>{product.sold || 0} sold</div>
          </div>
          <button
            onClick={() => addItem(product)}
            disabled={product.stock === 0 || already}
            className="btn btn-primary btn-sm"
            style={{ fontSize: 12 }}
          >
            {already ? '✓ In Cart' : product.stock === 0 ? 'Sold Out' : '+ Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
