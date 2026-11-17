import { useState } from "react";
import type { FormEvent } from "react";

interface SearchInputProps {
    open: boolean;
    searchText?: string;
    onSearchTextChange?: (value: string) => void;
    onSubmit: (query: string) => void;
    onFocus?: () => void;
}

function SearchInput({ open, searchText: externalSearchText, onSearchTextChange, onSubmit, onFocus }: SearchInputProps) {
    const [internalSearchText, setInternalSearchText] = useState("");

    const searchText = externalSearchText ?? internalSearchText;
    const handleSearchTextChange = onSearchTextChange ?? setInternalSearchText;

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const query = searchText.trim();
        if (!query) return;
        onSubmit(query);
    };

    return (
        <form className="d-flex gap-3" onSubmit={handleSubmit}>
            <i className="bi bi-search small" style={{marginTop: "2px"}}></i>
            <input
                type="search"
                placeholder="SEARCH HERE"
                value={searchText.toUpperCase()}
                onChange={event => handleSearchTextChange(event.target.value)}
                autoFocus={open}
                className="flex-grow-1 w-100 p-0 border-0 bg-transparent"
                onFocus={onFocus}
            />
        </form>
    );
}

export const SearchInputComponent = SearchInput;