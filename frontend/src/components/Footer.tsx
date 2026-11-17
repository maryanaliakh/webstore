import { useNavigate } from "react-router-dom";

export default function Footer() {
    const navigate = useNavigate();

    const linkClass = "text-dark text-decoration-none border-0 bg-transparent p-0 fw-semibold";

    return (
        <footer
            className="container-fluid border-top px-4 pt-4 pb-4"
            style={{ borderRadius: "0 0 24px 24px", background: "#fff" }}
        >
            <div className="d-flex justify-content-between align-items-start flex-wrap gap-4">

                {/* Links */}
                <div className="d-flex flex-column gap-3 small">
                    <div className="d-flex flex-wrap gap-3 small">
                        <button className={linkClass}  onClick={() => navigate("/products?gender=women")}>
                            WOMEN
                        </button>

                        <button className={linkClass}  onClick={() => navigate("/products?gender=men")}>
                            MEN
                        </button>

                        <button className={linkClass}  onClick={() => navigate("/products")}>
                            SHOP ALL
                        </button>

                        <button className={linkClass}  onClick={() => navigate("/favorites")}>
                            FAVORITES
                        </button>
                    </div>

                    <div className="d-flex flex-wrap gap-3 small">
                        <button className={linkClass}  onClick={() => navigate("/account")}>
                            MY ACCOUNT
                        </button>

                        <button className={linkClass} onClick={() => navigate("/cart")}>
                            SHOPPING BAG
                        </button>

                        <button className={linkClass} onClick={() => navigate("/")}>
                            HOME
                        </button>
                    </div>

                    <div className="d-flex flex-wrap gap-3 small">
                        <a href="#" className={linkClass} >INSTAGRAM</a>
                        <a href="#" className={linkClass} >FACEBOOK</a>
                        <a href="#" className={linkClass} >TIKTOK</a>
                    </div>
                </div>

                {/* Country */}
                <div className="d-flex flex-column align-items-end gap-2 small">
                    <div>
                        <i className="bi bi-globe fs-6 mx-2"></i>
                        <span className="fw-semibold small">
                            POLAND | EUROPE
                        </span>
                    </div>

                    <div className="fw-semibold small">
                        © 2026 BUBBLE. ALL RIGHTS RESERVED.
                    </div>
                </div>
            </div>
        </footer>
    );
}
