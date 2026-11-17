import type { RootState } from "../../store";
import * as selector from "../../selectors/product.ts";
import { connect } from "react-redux";
import { modifyUrlThunk } from "../../thunks/common.ts";
import {Action, ThunkDispatch} from "@reduxjs/toolkit";
import {fetchProductFilterOptionsThunk} from "../../thunks/product.ts";
import {ProductFilters} from "../../store/product/types.ts";
import { useEffect, useState } from "react";

interface ProductsHeaderOwnProps {
    onToggleFilters: () => void;
}

const mapStateToProps = (state: RootState) => ({
    products: state.product.data,
    filters: selector.productFilterSelector(state),
    options: state.productFilterOptions.filtered
});

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, void, Action>) => ({
    onUpdate: (key: string, value: string | string[]) => dispatch(modifyUrlThunk(key, value)),
    onFetchProductFilterOptions: (filters: ProductFilters) => dispatch(fetchProductFilterOptionsThunk(filters)),
});

type ProductsHeaderProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & ProductsHeaderOwnProps;

function ProductsHeader({ filters, options, products, onUpdate, onFetchProductFilterOptions, onToggleFilters }: ProductsHeaderProps) {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 150);

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        onFetchProductFilterOptions({
            category: filters.category,
            collection: filters.collection,
            gender: filters.gender,
            discount: filters.discount
        });
    }, [filters.category, filters.collection, filters.gender, filters.discount, onFetchProductFilterOptions]);

    return (
        <>
            {(filters.q || filters.discount?.length > 0 || filters.collection?.length > 0 || filters.category?.length > 0 || filters.gender) && (
                <div className={`products-title px-4 py-4 overflow-hidden ${isScrolled ? "products-title-hidden py-0" : ""}`}>
                    {filters.discount?.length > 0 ? (
                        <h3 className="display-4 fw-semibold text-danger mb-4">
                            {filters.discount.join(", ").toUpperCase()}
                        </h3>
                    ) : (
                        <>
                            {filters.gender && !filters.q && !filters.collection?.length && !filters.category?.length && (
                                <h3 className="display-4 fw-semibold mb-4">SEE ALL</h3>
                            )}

                            {filters.q && (
                                <>
                                    <small className="text-uppercase">SEARCH RESULTS</small>
                                    <h3 className="display-4 fw-semibold mb-4">{filters.q.toUpperCase()}</h3>
                                </>
                            )}

                            {filters.category?.length > 0 && (
                                <h3 className="display-4 fw-semibold mb-4">
                                    {filters.category.map(item => item.toUpperCase()).join(", ")}
                                </h3>
                            )}

                            {filters.collection?.length > 0 && (
                                <h3 className="display-4 fw-semibold mb-4">
                                    {filters.collection.map(item => item.toUpperCase()).join(", ")}
                                </h3>
                            )}
                        </>
                    )}
                </div>
            )}

            <div className="products-category-nav bg-white bg-opacity-75 px-4 py-3">
                <div className="d-flex justify-content-between align-items-center gap-4 flex-wrap">
                    <div className="d-flex align-items-center gap-4 flex-wrap">
                        {(filters.discount?.length > 0 || (filters.gender && !filters.category?.length && !filters.collection?.length)) && options.categories?.length > 0 && (
                            <>
                                <button type="button"
                                        onClick={() => onUpdate("category", [])}
                                        className={`btn p-0 text-uppercase`}>
                                    <small className={!filters.category?.length ? "text-dark fw-semibold" : ""}>ALL</small>
                                </button>
                                {options.categories.map(category => (
                                    <button
                                        key={category}
                                        type="button"
                                        onClick={() => onUpdate("category", category)}
                                        className={`btn p-0 text-uppercase`}
                                    >
                                        <small className={filters.category?.includes(category) ? "text-dark fw-semibold" : ""}>
                                            {category}
                                        </small>
                                    </button>
                                ))}
                            </>
                        )}

                        {!filters.discount?.length && (filters.collection?.length > 0 || filters.category?.length > 0) &&
                            options.subcategories?.length > 0 && (
                            <>
                                <button type="button"
                                        onClick={() => onUpdate("subcategory", [])}
                                        className={`btn p-0 text-uppercase `}>
                                    <small className={!filters.subcategory?.length ? "text-dark fw-semibold" : ""}>ALL</small>
                                </button>
                                {options.subcategories.map(subcategory => (
                                    <button key={subcategory}
                                            type="button"
                                            onClick={() => onUpdate("subcategory", subcategory)}
                                            className={`btn p-0 text-uppercase `}>
                                        <small className={filters.subcategory?.includes(subcategory) ? "text-dark fw-semibold" : ""}>
                                            {subcategory}
                                        </small>
                                    </button>
                                ))}
                            </>
                        )}
                    </div>

                    <div className="d-flex justify-content-end align-items-center gap-4 flex-shrink-0 ms-auto">
                        <small className="text-nowrap">{products.length} RESULTS</small>
                        <button type="button"
                                className="btn p-0 border-0 d-flex align-items-center gap-2 fw-semibold text-nowrap"
                                onClick={onToggleFilters}>
                           <div className="small"> FILTERS </div>
                            <i className="bi bi-sliders"></i>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export const ProductsHeaderComponent = connect(mapStateToProps, mapDispatchToProps)(ProductsHeader);