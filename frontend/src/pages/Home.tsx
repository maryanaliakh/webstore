import {useEffect} from "react";
import {connect} from "react-redux";
import type {Action, ThunkDispatch} from "@reduxjs/toolkit";
import type {RootState} from "../store";
import * as thunk from "../thunks/product.ts";
import {fetchProductFilterOptionsThunk} from "../thunks/product.ts";
import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";
import {ProductsCarouselComponent} from "../components/product/ProductsCarousel.tsx";
import {CollectionComponent} from "../components/home/Collections.tsx";
import {CategoriesComponent} from "../components/home/Categories.tsx";
import {NewsletterComponent} from "../components/Newsletter.tsx";

const mapStateToProps = (state: RootState) => ({
    products: state.product.data,
    options: state.productFilterOptions
});

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, void, Action>) => ({
    onFetch: () => dispatch(thunk.fetchProductsThunk()),
    onFetchFilterOptions: () => dispatch(fetchProductFilterOptionsThunk()),
});

type HomeProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

function Home({ onFetch, onFetchFilterOptions }: HomeProps) {

    useEffect(() => {
        document.title = "BUBBLE";
        onFetch();
    }, [onFetch]);

    useEffect(() => {
        onFetchFilterOptions();
    }, [onFetchFilterOptions]);


    return (
        <div className="d-flex flex-column min-vh-100 bg-white text-dark">
            <Header />

            <main>
                <CollectionComponent />
                <CategoriesComponent />
                <ProductsCarouselComponent page={"home"}/>
            </main>
            <NewsletterComponent/>

            <Footer />
        </div>
    );
}

export const HomeContainer = connect(mapStateToProps, mapDispatchToProps)(Home);
