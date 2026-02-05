'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Body type calculation
function calculateBodyType(bust: number, waist: number, hips: number): { type: string; description: string; recommendation: string } {
    const bustWaistDiff = bust - waist;
    const hipsWaistDiff = hips - waist;

    if (bustWaistDiff >= 10 && hipsWaistDiff >= 10 && Math.abs(bust - hips) <= 5) {
        return {
            type: 'Đồng Hồ Cát',
            description: 'Tỉ lệ cân đối hoàn hảo',
            recommendation: 'Áo Dài Ngũ Thân sẽ tôn vinh đường cong tuyệt mỹ của bạn!'
        };
    } else if (hips > bust + 5) {
        return {
            type: 'Quả Lê',
            description: 'Hông rộng, eo thon',
            recommendation: 'Áo Dài tứ thân sẽ cân bằng hoàn hảo tỉ lệ cơ thể.'
        };
    } else if (bust > hips + 5) {
        return {
            type: 'Tam Giác Ngược',
            description: 'Vai rộng, dáng thanh',
            recommendation: 'Áo Dài cổ cao sẽ tạo sự cân đối tuyệt vời.'
        };
    } else if (bustWaistDiff < 8 && hipsWaistDiff < 8) {
        return {
            type: 'Chữ H',
            description: 'Dáng thẳng thanh thoát',
            recommendation: 'Áo Dài cách tân sẽ tạo đường cong mềm mại.'
        };
    }
    return {
        type: 'Quý Phái',
        description: 'Dáng người độc đáo',
        recommendation: 'Áo Dài may đo sẽ tôn vinh vẻ đẹp riêng của bạn!'
    };
}

// SVG Mannequin Component
const MannequinSVG = ({ activeStep, measurements }: {
    activeStep: number;
    measurements: { bust: number; waist: number; hips: number; height: number }
}) => {
    const getGlowClass = (part: string) => {
        if (activeStep === 1 && part === 'bust') return 'mannequin-glow active';
        if (activeStep === 2 && part === 'waist') return 'mannequin-glow active';
        if (activeStep === 3 && part === 'hips') return 'mannequin-glow active';
        if (activeStep === 4 && part === 'height') return 'mannequin-glow active';
        return 'mannequin-glow';
    };

    return (
        <div className="mannequin-container">
            <svg viewBox="0 0 200 400" className="mannequin-svg">
                {/* Body outline - artistic stroke style */}
                <defs>
                    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#c9a227" />
                        <stop offset="50%" stopColor="#f0d060" />
                        <stop offset="100%" stopColor="#c9a227" />
                    </linearGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Head */}
                <ellipse cx="100" cy="40" rx="25" ry="30"
                    fill="none" stroke="url(#goldGradient)" strokeWidth="1.5" opacity="0.6" />

                {/* Neck */}
                <path d="M90 70 L90 85 M110 70 L110 85"
                    stroke="url(#goldGradient)" strokeWidth="1.5" opacity="0.6" />

                {/* Shoulders */}
                <path d="M60 95 Q80 90 100 90 Q120 90 140 95"
                    fill="none" stroke="url(#goldGradient)" strokeWidth="1.5" opacity="0.6" />

                {/* Bust area - interactive */}
                <g className={getGlowClass('bust')}>
                    <path d="M60 95 Q55 115 58 135 Q70 145 100 145 Q130 145 142 135 Q145 115 140 95"
                        fill="none" stroke="url(#goldGradient)" strokeWidth="2"
                        filter={activeStep === 1 ? "url(#glow)" : undefined} />
                    {activeStep === 1 && (
                        <text x="100" y="125" textAnchor="middle" fill="#c9a227" fontSize="12" fontFamily="var(--font-nav)">
                            {measurements.bust} cm
                        </text>
                    )}
                </g>

                {/* Waist area - interactive */}
                <g className={getGlowClass('waist')}>
                    <path d="M58 135 Q65 165 70 180 Q85 185 100 185 Q115 185 130 180 Q135 165 142 135"
                        fill="none" stroke="url(#goldGradient)" strokeWidth="2"
                        filter={activeStep === 2 ? "url(#glow)" : undefined} />
                    {activeStep === 2 && (
                        <text x="100" y="170" textAnchor="middle" fill="#c9a227" fontSize="12" fontFamily="var(--font-nav)">
                            {measurements.waist} cm
                        </text>
                    )}
                </g>

                {/* Hips area - interactive */}
                <g className={getGlowClass('hips')}>
                    <path d="M70 180 Q60 210 55 240 Q70 250 100 250 Q130 250 145 240 Q140 210 130 180"
                        fill="none" stroke="url(#goldGradient)" strokeWidth="2"
                        filter={activeStep === 3 ? "url(#glow)" : undefined} />
                    {activeStep === 3 && (
                        <text x="100" y="225" textAnchor="middle" fill="#c9a227" fontSize="12" fontFamily="var(--font-nav)">
                            {measurements.hips} cm
                        </text>
                    )}
                </g>

                {/* Legs */}
                <path d="M55 240 Q60 300 65 360 M85 250 Q90 300 95 360"
                    fill="none" stroke="url(#goldGradient)" strokeWidth="1.5" opacity="0.6" />
                <path d="M145 240 Q140 300 135 360 M115 250 Q110 300 105 360"
                    fill="none" stroke="url(#goldGradient)" strokeWidth="1.5" opacity="0.6" />

                {/* Height line - when active */}
                {activeStep === 4 && (
                    <g opacity="0.8" className="mannequin-glow active">
                        <line x1="170" y1="30" x2="170" y2="360" stroke="#c9a227" strokeWidth="1.5" strokeDasharray="4 4" filter="url(#glow)" />
                        <text x="180" y="200" fill="#c9a227" fontSize="11" fontFamily="var(--font-nav)" transform="rotate(90 180 200)">
                            {measurements.height} cm
                        </text>
                    </g>
                )}

                {/* Decorative measurement tape animation */}
                <circle cx="100" cy="200" r="80" fill="none" stroke="#c9a227" strokeWidth="0.5"
                    strokeDasharray="2 6" opacity="0.3" className="rotate-slow" />
            </svg>
        </div>
    );
};

