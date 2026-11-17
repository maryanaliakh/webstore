import { RootState } from "../../store";
import type { Action, ThunkDispatch } from "@reduxjs/toolkit";
import { connect } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCategoriesThunk } from "../../thunks/category.ts";
import * as commonThunk from "../../thunks/common.ts";
import accessories from "../../videos/acc.mp4"

const mapStateToProps = (state: RootState) => ({
    categories: state.category.data,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, void, Action>) => ({
    onFetchCategories: () => dispatch(fetchCategoriesThunk()),
    onUpdate: (key: string, value: string) => dispatch(commonThunk.modifyUrlThunk(key, value)),
});

type CategoriesProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

function Categories({ categories, onUpdate, onFetchCategories }: CategoriesProps) {
    const navigate = useNavigate();
    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

    useEffect(() => {
        onFetchCategories();
    }, []);

    const regularCategories = categories.filter(
        category => category.name.toLowerCase() !== "accessories"
    );

    const accessoriesCategory = categories.find(
        category => category.name.toLowerCase() === "accessories"
    );

    return (
        <section className="container-fluid px-0 position-relative bg-white" style={{ zIndex: 1 }}>
            <div className="row g-0">
                {regularCategories.map(category => (
                    <div
                        className="col-6 col-md-3"
                        key={category.id}
                        onMouseEnter={() => setHoveredCategory(category.name)}
                        onMouseLeave={() => setHoveredCategory(null)}
                    >
                        <button
                            type="button"
                            className="position-relative w-100 border-0 p-0 overflow-hidden bg-dark text-white"
                            onClick={() => {
                                navigate("/products");
                                onUpdate("category", category.name.toLowerCase());
                            }}
                            style={{
                                display: "block",
                                opacity: hoveredCategory && hoveredCategory !== category.name ? 0.45 : 1,
                                transition: "opacity 0.3s ease"
                            }}
                        >
                            <img
                                src={category.image}
                                alt={category.name}
                                className="w-100 d-block pb-4"
                                loading="lazy"
                                style={{
                                    height: "clamp(220px, 32vw, 460px)",
                                    objectFit: "cover",
                                }}
                            />

                            <span
                                className="position-absolute top-0 start-0 w-100 h-100"
                                style={{
                                    background: "linear-gradient(0deg, rgba(0,0,0,.20), transparent 55%)"
                                }}
                            />

                            <span className="position-absolute bottom-0 start-0 w-100 bg-black text-white">
                                <div className="d-block small fs-6 fw-bold text-start ps-2">
                                    {category.name.toUpperCase()}
                                </div>
                            </span>
                        </button>
                    </div>
                ))}
            </div>

            {/* LARGE FIFTH CATEGORY */}
            {accessoriesCategory && (
                <button
                    type="button"
                    className="d-block position-relative w-100 border-0 p-0 m-0 overflow-hidden text-center"
                    style={{ lineHeight: 0, verticalAlign: "top" }}
                    onClick={() => {
                        onUpdate("category", accessoriesCategory.name.toLowerCase());
                        navigate("/products");
                    }}
                >
                    <video
                        src={accessories}
                        poster={accessoriesCategory.image}
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="metadata"
                        className="w-100 d-block m-0"
                        style={{
                            height: "clamp(300px, 55vw, 650px)",
                            objectFit: "cover",
                            objectPosition: "center 30%",
                            pointerEvents: "none"
                        }}
                    />

                    <div
                        className="position-absolute top-0 start-0 w-100 h-100"
                        style={{
                            backgroundColor: "rgba(0, 0, 0, 0.08)"
                        }}
                    />

                    <span
                        className="position-absolute bottom-0 start-50 translate-middle-x text-center mb-3"
                        style={{
                            backgroundColor: "rgba(250, 247, 240, 0.85)"
                        }}
                    >
            <span className="d-block fw-bold mb-0 text-dark text-center px-1 py-1 fs-3 display-3">
                {accessoriesCategory.name.toUpperCase()}
            </span>
        </span>
                </button>
            )}
        </section>
    );
}

export const CategoriesComponent = connect(mapStateToProps, mapDispatchToProps)(Categories);