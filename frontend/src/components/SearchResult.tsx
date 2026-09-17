import {useEffect, useState} from "react";
import Header from "./Header.tsx";
import {FiltersComponent} from './Filters.tsx'
import type {RootState} from "../store";
import {connect} from "react-redux";
import type {Action, ThunkDispatch} from "@reduxjs/toolkit";
import {fetchProductsThunk} from "../thunks/products.ts";
import {productFilterSelector, searchSelector} from "../selectors/products.ts";

const mapStateToProps = (state: RootState) => ({
    products: state.product.data,
    search: searchSelector(state),
    filters: productFilterSelector(state),
})

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, void, Action>) => ({ //action creator bindings
    onFetch: () => {
        dispatch(fetchProductsThunk())
    },
})

type SearchResultProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>
function SearchResult({products, onFetch, filters}: SearchResultProps) {
    const [heartHover, setHeartHover] = useState<number | null>(null);
    const [activeGender, setActiveGender] = useState("all");
    const [filtersOpen, setFiltersOpen] = useState(false);

    useEffect(() => {
        onFetch()
    }, [filters]);


    return (
        <>
            <Header />

            <main className="container-fluid px-5 py-4">

                {/* HEADER */}
                <div>
                    <p className="text-dark text-decoration-none m-0">SEARCH RESULTS</p>

                    <h2 className="fw-medium pb-4" style={{fontSize: "60px"}}>{filters.q.toUpperCase()}</h2>
                </div>

                {/* FILTER BAR */}
                <div className="border-bottom">

                    {/* CATEGORIES */}
                    <div className="d-flex gap-4">

                        <button type="button" className={`btn p-0 pb-3 border-0 rounded-0 position-relative 
                        ${activeGender === "all" ? "fw-semibold" : "fw-normal"}`}
                                // onClick={() => {
                                //     setActiveGender("all");
                                // }}
                            > ALL

                            {activeGender === "all" && (
                                <span
                                    className="position-absolute bottom-0 start-0 w-100"
                                    style={{
                                        height: "1px",
                                        backgroundColor: "#222"
                                    }}
                                />
                            )}
                        </button>

                        <button type="button" className={`btn p-0 pb-3 border-0 rounded-0 position-relative 
                        ${activeGender === "women" ? "fw-semibold" : "fw-normal"}`}
                                // onClick={() => {
                                // setProducts(allProducts.filter(product => product.gender === 'Women'))
                                // setActiveGender("women");
                                // }}
                            > WOMEN

                            {activeGender === "women" && (
                                <span
                                    className="position-absolute bottom-0 start-0 w-100"
                                    style={{
                                        height: "1px",
                                        backgroundColor: "#222"
                                    }}
                                />
                            )}
                        </button>

                        <button type="button" className={`btn p-0 pb-3 border-0 rounded-0 position-relative 
                        ${activeGender === "men" ? "fw-semibold" : "fw-normal"}`}
                        //         onClick={() => {
                        //         setProducts(allProducts.filter(product => product.gender === 'Men'))
                        //         setActiveGender("men");
                        // }}
                        > MEN
                            {activeGender === "men" && (
                                <span
                                    className="position-absolute bottom-0 start-0 w-100"
                                    style={{
                                        height: "1px",
                                        backgroundColor: "#222"
                                    }}
                                />
                            )}
                        </button>

                    </div>

                </div>

                {/* COUNT + FILTERS */}
                <div className="d-flex justify-content-between align-items-center py-3">

                    <small className="text-muted">{products.length} products</small>

                    <button
                        type="button"
                        className="btn p-0 border-0 d-flex align-items-center gap-2"
                        onClick={() => setFiltersOpen(true)}
                    >
                        FILTERS
                        <i className="bi bi-sliders"></i>
                    </button>

                    <FiltersComponent open={filtersOpen} onClose={() => setFiltersOpen(false)}/>

                </div>

                {/* RESULTS */}
                {products.length > 0 ? (
                    <div className="row g-0 pt-2">

                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="col-12 col-sm-6 col-md-4 col-lg-3"
                            >
                                <div className="product-card">

                                    {/* IMAGE */}
                                    <div className="position-relative mb-3">
                                        <img
                                            src={product.images[0]}
                                            alt={product.name.toUpperCase()}
                                            className="img-fluid w-100"
                                            style={{
                                                aspectRatio: "3 / 4",
                                                objectFit: "cover"
                                            }}
                                        />

                                        <button
                                            type="button"
                                            className="btn p-0 text-dark position-absolute bottom-0 end-0 m-3"
                                            onMouseEnter={() => setHeartHover(product.id)}
                                            onMouseLeave={() => setHeartHover(null)}
                                        >
                                            <i
                                                className={`bi ${
                                                    heartHover === product.id
                                                        ? "bi-heart-fill"
                                                        : "bi-heart"
                                                }`}
                                            ></i>
                                        </button>
                                    </div>

                                    {/* INFO */}
                                    <div>
                                        <h6 className="mb-1 fw-normal">
                                            {product.name.toUpperCase()}
                                        </h6>

                                        <p className="mb-2 fw-semibold">
                                            {product.price} zł
                                        </p>

                                        <div className="d-flex gap-2 pb-5">
                                            {product.colors.map((color) => (
                                                <span
                                                    key={color}
                                                    title={color}
                                                    style={{
                                                        width: "16px",
                                                        height: "16px",
                                                        borderRadius: "50%",
                                                        backgroundColor: color.toLowerCase(),
                                                        border: "1px solid #ccc",
                                                        display: "block"
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        ))}

                    </div>
                ) : (
                    <p className="text-muted">
                        <small>
                            No products found. Try searching for something else.
                        </small>
                    </p>
                )}

            </main>
        </>
    );
}

export const SearchResultContainer = connect(mapStateToProps, mapDispatchToProps)(SearchResult)