// Custom Range Slider
const MeasurementSlider = ({
    value,
    onChange,
    min,
    max,
    label,
    unit = 'cm'
}: {
    value: number;
    onChange: (v: number) => void;
    min: number;
    max: number;
    label: string;
    unit?: string;
}) => {
    return (
        <div className="measurement-slider">
            <div className="slider-header">
                <span className="slider-label">{label}</span>
                <div className="slider-value">
                    <motion.span
                        key={value}
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="value-number"
                    >
                        {value}
                    </motion.span>
                    <span className="value-unit">{unit}</span>
                </div>
            </div>
            <div className="slider-track-container">
                <button
                    className="slider-btn"
                    onClick={() => onChange(Math.max(min, value - 1))}
                    aria-label="Giảm"
                >
                    −
                </button>
                <div className="slider-track">
                    <input
                        type="range"
                        min={min}
                        max={max}
                        value={value}
                        onChange={(e) => onChange(Number(e.target.value))}
                        className="slider-input"
                    />
                    <div
                        className="slider-fill"
                        style={{ width: `${((value - min) / (max - min)) * 100}%` }}
                    />
                </div>
                <button
                    className="slider-btn"
                    onClick={() => onChange(Math.min(max, value + 1))}
                    aria-label="Tăng"
                >
                    +
                </button>
            </div>
        </div>
    );
};

