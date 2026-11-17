import {useEffect} from "react";
import type {Action} from "redux";
import type {ThunkDispatch} from "@reduxjs/toolkit";
import {connect} from "react-redux";
import type {RootState} from "../../store";
import {fetchCategoriesThunk} from "../../thunks/category.ts";
import {fetchCollectionsThunk} from "../../thunks/collection.ts";
import {fetchDiscountsThunk} from "../../thunks/discount.ts";
import {productFilterSelector} from "../../selectors/product.ts";
import {modifyUrlThunk, selectPanelFiltersThunk} from "../../thunks/common.ts";

type Gender = "men" | "women";

interface MenuPanelOwnProps {
    gender: Gender;
    open: boolean;
    onClose: () => void;
    onOpenSearch: () => void;
}

const mapStateToProps = (state: RootState) => ({
    collections: state.collection.data,
    categories: state.category.data,
    discounts: state.discount.data,
    filters: productFilterSelector(state)
});

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, void, Action>) => ({
    onFetchCategories: (gender: Gender) => dispatch(fetchCategoriesThunk(gender)),
    onFetchCollections: (gender: Gender) => dispatch(fetchCollectionsThunk(gender)),
    onFetchDiscounts: (gender: Gender) => dispatch(fetchDiscountsThunk(gender)),
    onSelectFilter: (gender: Gender, key?: string, value?: string) => dispatch(selectPanelFiltersThunk(gender, key, value)),
    onUpdate: (key: string, value: string | string[]) => dispatch(modifyUrlThunk(key, value))
});

type MenuPanelProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & MenuPanelOwnProps;

function MenuPanel({ gender, open, onClose, onOpenSearch, collections, categories, discounts, filters, onFetchCategories, onFetchCollections, onFetchDiscounts, onSelectFilter }: MenuPanelProps) {

    useEffect(() => {
        if (!open) return;
        onFetchCategories(gender);
    }, [open, gender, onFetchCategories]);

    useEffect(() => {
        if (!open) return;
        onFetchCollections(gender);
    }, [open, gender, onFetchCollections]);

    useEffect(() => {
        if (!open) return;
        onFetchDiscounts(gender);
    }, [open, gender, onFetchDiscounts]);

    if (!open) return null;

    return (
        <>
            <div
                className="categories-overlay open"
                onClick={onClose}
            />

            <div
                className="categories-panel bg-white p-4 open"
                role="dialog"
                aria-modal="true"
                aria-label="Categories"
            >
                <div
                    className="d-flex gap-3 pb-3 border-bottom"
                    style={{ cursor: "pointer" }}
                    onClick={onOpenSearch}
                >
                    <i className="bi bi-search small"></i>
                    <small className="flex-grow-1">SEARCH HERE</small>
                </div>

                <div>
                    <div className="col-md-6 mb-4 pt-4">
                        {collections?.map(collection => (
                            <h5
                                key={collection.id}
                                className="mb-2 py-1 text-nowrap fw-semibold"
                                onClick={() => {
                                    onClose();
                                    onSelectFilter(gender, "collection", collection.name);
                                }}
                                style={{ cursor: "pointer" }}
                            >
                                {collection.name.toUpperCase()}
                            </h5>
                        ))}
                    </div>
                </div>

                <div className="border-top">
                    <div className="col-md-6 my-4">
                        <div
                            className="small py-2 text-nowrap"
                            onClick={() => {
                                onClose();
                                onSelectFilter(gender);
                            }}
                            style={{ cursor: "pointer" }}
                        >
                            SEE ALL
                        </div>

                        {categories?.map(category => (
                            <div
                                key={category.id}
                                className={`mb-1 small py-1 text-nowrap ${
                                    filters.gender === gender &&
                                    filters.category?.includes(category.name)
                                        ? "fw-semibold"
                                        : ""
                                }`}
                                onClick={() => {
                                    onClose();
                                    onSelectFilter(gender, "category", category.name);
                                }}
                                style={{ cursor: "pointer" }}
                            >
                                {category.name.toUpperCase()}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="border-top">
                    <div className="col-md-6 mt-4">
                        {discounts?.map(discount => (
                            <div
                                key={discount.id}
                                className={`text-danger text-nowrap small py-1 ${
                                    filters.gender === gender &&
                                    filters.discount?.includes(discount.name)
                                        ? "fw-semibold"
                                        : "" }`}
                                onClick={() => {
                                    onClose();
                                    onSelectFilter(gender, "discount", discount.name);
                                }}
                                style={{ cursor: "pointer" }}
                            >
                                {discount.name.toUpperCase()}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuPanel);