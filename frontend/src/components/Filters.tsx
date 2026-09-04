import {useEffect, useMemo, useState} from "react";
import type {RootState} from "../../store";
import {colorParamSelector, productFilterSelector, searchSelector} from "../selectors/products.ts";
import type {Action, ThunkDispatch} from "@reduxjs/toolkit";
import {connect} from "react-redux";
import {modifyUrlThunk} from "../thunks/common.ts";

interface ShowFiltersProps {
    open: boolean;
    onClose: () => void;
}

const mapStateToProps = (state: RootState) => ({
    products: state.product.data,
    search: searchSelector(state),
    filters: productFilterSelector(state),
})

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, void, Action>) => ({ //action creator bindings
    onUpdate: (type: 'add' | 'delete', key: string, value?: string) => {
        dispatch(modifyUrlThunk(type, key, value))
    }
})

type FiltersProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & ShowFiltersProps
function Filters({filters, open, onClose, onUpdate}: FiltersProps) {
        useEffect(() => {
            document.body.style.overflow = open ? "hidden" : "";

            return () => {
                document.body.style.overflow = "";
            };
        }, [open])

        const colors = useMemo(() => filters.color, [filters.color])

        useEffect(() => {
            console.log(colors)
        }, [colors]);

        return (
            <>
                <div
                    className={`search-overlay ${open ? "open" : ""}`}
                    onClick={onClose}
                />

                <div className={`shipping-panel filters-panel ${open ? "open" : ""}`}>

                    <div className="d-flex justify-content-between align-items-center mb-5">

                        <h5 className="mb-0 fw-normal">
                            FILTERS
                        </h5>

                        <button
                            type="button"
                            className="btn p-0 fs-4"
                            onClick={onClose}
                        >
                            <i className="bi bi-x"></i>
                        </button>

                    </div>


                    <div className="border-bottom pb-4 mb-4">

                        <div className="d-flex justify-content-between align-items-center mb-3">

                            <h6 className="fw-normal mb-0">
                                SELECTED FILTERS
                            </h6>

                            <button
                                type="button"
                                className="btn p-0 text-muted"

                            >
                                <small>CLEAR ALL</small>
                            </button>

                        </div>

                        <div className="d-flex flex-wrap gap-2">

                            {/*// <button*/}
                            {/*//     key={`${key}-${value}`}*/}
                            {/*//     type="button"*/}
                            {/*//     className="btn btn-light rounded-1 d-flex align-items-center gap-2"*/}
                            {/*//     onClick={() => removeFilter(key as keyof Filters, value)}*/}
                            {/*// >*/}
                            {/*//     <small>{value}</small>*/}
                            {/*//     <i className="bi bi-x"></i>*/}
                            {/*// </button>*/}

                        </div>

                    </div>


                    <div className="filter-section">

                        <h6 className="fw-normal mb-4">
                            SORT BY
                        </h6>

                        <div className="d-flex flex-column gap-3">

                            <label>
                                <input
                                    type="radio"
                                    name="sort"
                                    value="low"
                                    // checked={sortBy === "low"}
                                    className="me-2"
                                    // onChange={() => updateFilter('low')}
                                />
                                Price: low to high
                            </label>

                            <label>
                                <input
                                    type="radio"
                                    name="sort"
                                    value="high"
                                    // checked={sortBy === "high"}
                                    className="me-2"
                                    // onChange={() => setSortBy('high')}
                                />
                                Price: high to low
                            </label>

                        </div>

                    </div>


                    <div className="filter-section border-top pt-4 mt-4">

                        <h6 className="fw-normal mb-4">
                            PRICE
                        </h6>

                        <div className="d-flex justify-content-between mb-3">

                            <small>
                                {filters.minPrice || "0"} zł
                            </small>

                            <small>
                                {filters.maxPrice || "500"} zł
                            </small>

                        </div>

                        <div className="slider w-100">

                            <div className="slider__track"/>

                            <div className="slider__range" style={{
                                left: `${(filters.minPrice / 500) * 100}%`,
                                right: `${100 - (filters.maxPrice / 500) * 100}%`
                            }}/>

                            <input
                                type="range"
                                className="thumb thumb--zindex-3"
                                min="0"
                                max="500"
                                value={filters.minPrice}
                                onChange={(e) => {
                                    const value = (e.target.value).toString();
                                    if (value <= filters.maxPrice) {
                                        onUpdate('add', 'minPrice', value)
                                    }
                                }}
                            />

                            <input
                                type="range"
                                className="thumb thumb--zindex-4"
                                min="0"
                                max="500"
                                value={filters.maxPrice}
                                onChange={(e) => {
                                    const value = (e.target.value).toString();
                                    if (value >= filters.minPrice) {
                                        onUpdate('add', 'maxPrice', value)
                                    }
                                }}
                            />

                        </div>

                    </div>


                    {/* COLOR */}
                    <div className="filter-section border-top pt-4 mt-4">
                        <h6 className="fw-normal mb-4">
                            COLOR
                        </h6>

                        <div className="d-flex flex-column gap-3">

                            {["Black", "White", "Beige", "Blue", "Red"].map(color => (
                                <label
                                    key={color}
                                    className="d-flex align-items-center gap-2"
                                >
                                    <input
                                        type="checkbox"
                                        checked={filters.color.includes(color)}
                                        value={color}
                                        onChange={() => onUpdate('add', 'color', color)}
                                    />

                                    {color}

                                </label>
                            ))}
                        </div>
                    </div>


                    {/* SIZE */}
                    <div className="filter-section border-top pt-4 mt-4">

                        <h6 className="fw-normal mb-4">
                            SIZE
                        </h6>

                        <div className="d-flex flex-wrap gap-2">

                            {["XS", "S", "M", "L", "XL"].map(size => (

                                <button
                                    key={size}
                                    type="button"
                                    className={`btn ${
                                        filters.size.includes(size)
                                            ? "btn-dark"
                                            : "btn-light"
                                    }`}
                                    onChange={() => onUpdate('add', 'size', size)}
                                >
                                    {size}
                                </button>

                            ))}

                        </div>

                    </div>


                    {/* CATEGORY */}
                    <div className="filter-section border-top pt-4 mt-4">

                        <h6 className="fw-normal mb-4">
                            CATEGORY
                        </h6>

                        <div className="d-flex flex-column gap-3">

                            {[
                                "Dresses",
                                "T-Shirts",
                                "Jeans",
                                "Trousers",
                                "Jackets",
                                "Shoes",
                                "Accessories"
                            ].map(category => (

                                <label key={category}>

                                    <input
                                        type="checkbox"
                                        className="me-2"
                                        checked={filters.category.includes(category)}
                                        onChange={() => onUpdate('add', 'category', category)}
                                    />

                                    {category}

                                </label>

                            ))}

                        </div>

                    </div>


                    {/* MATERIAL */}
                    <div className="filter-section border-top pt-4 mt-4">

                        <h6 className="fw-normal mb-4">
                            MATERIAL
                        </h6>

                        <div className="d-flex flex-column gap-3">

                            {[
                                "Cotton",
                                "Linen",
                                "Wool",
                                "Polyester",
                                "Leather"
                            ].map(material => (

                                <label key={material}>

                                    <input
                                        type="checkbox"
                                        className="me-2"
                                        checked={filters.material.includes(material)}
                                        onChange={() => onUpdate('add', 'material', material)}
                                    />

                                    {material}

                                </label>

                            ))}

                        </div>

                    </div>


                    {/* ORIGIN */}
                    <div className="filter-section border-top pt-4 mt-4 mb-5">

                        <h6 className="fw-normal mb-4">
                            ORIGIN
                        </h6>

                        <div className="d-flex flex-column gap-3">

                            {[
                                "Poland",
                                "Italy",
                                "France",
                                "Portugal",
                                "Spain"
                            ].map(origin => (

                                <label key={origin}>

                                    <input
                                        type="checkbox"
                                        className="me-2"
                                        checked={filters.origin.includes(origin)}
                                        onChange={() => onUpdate('add', 'origin', origin)}
                                    />

                                    {origin}

                                </label>

                            ))}

                        </div>

                    </div>


                    <button
                        type="button"
                        className="btn btn-dark w-100 py-3"
                    >
                        APPLY FILTERS
                    </button>

                </div>
            </>
        );
    }

export const FiltersComponent = connect(mapStateToProps, mapDispatchToProps)(Filters)