
import {useNavigate} from "react-router-dom";
import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";

function OrderSuccess() {
    const navigate = useNavigate();

    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />
            <main className="container flex-grow-1 d-flex justify-content-center align-items-center py-5">
                <div className="text-center" style={{maxWidth: "600px", width: "100%"}}>
                    <i className="bi bi-check-circle text-success" style={{fontSize: "60px"}}></i>
                    <div className="mt-2 display-1 fs-1 fw-bold">THANK YOU FOR YOUR ORDER!</div>
                    <p className="text-secondary lh-lg mb-4">
                        YOUR ORDER HAS BEEN SUCCESSFULLY PLACED.
                    </p>

                    <div>
                        <button className="btn btn-dark rounded-0 py-3 px-4"
                                onClick={() => navigate("/products")}>
                            <span className="small">CONTINUE SHOPPING</span>
                        </button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export const OrderSuccessContainer = OrderSuccess;
