import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {getProduct} from "../api/products.ts";

interface SingleProduct {
    id: number;
    name: string;
    subtitle: string;
    price: string;
    category: string;

    variants: {
        id: number;
        size: string;
        color: string;
        stock: number;
    }[];

    images: {
        id: number;
        color: string;
        url: string;
    }[];

    gender: string;
    description: string;
    material: string;
    care: string;
    origin: string;
}

interface ShipReturn {
    shipOptions: {
        id: number,
        name: string,
        description: string,
        price: string,
        delivery_time: string
    }[],
    returnOptions: {
        id: number,
        name: string,
        description: string,
        price: string
    }[],
    returnPolicy: {
        id: number,
        title: string,
        description: string
    }[]
}

export function SingleProduct() {
    const { id } = useParams();

    const [product, setProduct] = useState<SingleProduct | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>( null);
    const [selectedSize, setSelectedSize] = useState<string | null>( null);
    const [shipReturnOptions, setShipReturnOptions] = useState<ShipReturn | null>(null);
    const [shippingOpen, setShippingOpen] = useState(false);

    const fetchData = async () => {
        try {
            const {product, shipReturn} = await getProduct(id);

            setProduct(product);
            setShipReturnOptions(shipReturn);

            if (product.variants.length > 0) {
                setSelectedColor(product.variants[0].color);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (id) {
            fetchData();
        }
    }, [id]);

    useEffect(() => {
        document.body.style.overflow = shippingOpen ? "hidden" : "";

        return () => {
            document.body.style.overflow = "";
        };
    }, [shippingOpen]);

    if (!product) {
        return <p>Loading...</p>;
    }

    const colors = [
        ...new Set(product.variants.map((variant) => variant.color))
    ];

    const sizes = product.variants.filter(
        (variant) => variant.color === selectedColor
    );

    const images = product.images.filter(
        (image) => image.color === selectedColor
    );

    return (
        <>
            <Header />

            <main className="container-fluid py-6 px-5">
                <div className="row g-4">

                    <div className="col-lg-7">
                        <div className="d-flex flex-column gap-3">
                            {images.map((image) => (
                                <img
                                    key={image.id}
                                    src={image.url}
                                    alt={`${product.name} ${image.color}`}
                                    className="img-fluid w-100"
                                />
                            ))}
                        </div>
                    </div>

                    {/* RIGHT - PRODUCT INFO */}
                    <div className="col-lg-5 pt-5 pb-4 mt-4">
                        <div
                            className="col-lg-11 ms-auto"
                            style={{
                                position: "sticky",
                                top: "130px",
                                alignSelf: "flex-start"
                            }}
                        >
                            <h6 className="mb-2 fw-semibold">{product.name.toUpperCase()}</h6>

                            <p className="text-muted mb-4 "><small>{product.subtitle}</small></p>

                            <h6 className="mb-4 fw-semibold">{product.price} zł</h6>

                            {/* COLORS */}
                            <div className="mb-4">
                                <h6 className="fw-normal mb-3"><small>{selectedColor.toUpperCase()}</small></h6>

                                <div className="d-flex gap-3">
                                    {colors.map((color) => (
                                        <button key={color} type="button"
                                            onClick={() => {
                                                setSelectedColor(color);
                                                setSelectedSize(null);
                                            }}
                                            className="p-0 border-0 bg-transparent"
                                            title={color}
                                        >
                                        <span style={{
                                                display: "block",
                                                width: "28px",
                                                height: "28px",
                                                borderRadius: "50%",
                                                backgroundColor: color.toLowerCase(),
                                                border: "1px solid #ccc",
                                                boxShadow:
                                                    selectedColor === color
                                                        ? "0 0 0 2px white, 0 0 0 3px black"
                                                        : "none"
                                            }} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* SIZES */}
                            <div className="mb-5">
                                <h6 className="fw-normal mb-2"><small>SIZE</small></h6>

                                <div className="d-flex gap-2">
                                    {sizes.map((variant) => (
                                        <button
                                            key={variant.id}
                                            type="button"
                                            disabled={variant.stock === 0}
                                            onClick={() => setSelectedSize(variant.size)}
                                            className={`btn ${
                                                selectedSize === variant.size
                                                    ? "btn-dark"
                                                    : "btn-light"
                                            }`}
                                        >
                                            {variant.size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button className="btn btn-dark w-100 py-3 mb-3"><small>ADD TO BAG</small></button>

                            <button
                                type="button"
                                className="btn btn-light w-100 py-3 mb-5 d-flex align-items-center justify-content-center"
                            >
                                <small className="d-flex align-items-center gap-2">
                                    ADD TO WISHLIST
                                    <i className="bi bi-heart"></i>
                                </small>
                            </button>

                            {/* DESCRIPTION */}
                            <div className="border-top pt-5">
                                <h6 className="fw-normal mb-2"><small>DESCRIPTION</small></h6>

                                <p className="text-muted"><small>{product.description}</small></p>

                                <h6 className="fw-normal mb-2"><small>MATERIAL</small></h6>

                                <p className="text-muted"><small>{product.material}</small></p>

                                <h6 className="fw-normal mb-2"><small>CARE</small></h6>

                                <p className="text-muted"><small>{product.care}</small></p>

                                <h6 className="fw-normal mb-2"><small>ORIGIN</small></h6>

                                <p className="text-muted"><small>{product.origin}</small></p>
                            </div>

                            {/* SHIPPING & RETURNS */}
                            <div className="border-top mt-5 pt-3">
                                <button type="button" className="shipping-returns-button"
                                    onClick={() => setShippingOpen(true)}
                                >
                                    <h6 className="fw-normal"><small>SHIPPING & RETURNS</small></h6>
                                    <i className="bi bi-arrow-right"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />

            <div className={`search-overlay ${shippingOpen ? "open" : ""}`} onClick={() => setShippingOpen(false)}/>
            <div className={`shipping-panel ${shippingOpen ? "open" : ""}`}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <a href="#" className="text-dark text-decoration-none">SHIPPING & RETURNS</a>

                    <button
                        type="button"
                        className="btn p-0 fs-4"
                        onClick={() => setShippingOpen(false)}
                    >
                        <i className="bi bi-x"></i>
                    </button>
                </div>

                {/* SHIPPING */}
                <div className="mb-4">
                    <h6 className="fw-normal pb-2"><small>SHIPPING</small></h6>

                    {shipReturnOptions?.shipOptions.map((option) => (
                        <div key={option.id} className="mb-4">

                            <div className="d-flex justify-content-between mb-1">
                                <small className="fw-normal">{option.name.toUpperCase()}</small>
                                <small>{option.price === '0.00' ? "FREE" : `${option.price} zł`}</small>
                            </div>

                            <p className="text-muted mb-1"><small>{option.description}</small></p>

                            <small className="text-muted">{option.delivery_time}</small>
                        </div>
                    ))}
                </div>

                {/* RETURNS */}
                <div className="pt-4 mb-4">
                    <h6 className="fw-normal pb-2"><small>RETURNS</small></h6>

                    {shipReturnOptions?.returnOptions.map((option) => (
                        <div key={option.id} className="mb-4">

                            <div className="d-flex justify-content-between mb-1">

                                <small className="fw-normal">{option.name.toUpperCase()}</small>

                                <small>{option.price === '0.00' ? "FREE" : `${option.price} zł`}</small>

                            </div>

                            <p className="text-muted mb-0">
                                <small>{option.description}</small>
                            </p>
                        </div>
                    ))}
                </div>

                {/* RETURN POLICY */}
                <div className="pt-4">
                    <h6 className="fw-normal pb-2"><small>RETURN POLICY</small></h6>

                    {shipReturnOptions?.returnPolicy.map((policy) => (
                        <div key={policy.id} className="mb-4">
                            <small className="fw-normal">{policy.title.toUpperCase()}</small>
                            <p className="text-muted mb-0"><small>{policy.description}</small></p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}