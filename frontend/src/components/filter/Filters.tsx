import {useEffect, useMemo, useState} from "react";
import type {RootState} from "../../store";
import {productFilterSelector, searchSelector, sortParamSelector} from "../../selectors/product.ts";
import type {Action, ThunkDispatch} from "@reduxjs/toolkit";
import {connect} from "react-redux";
import {clearSearchThunk, modifyUrlThunk} from "../../thunks/common.ts";
import * as _ from "lodash"
import {fetchProductFilterOptionsThunk} from "../../thunks/product.ts";
import CollapsibleFilter from "../../components/filter/CollapsibleFilter.tsx";

interface ShowFiltersProps {
    open: boolean;
    onClose: () => void;
}

const mapStateToProps = (state: RootState) => ({
    products: state.product.data,
    search: searchSelector(state),
    filters: productFilterSelector(state),
    sort: sortParamSelector(state),
    options: state.productFilterOptions.all
})

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, void, Action>) => ({ //action creator bindings
    onUpdate: (key: string, value: string | string[]) => dispatch(modifyUrlThunk(key, value)),
    onClear: () => dispatch(clearSearchThunk()),
    onFetchFilterOptions: () => dispatch(fetchProductFilterOptionsThunk())
})

type FiltersProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & ShowFiltersProps
function Filters({filters, sort, open, options, onClose, onUpdate, onClear, onFetchFilterOptions}: FiltersProps) {
     const [price, setPrice] = useState({min: 0, max: 500})

    useEffect(() => {
        onFetchFilterOptions()
    }, [onFetchFilterOptions])


    useEffect(() => {
        setPrice({
            min: options.minPrice,
            max: options.maxPrice
        });
    }, [options.minPrice, options.maxPrice]);


    const updateFiltersPrice = useMemo(
        () =>
            _.debounce(() => {
                onUpdate("minPrice", price.min > options.minPrice ? _.toString(price.min) : "");
                onUpdate("maxPrice", price.max < options.maxPrice ? _.toString(price.max) : "");
            }, 400),
        [price.min, price.max, options.minPrice, options.maxPrice]
    );

    const hasSelectedFilters = Object.values(filters).some(
        values => Array.isArray(values) && values.length > 0
    );

    useEffect(() => {
        updateFiltersPrice();

        return () => updateFiltersPrice.cancel();
    }, [updateFiltersPrice]);

    if (!open) return null;

        return (
            <>
                <div
                    className="search-overlay open"
                    onClick={onClose}
                />

                <div className="shipping-panel filters-panel open">
                    {hasSelectedFilters && (
                        <div className="mb-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h6 className="fw-semibold mb-0 small">
                                    SELECTED FILTERS
                                </h6>

                                <button
                                    type="button"
                                    className="btn p-0 text-muted"
                                    onClick={() => {
                                        onClear();
                                        setPrice({min: options.minPrice, max: options.maxPrice});
                                    }}
                                >
                                    <small>CLEAR ALL</small>
                                </button>
                            </div>

                            <div className="d-flex flex-wrap gap-2">
                                {Object.entries(filters).map(([key, values]) => {
                                    if (Array.isArray(values)) {
                                        return values.map(value => (
                                            <div key={`${key}-${value}`}>
                                                <button
                                                    className="btn btn-light rounded-1 d-flex align-items-center gap-2"
                                                    type="button"
                                                    onClick={() => onUpdate(key, _.without(values, value))}
                                                >
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
                    )}

                    <div className="filter-section">
                        <h6 className="fw-semibold mb-4 small">
                            SORT BY PRICE
                        </h6>

                        <div className="d-flex flex-column gap-3">
                            <label className="small">
                                <input
                                    type="radio"
                                    name="sort"
                                    value="desc"
                                    checked={sort === "desc"}
                                    className="me-2"
                                    onChange={(e) => onUpdate('sort', e.target.value)}
                                />
                                high to low
                            </label>

                            <label className="small">
                                <input
                                    type="radio"
                                    name="sort"
                                    value="asc"
                                    checked={sort === "asc"}
                                    className="me-2"
                                    onChange={(e) => onUpdate('sort', e.target.value)}
                                />
                                low to high
                            </label>
                        </div>
                    </div>


                    <div className="filter-section pt-4">
                        <div className="fw-semibold mb-4 small">
                            PRICE
                        </div>

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
                            <div className="slider__range"
                                 style={{
                                    left: `${((price.min - options.minPrice) /
                                        (options.maxPrice - options.minPrice)) * 100}%`,
                                    right: `${100 -
                                    ((price.max - options.minPrice) /
                                        (options.maxPrice - options.minPrice)) * 100}%`
                                }}
                            />

                            <input
                                type="range"
                                className="thumb thumb--zindex-3"
                                min={options.minPrice}
                                max={options.maxPrice}
                                value={price.min}
                                onChange={e => {
                                    const value = _.toInteger(e.target.value);
                                    if(value < price.max) {
                                        setPrice({
                                            ...price,
                                            min: value
                                        });
                                    }
                                }}
                            />

                            <input
                                type="range"
                                className="thumb thumb--zindex-3"
                                min={options.minPrice}
                                max={options.maxPrice}
                                value={price.max}
                                onChange={e => {
                                    const value = _.toInteger(e.target.value);
                                    if(value > price.min) {
                                        setPrice({
                                            ...price,
                                            max: value
                                        });
                                    }
                                }}
                            />
                        </div>
                    </div>

                    <CollapsibleFilter title="COLOR">
                        <div className="filter-section mt-4">

                            <div className="d-flex flex-column gap-3">
                                {options.colors.map(color => (
                                    <label
                                        key={color}
                                        className="d-flex align-items-center gap-2 small"
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
                    </CollapsibleFilter>

                    <CollapsibleFilter title="SIZE">
                        <div className="filter-section mt-4">
                            <div className="d-flex flex-wrap gap-2">
                                {options.sizes.map(size => (
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
                                        <small>{_.toUpper(size)}</small>
                                    </button>
                                ))}
                            </div>

                        </div>
                    </CollapsibleFilter>

                    <CollapsibleFilter title="MATERIAL">
                        <div className="filter-section pt-4">
                            <div className="d-flex flex-column gap-3">
                                {options.materials.map(material => (
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
                                        <small>{material}</small>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </CollapsibleFilter>

                    <CollapsibleFilter title="ORIGIN">
                        <div className="filter-section pt-4">
                            <div className="d-flex flex-column gap-3">
                                {options.origins.map(origin => (
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
                                        <small>{origin}</small>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </CollapsibleFilter>

                        {/* DISCOUNTS */}
                        <div className="pt-4">
                            <label className="d-flex align-items-center gap-2 fw-semibold small">
                                <input
                                    type="checkbox"
                                    checked={filters.discount?.includes("true") ?? false}
                                    onChange={e => onUpdate("discount", e.target.checked ? ["true"] : [])}
                                />
                                WITH DISCOUNTS
                            </label>
                        </div>
                </div>
            </>
        );
    }

export const FiltersComponent = connect(mapStateToProps, mapDispatchToProps)(Filters)