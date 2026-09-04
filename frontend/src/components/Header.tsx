import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";

export default function Header() {
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchText, setSearchText] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        document.body.style.overflow = searchOpen ? "hidden" : "";

        return () => {
            document.body.style.overflow = "";
        };
    }, [searchOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (searchText.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchText.trim())}`);
            setSearchOpen(false);
        }
    }

    return (
        <header className="sticky-top bg-white pb-1 pt-1">
            <div className="container-fluid px-5 py-3">
                <div className="row align-items-center">

                    {/* Logo */}
                    <div className="col-auto me-5">
                        <h2 className="fw-bold mb-0" >BUBBLE</h2>
                    </div>

                    {/* Navigation */}
                    <div className="col-auto me-5">
                        <nav className="d-flex gap-5">
                            <a href="#" className="text-dark text-decoration-none">WOMEN</a>

                            <a href="#" className="text-dark text-decoration-none">MEN</a>
                        </nav>
                    </div>

                    {/* Icons */}
                    <div className="col-auto ms-auto">
                        <div className="d-flex align-items-center gap-4">

                            {/* Search */}
                            <button
                                type="button"
                                className="btn p-0 text-dark fs-5"
                                onClick={() => setSearchOpen(true)}
                            >
                                <i className="bi bi-search"></i>
                            </button>

                            {/* Profile */}
                            <button className="btn p-0 text-dark fs-5">
                                <i className="bi bi-person"></i>
                            </button>

                            {/* Wishlist */}
                            <button className="btn p-0 text-dark fs-5">
                                <i className="bi bi-heart"></i>
                            </button>

                            {/* Bag */}
                            <button className="btn p-0 text-dark fs-5">
                                <i className="bi bi-bag"></i>
                            </button>

                        </div>
                    </div>

                </div>
            </div>

            <div
                className={`search-overlay ${searchOpen ? "open" : ""}`}
                onClick={() => setSearchOpen(false)}
            />

            <div className={`search-panel ${searchOpen ? "open" : ""}`}>
                <form className="search-input" onSubmit={(e) => handleSubmit(e)}>
                    <i className="bi bi-search"></i>

                    <input
                        autoFocus={searchOpen}
                        type="search"
                        placeholder="Search products"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </form>
            </div>
        </header>
    );
}