export default function MeasurementJourney() {
    const sectionRef = useRef<HTMLElement>(null);
    const [isActive, setIsActive] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    const [measurements, setMeasurements] = useState({
        bust: 88,
        waist: 68,
        hips: 94,
        height: 160
    });

    const updateMeasurement = (key: keyof typeof measurements, value: number) => {
        setMeasurements(prev => ({ ...prev, [key]: value }));
    };

    const handleNext = () => {
        if (currentStep < 4) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        } else {
            setCurrentStep(0);
            setIsActive(false);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsSubmitting(false);
        setIsComplete(true);
    };

    const bodyType = calculateBodyType(measurements.bust, measurements.waist, measurements.hips);

    const stepVariants = {
        enter: { x: 50, opacity: 0 },
        center: { x: 0, opacity: 1 },
        exit: { x: -50, opacity: 0 }
    };

    return (
        <section ref={sectionRef} className="measurement-journey">
            <div className="measurement-container">
                <AnimatePresence mode="wait">
                    {!isActive && !isComplete && (
                        <motion.div
                            key="welcome"
                            className="measurement-welcome"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                        >
                            <span className="section-label-premium light">May Đo</span>
                            <h2 className="measurement-title">
                                Kiến Tạo Tác Phẩm<br />
                                <span className="title-accent">Từ Số Đo Của Bạn</span>
                            </h2>
                            <p className="measurement-subtitle">
                                Mỗi đường cong là một câu chuyện. Hãy để chúng tôi lắng nghe.
                            </p>
                            <motion.button
                                className="btn-start-measure"
                                onClick={() => { setIsActive(true); setCurrentStep(1); }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <span>Thiết Kế Số Đo Riêng Của Bạn</span>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </motion.button>
                        </motion.div>
                    )}

                    {isActive && !isComplete && (
                        <motion.div
                            key="journey"
                            className="measurement-journey-content"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {/* Left: Mannequin */}
                            <div className="journey-visual">
                                <MannequinSVG activeStep={currentStep} measurements={measurements} />
                                <div className="journey-progress">
                                    {[1, 2, 3, 4].map((step) => (
                                        <div
                                            key={step}
                                            className={`progress-dot ${currentStep >= step ? 'active' : ''}`}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Right: Input Steps */}
                            <div className="journey-input">
                                <AnimatePresence mode="wait">
                                    {currentStep === 1 && (
                                        <motion.div
                                            key="step1"
                                            className="input-step"
                                            variants={stepVariants}
                                            initial="enter"
                                            animate="center"
                                            exit="exit"
                                        >
                                            <span className="step-indicator">Bước 1 / 4</span>
                                            <h3 className="step-question">Số đo vòng ngực của bạn?</h3>
                                            <MeasurementSlider
                                                value={measurements.bust}
                                                onChange={(v) => updateMeasurement('bust', v)}
                                                min={70}
                                                max={120}
                                                label="Vòng 1 (Bust)"
                                            />
                                            <p className="step-hint">Đo vòng qua điểm cao nhất của ngực</p>
                                        </motion.div>
                                    )}

                                    {currentStep === 2 && (
                                        <motion.div
                                            key="step2"
                                            className="input-step"
                                            variants={stepVariants}
                                            initial="enter"
                                            animate="center"
                                            exit="exit"
                                        >
                                            <span className="step-indicator">Bước 2 / 4</span>
                                            <h3 className="step-question">Số đo vòng eo của bạn?</h3>
                                            <MeasurementSlider
                                                value={measurements.waist}
                                                onChange={(v) => updateMeasurement('waist', v)}
                                                min={55}
                                                max={100}
                                                label="Vòng 2 (Waist)"
                                            />
                                            <p className="step-hint">Đo vòng qua phần nhỏ nhất của eo</p>
                                        </motion.div>
                                    )}

                                    {currentStep === 3 && (
                                        <motion.div
                                            key="step3"
                                            className="input-step"
                                            variants={stepVariants}
                                            initial="enter"
                                            animate="center"
                                            exit="exit"
                                        >
                                            <span className="step-indicator">Bước 3 / 4</span>
                                            <h3 className="step-question">Số đo vòng hông của bạn?</h3>
                                            <MeasurementSlider
                                                value={measurements.hips}
                                                onChange={(v) => updateMeasurement('hips', v)}
                                                min={80}
                                                max={130}
                                                label="Vòng 3 (Hips)"
                                            />
                                            <p className="step-hint">Đo vòng qua điểm rộng nhất của hông</p>
                                        </motion.div>
                                    )}

                                    {currentStep === 4 && (
                                        <motion.div
                                            key="step4"
                                            className="input-step"
                                            variants={stepVariants}
                                            initial="enter"
                                            animate="center"
                                            exit="exit"
                                        >
                                            <span className="step-indicator">Bước 4 / 4</span>
                                            <h3 className="step-question">Chiều cao của bạn?</h3>
                                            <MeasurementSlider
                                                value={measurements.height}
                                                onChange={(v) => updateMeasurement('height', v)}
                                                min={145}
                                                max={185}
                                                label="Chiều cao (Height)"
                                            />
                                            <p className="step-hint">Chiều cao từ đỉnh đầu đến mặt đất</p>

                                            {/* Body type feedback */}
                                            <motion.div
                                                className="body-type-feedback"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.3 }}
                                            >
                                                <span className="body-type-label">Dáng người của bạn:</span>
                                                <span className="body-type-name">{bodyType.type}</span>
                                                <p className="body-type-recommendation">{bodyType.recommendation}</p>
                                            </motion.div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Navigation */}
                                <div className="step-navigation">
                                    <motion.button
                                        className="btn-nav btn-back"
                                        onClick={handleBack}
                                        whileHover={{ x: -3 }}
                                    >
                                        ← Quay lại
                                    </motion.button>

                                    {currentStep < 4 ? (
                                        <motion.button
                                            className="btn-nav btn-next"
                                            onClick={handleNext}
                                            whileHover={{ x: 3 }}
                                        >
                                            Tiếp theo →
                                        </motion.button>
                                    ) : (
                                        <motion.button
                                            className="btn-nav btn-submit"
                                            onClick={handleSubmit}
                                            disabled={isSubmitting}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            {isSubmitting ? (
                                                <span className="loading-needle">
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M12 2L12 22M2 12L22 12" className="needle-animate" />
                                                    </svg>
                                                    Đang xử lý...
                                                </span>
                                            ) : (
                                                'Hoàn tất ✓'
                                            )}
                                        </motion.button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {isComplete && (
                        <motion.div
                            key="complete"
                            className="measurement-complete"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* VIP Digital Card */}
                            <motion.div
                                className="digital-card"
                                initial={{ rotateY: 180 }}
                                animate={{ rotateY: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                            >
                                <div className="card-header">
                                    <span className="card-label">Thẻ Số Đo Điện Tử</span>
                                    <span className="card-brand">Hỷ Lạc Việt</span>
                                </div>
                                <div className="card-body">
                                    <div className="card-measurement">
                                        <span className="m-label">Vòng 1</span>
                                        <span className="m-value">{measurements.bust} cm</span>
                                    </div>
                                    <div className="card-measurement">
                                        <span className="m-label">Vòng 2</span>
                                        <span className="m-value">{measurements.waist} cm</span>
                                    </div>
                                    <div className="card-measurement">
                                        <span className="m-label">Vòng 3</span>
                                        <span className="m-value">{measurements.hips} cm</span>
                                    </div>
                                    <div className="card-measurement">
                                        <span className="m-label">Chiều cao</span>
                                        <span className="m-value">{measurements.height} cm</span>
                                    </div>
                                </div>
                                <div className="card-footer">
                                    <span className="body-type-badge">{bodyType.type}</span>
                                    <p className="card-recommendation">{bodyType.recommendation}</p>
                                </div>
                            </motion.div>

                            <motion.div
                                className="complete-actions"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                            >
                                <button
                                    className="btn-contact"
                                    onClick={() => window.location.href = '/lien-he'}
                                >
                                    Liên Hệ Đặt May
                                </button>
                                <button
                                    className="btn-restart"
                                    onClick={() => { setIsComplete(false); setIsActive(false); setCurrentStep(0); }}
                                >
                                    Đo Lại
                                </button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
