'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Container from '@/components/core/Container';
import Button from '@/components/core/Button';
import { useParams } from 'next/navigation';

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    category: string;
    status: string;
}

interface SizeChart {
    [key: string]: {
        weight: string;
        bust: string;
        ao_dai: string;
        tay: string;
        quan: string;
    };
}

const categoryLabels: Record<string, string> = {
    'ao_dai_ngu_than': 'Áo Dài Ngũ Thân Cách Tân',
    'ao_dai_4_ta': 'Áo Dài Truyền Thống 4 Tà',
    'ao_dai_2_ta': 'Áo Dài Truyền Thống 2 Tà',
    'phap_phuc_linen': 'Pháp Phục Linen Cao Cấp',
};

export default function ProductDetailPage() {
    const params = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [sizeChart, setSizeChart] = useState<SizeChart | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [showConsultForm, setShowConsultForm] = useState(false);

    useEffect(() => {
        if (params.id) {
            fetchProduct(params.id as string);
            fetchSizeChart();
        }
    }, [params.id]);

    async function fetchProduct(id: string) {
        setLoading(true);
        try {
            const res = await fetch(`/api/products/${id}`);
            const data = await res.json();
            if (data.success) {
                setProduct(data.data);
            }
        } catch (e) {
            console.error('Failed to fetch product:', e);
        } finally {
            setLoading(false);
        }
    }

    async function fetchSizeChart() {
        try {
            const res = await fetch('/api/settings/size_chart');
            const data = await res.json();
            if (data.success) {
                setSizeChart(JSON.parse(data.data.value));
            }
        } catch (e) {
            console.error('Failed to fetch size chart:', e);
        }
    }

    function formatPrice(price: number) {
        return new Intl.NumberFormat('vi-VN').format(price) + '₫';
    }

    if (loading) {
        return (
            <section className="product-detail section">
                <Container>
                    <div className="products-loading">
                        <div className="loading-spinner" />
                        <p>Đang tải sản phẩm...</p>
                    </div>
                </Container>
            </section>
        );
    }

    if (!product) {
        return (
            <section className="product-detail section">
                <Container>
                    <div className="products-empty">
                        <p>Không tìm thấy sản phẩm</p>
                        <Button href="/products">Quay Lại</Button>
                    </div>
                </Container>
            </section>
        );
    }

    return (
        <section className="product-detail section">
            <Container>
                <div className="product-detail-grid">
                    {/* Images Gallery */}
                    <motion.div
                        className="product-gallery"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <div className="main-image">
                            <Image
                                src={product.images[selectedImage] || '/images/placeholder.jpg'}
                                alt={product.name}
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="product-main-img"
                            />
                        </div>
                        {product.images.length > 1 && (
                            <div className="thumbnail-row">
                                {product.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`thumbnail ${selectedImage === idx ? 'active' : ''}`}
                                    >
                                        <Image src={img} alt={`${product.name} ${idx + 1}`} fill sizes="80px" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Product Info */}
                    <motion.div
                        className="product-info-detail"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <span className="product-category-badge">
                            {categoryLabels[product.category] || product.category}
                        </span>
                        <h1 className="product-detail-name">{product.name}</h1>
                        <p className="product-detail-price">{formatPrice(product.price)}</p>

                        <div className="product-description">
                            <h3>Mô Tả</h3>
                            <p>{product.description || 'Sản phẩm được may thủ công từ những nghệ nhân lành nghề với chất liệu cao cấp.'}</p>
                        </div>

                        {/* Size Chart */}
                        {sizeChart && (
                            <div className="size-chart-section">
                                <h3>Bảng Size Chuẩn</h3>
                                <div className="size-chart-table">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Size</th>
                                                <th>Cân Nặng</th>
                                                <th>3 Vòng</th>
                                                <th>Dài Áo</th>
                                                <th>Dài Tay</th>
                                                <th>Dài Quần</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.entries(sizeChart).map(([size, data]) => (
                                                <tr key={size}>
                                                    <td className="size-name">{size}</td>
                                                    <td>{data.weight}</td>
                                                    <td>{data.bust}</td>
                                                    <td>{data.ao_dai}</td>
                                                    <td>{data.tay}</td>
                                                    <td>{data.quan}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="product-actions">
                            <Button
                                variant="primary"
                                size="lg"
                                onClick={() => setShowConsultForm(true)}
                            >
                                Đặt May Theo Số Đo
                            </Button>
                            <Button
                                href="https://zalo.me/0912503456"
                                variant="outline"
                                size="lg"
                                external
                            >
                                Chat Zalo Tư Vấn
                            </Button>
                        </div>
                    </motion.div>
                </div>

                {/* Consultation Form Modal */}
                {showConsultForm && (
                    <ConsultationModal
                        product={product}
                        onClose={() => setShowConsultForm(false)}
                    />
                )}
            </Container>
        </section>
    );
}

// Consultation Modal Component
function ConsultationModal({
    product,
    onClose
}: {
    product: Product;
    onClose: () => void;
}) {
    const [formData, setFormData] = useState({
        customer_name: '',
        customer_phone: '',
        measurements: '',
        notes: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);

        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    product_id: product.id,
                    product_name: product.name,
                }),
            });
            const data = await res.json();
            if (data.success) {
                setSubmitted(true);
            } else {
                alert('Có lỗi xảy ra, vui lòng thử lại');
            }
        } catch (e) {
            console.error('Failed to submit:', e);
            alert('Có lỗi xảy ra, vui lòng thử lại');
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <motion.div
                className="modal-content"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={(e) => e.stopPropagation()}
            >
                <button className="modal-close" onClick={onClose}>&times;</button>

                {submitted ? (
                    <div className="modal-success">
                        <div className="success-icon">✓</div>
                        <h3>Gửi Thành Công!</h3>
                        <p>Chúng tôi sẽ liên hệ bạn trong thời gian sớm nhất.</p>
                        <Button onClick={onClose}>Đóng</Button>
                    </div>
                ) : (
                    <>
                        <h2>Đặt May: {product.name}</h2>
                        <form onSubmit={handleSubmit} className="consultation-form">
                            <div className="form-group">
                                <label>Họ Tên *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.customer_name}
                                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                                    placeholder="Nhập họ tên của bạn"
                                />
                            </div>
                            <div className="form-group">
                                <label>Số Điện Thoại *</label>
                                <input
                                    type="tel"
                                    required
                                    value={formData.customer_phone}
                                    onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                                    placeholder="Số điện thoại liên hệ"
                                />
                            </div>
                            <div className="form-group">
                                <label>Số Đo (Nếu Có)</label>
                                <textarea
                                    value={formData.measurements}
                                    onChange={(e) => setFormData({ ...formData, measurements: e.target.value })}
                                    placeholder="Ví dụ: Vòng 1: 84cm, Vòng 2: 66cm, Vòng 3: 90cm, Dài áo: 134cm..."
                                    rows={3}
                                />
                            </div>
                            <div className="form-group">
                                <label>Ghi Chú</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    placeholder="Yêu cầu đặc biệt, màu sắc, chất liệu..."
                                    rows={2}
                                />
                            </div>
                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                disabled={submitting}
                            >
                                {submitting ? 'Đang Gửi...' : 'Gửi Yêu Cầu'}
                            </Button>
                        </form>
                    </>
                )}
            </motion.div>
        </div>
    );
}
