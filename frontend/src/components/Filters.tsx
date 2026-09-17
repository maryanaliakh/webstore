import {useEffect, useMemo, useState} from "react";
import type {RootState} from "../store";
import {productFilterSelector, searchSelector, sortParamSelector} from "../selectors/products.ts";
import type {Action, ThunkDispatch} from "@reduxjs/toolkit";
import {connect} from "react-redux";
import {clearSearchThunk, modifyUrlThunk} from "../thunks/common.ts";
import * as _ from "lodash"

interface ShowFiltersProps {
    open: boolean;
    onClose: () => void;
}

const mapStateToProps = (state: RootState) => ({
    products: state.product.data,
    search: searchSelector(state),
    filters: productFilterSelector(state),
    sort: sortParamSelector(state)
})

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, void, Action>) => ({ //action creator bindings
    onUpdate: (key: string, value: string | string[]) => dispatch(modifyUrlThunk(key, value)),
    onClear: () => dispatch(clearSearchThunk())
})

type FiltersProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & ShowFiltersProps
function Filters({filters, sort, open, onClose, onUpdate, onClear}: FiltersProps) {
     const [price, setPrice] = useState({min: 0, max: 500})

        useEffect(() => {
            document.body.style.overflow = open ? "hidden" : "";

            return () => {
                document.body.style.overflow = "";
            };
        }, [open])


    const updateFiltersPrice = useMemo(
        () =>
            _.debounce(() => {
                onUpdate("minPrice", price.min > 0 ? _.toString(price.min) : "");
                onUpdate("maxPrice", price.max < 500 ? _.toString(price.max) : "");
            }, 400),
        [price.min, price.max]
    );

    useEffect(() => {
        updateFiltersPrice();

        return () => updateFiltersPrice.cancel();
    }, [updateFiltersPrice]);


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

                            <button type="button" className="btn p-0 text-muted" onClick={() => {
                                onClear()
                                setPrice({min: 0, max: 500})
                            } }>
                                <small>CLEAR ALL</small>
                            </button>

                        </div>

                        <div className="d-flex flex-wrap gap-2">

                            {Object.entries(filters).map(([key, values]) => {
                                if (Array.isArray(values)) {
                                    return values.map(value => (
                                        <div key={`${key}-${value}`}>
                                            <button className="btn btn-light rounded-1 d-flex align-items-center gap-2" type="button" onClick={() => {
                                                onUpdate(key, _.without(values, value))
                                            }}>
                                                <small>{value}</small>
                                                <i className="bi bi-x"></i>
                                            </button>
                                        </div>
                                    ));
                                }

                                return null;
                            })}

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
                                    value="desc"
                                    checked={sort === "desc"}
                                    className="me-2"
                                    onChange={(e) => onUpdate('sort', e.target.value)}
                                />
                                Price: high to low
                            </label>

                            <label>
                                <input
                                    type="radio"
                                    name="sort"
                                    value="asc"
                                    checked={sort === "asc"}
                                    className="me-2"
                                    onChange={(e) => onUpdate('sort', e.target.value)}
                                />
                                Price: low to high
                            </label>

                        </div>

                    </div>


                    <div className="filter-section border-top pt-4 mt-4">

                        <h6 className="fw-normal mb-4">
                            PRICE
                        </h6>

                        <div className="d-flex justify-content-between mb-3">

                            <small>
                                {price.min || "0"} zł
                            </small>

                            <small>
                                {price.max || "500"} zł
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
                                min={0}
                                max={500}
                                value={price.min}
                                onChange={e => {
                                    if(e.target.value < price.max) {
                                        setPrice({
                                            ...price,
                                            min: _.toInteger(e.target.value)
                                        });
                                    }
                                }}
                            />

                            <input
                                type="range"
                                className="thumb thumb--zindex-3"
                                min={0}
                                max={500}
                                value={price.max}
                                onChange={e => {
                                    if(e.target.value > price.min) {
                                        setPrice({
                                            ...price,
                                            max: _.toInteger(e.target.value)
                                        });
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
                                        onChange={() => {
                                            filters.color.includes(color) ?
                                                onUpdate('color', _.without(filters.color, color))
                                            : onUpdate('color', _.union(filters.color, [color]))
                                        }}
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
                                    onClick={() =>  filters.size.includes(size) ?
                                        onUpdate('size', _.without(filters.size, size))
                                        : onUpdate('size', _.union(filters.size, [size]))
                                    }
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
                                        value={category}
                                        onChange={() => filters.category.includes(category) ?
                                            onUpdate('category', _.without(filters.category, category))
                                            : onUpdate('category', _.union(filters.category, [category]))}
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
                                        value={material}
                                        onChange={() => filters.material.includes(material) ?
                                            onUpdate('material', _.without(filters.material, material))
                                            : onUpdate('material', _.union(filters.material, [material]))}
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
                                        value={origin}
                                        onChange={() => filters.origin.includes(origin) ?
                                            onUpdate('origin', _.without(filters.origin, origin))
                                            : onUpdate('origin', _.union(filters.origin, [origin]))}
                                    />

                                    {origin}

                                </label>

                            ))}

                        </div>
                    </div>
                </div>
            </>
        );
    }

export const FiltersComponent = connect(mapStateToProps, mapDispatchToProps)(Filters)