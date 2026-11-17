import {useEffect, useMemo, useState} from "react";
import {useNavigate} from "react-router-dom";
import {connect} from "react-redux";
import type {RootState} from "../../store";
import {SearchInputComponent} from "./SearchInput.tsx";
import type {Action, ThunkDispatch} from "@reduxjs/toolkit";
import {fetchProductFilterOptionsThunk, fetchProductsThunk} from "../../thunks/product.ts";
import {modifyUrlThunk} from "../../thunks/common.ts";

interface SearchOwnProps {
    open: boolean;
    onClose: () => void;
}

const mapStateToProps = (state: RootState) => ({
    products: state.product.data,
    filterOptions: state.productFilterOptions.all
});

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, void, Action>) => ({ //action creator bindings
    onFetchProducts: () => dispatch(fetchProductsThunk()),
    onFetchFilterOptions: () => dispatch(fetchProductFilterOptionsThunk()),
    onUpdate: (key: string, value: string | string[]) => dispatch(modifyUrlThunk(key, value)),
})


type SearchProps = SearchOwnProps & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

function Search({open, onClose, products, filterOptions, onFetchProducts, onFetchFilterOptions}: SearchProps) {

    const [searchText, setSearchText] = useState("");
    const [searchHistory, setSearchHistory] = useState<string[]>(() => {
        try {
            const saved = JSON.parse(localStorage.getItem("bubbleSearchHistory") || "[]");
            return Array.isArray(saved) ? saved.filter((item): item is string => typeof item === "string") : [];
        } catch {
            return [];
        }
    });

    const navigate = useNavigate();

    useEffect(() => {
        if (!open) return;
        onFetchProducts();
        onFetchFilterOptions();
    }, [open, onFetchProducts, onFetchFilterOptions]);


    const suggestions = useMemo(() => {
        const query = searchText.trim().toLowerCase();
        if (!query) return [];

        return [
            ...products.map(item => item.name),
            ...filterOptions.discounts,
            ...filterOptions.categories,
            ...filterOptions.subcategories,
            ...filterOptions.collections,
            ...filterOptions.colors,
            ...filterOptions.sizes,
            ...filterOptions.materials,
            ...filterOptions.origins
        ]
            .filter(item => item.toLowerCase().includes(query))
            .filter((item, index, arr) => arr.indexOf(item) === index)
            .slice(0, 7);
    }, [products, filterOptions, searchText]);

    const closeSearch = () => {
        onClose();
    };

    const saveSearch = (query: string) => {
        setSearchHistory(prev => {
            const updated = [query, ...prev.filter(item => item.toLowerCase() !== query.toLowerCase())].slice(0, 5);
            localStorage.setItem("bubbleSearchHistory", JSON.stringify(updated));
            return updated;
        });
    };

    const handleSearch = (query: string) => {
        const value = query.trim();
        if (!value) return;

        saveSearch(value);
        navigate(`/products?q=${encodeURIComponent(value)}`);
        closeSearch();
    };

    const removeSearch = (query: string) => {
        setSearchHistory(prev => {
            const updated = prev.filter(item => item !== query);
            localStorage.setItem("bubbleSearchHistory", JSON.stringify(updated));
            return updated;
        });
    };

    if (!open) return null;
    console.log(filterOptions)

    return (
        <>
            <div className="search-overlay open" onClick={closeSearch} />

            <div className="search-panel p-4 open" role="dialog" aria-modal="true" aria-label="Search products">
                <div className="search-header d-flex align-items-start gap-3">
                    <div className="flex-grow-1">
                        <SearchInputComponent
                            open={open}
                            searchText={searchText}
                            onSearchTextChange={setSearchText}
                            onSubmit={handleSearch}
                        />
                    </div>

                    <button
                        type="button"
                        className="search-close"
                        onClick={closeSearch}
                        aria-label="Close search"
                    >
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>

                <div className="py-3">
                    {!searchText.trim() && searchHistory.map(query => (
                        <div key={query} className="d-flex align-items-center py-3">
                            <button
                                type="button"
                                className="d-flex gap-3 flex-grow-1 border-0 bg-transparent p-0 small text-start"
                                onClick={() => handleSearch(query)}
                            >
                                <span>{query.toUpperCase()}</span>
                            </button>

                            <button
                                type="button"
                                className="border-0 bg-transparent p-0"
                                onClick={() => removeSearch(query)}
                            >
                                <i className="bi bi-x"></i>
                            </button>
                        </div>
                    ))}

                    {searchText.trim() && (
                        suggestions.length > 0 ? (
                            suggestions.map(suggestion => (
                                    <button key={suggestion} type="button" className="px-0 d-flex w-100 py-3 border-0 bg-transparent text-start"
                                            onClick={() => handleSearch(suggestion)}>
                                        <small>{suggestion.toUpperCase()}</small>
                                    </button>
                                ))
                        ) : (
                            <p className="text-muted pt-5 text-center">
                                <small>No matching suggestions found</small>
                            </p>
                        )
                    )}
                </div>
            </div>
        </>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);