
function Newsletter() {
    return (
        <section className="container-fluid px-0 bg-white text-black">

                <div className="d-flex align-items-center justify-content-center text-center py-5">
                    <div className="">

                        <span className="display-1 fs-1 fw-bold">SUBSCRIBE TO OUR NEWSLETTER</span>

                        <p className="text-secondary lh-lg mb-4 ">
                            <small>BE THE FIRST TO RECEIVE THE LATEST NEWS ABOUT TRENDS, PROMOTIONS AND MORE!</small>
                        </p>

                        <button type="button" className="btn btn-dark rounded-0 py-3 px-4">
                             <span>SUBSCRIBE</span>
                        </button>
                    </div>
                </div>
        </section>
    )
}

export const NewsletterComponent = Newsletter;