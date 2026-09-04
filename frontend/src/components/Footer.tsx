export default function Footer() {
    return (
        <footer className="mt-5 pt-5">
            <div className="container-fluid px-5 pb-4">

                <div className="row">

                    {/* Brand */}
                    <div className="col-lg-4 mb-4">
                        <h4 className="fw-bold mb-3">
                            BUBBLE
                        </h4>

                        <p className="text-muted small mb-0">
                            Simple. Modern. You.
                        </p>
                    </div>

                    {/* Shop */}
                    <div className="col-lg-3 col-md-4 mb-4">
                        <h6 className="fw-semibold mb-3">
                        <small>
                            SHOP
                        </small>

                        </h6>

                        <div className="d-flex flex-column gap-2">
                            <a href="#" className="text-dark text-decoration-none small">
                                Women
                            </a>

                            <a href="#" className="text-dark text-decoration-none small">
                                Men
                            </a>

                            <a href="#" className="text-dark text-decoration-none small">
                                New arrivals
                            </a>

                            <a href="#" className="text-dark text-decoration-none small">
                                Sale
                            </a>
                        </div>
                    </div>

                    {/* Help */}
                    <div className="col-lg-3 col-md-5 mb-4">
                        <h6 className="fw-semibold mb-3">
                            <small>
                            HELP
                            </small>
                        </h6>

                        <div className="d-flex flex-column gap-2">
                            <a href="#" className="text-dark text-decoration-none small">
                                Contact
                            </a>

                            <a href="#" className="text-dark text-decoration-none small">
                                Delivery
                            </a>

                            <a href="#" className="text-dark text-decoration-none small">
                                Returns
                            </a>

                            <a href="#" className="text-dark text-decoration-none small">
                                FAQ
                            </a>
                        </div>
                    </div>

                    {/* Follow */}
                    <div className="col-lg-2 col-md-4 mb-4">
                        <h6 className="fw-semibold mb-3">
                            <small>
                            FOLLOW US
                            </small>
                        </h6>

                        <div className="d-flex gap-3">
                            <a href="#" className="text-dark fs-5">
                                <i className="bi bi-instagram"></i>
                            </a>

                            <a href="#" className="text-dark fs-5">
                                <i className="bi bi-facebook"></i>
                            </a>

                            <a href="#" className="text-dark fs-5">
                                <i className="bi bi-tiktok"></i>
                            </a>
                        </div>
                    </div>

                </div>

                {/* Bottom */}
                <div>
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex gap-4">
                            <a
                                href="#"
                                className="text-muted text-decoration-none small"
                            ><small>
                                Privacy Policy
                            </small>
                            </a>

                            <a
                                href="#"
                                className="text-muted text-decoration-none small"
                            ><small>
                                Terms & Conditions
                            </small>
                            </a>
                        </div>
                    </div>
                </div>

            </div>
        </footer>
    );
}
