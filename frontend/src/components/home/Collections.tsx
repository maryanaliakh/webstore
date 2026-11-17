
import { RootState } from "../../store";
import { connect } from "react-redux";
import type { Action, ThunkDispatch } from "@reduxjs/toolkit";
import { fetchLatestCollectionThunk } from "../../thunks/collection.ts";
import { useEffect } from "react";
import * as commonThunk from "../../thunks/common.ts";
import { useNavigate } from "react-router-dom";

const mapStateToProps = (state: RootState) => ({
    latestCollection: state.latestCollection,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, void, Action>) => ({
    onFetchLatestCollection: () => dispatch(fetchLatestCollectionThunk()),
    onUpdate: (key: string, value: string) => dispatch(commonThunk.modifyUrlThunk(key, value)),
});

type CollectionProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

function Collections({ latestCollection, onUpdate, onFetchLatestCollection }: CollectionProps) {
    const navigate = useNavigate();

    useEffect(() => {
        onFetchLatestCollection();
    }, []);

    if (!latestCollection || !latestCollection.name) {
        return null;
    }

    return (
        <section
            className="position-sticky overflow-hidden bg-white text-dark"
            style={{
                top: "53px",
                height: "calc(100vh - 180px)",
                minHeight: "400px",
                zIndex: 0,
                cursor: "pointer"
            }}
            onClick={() => {
                onUpdate("collection", latestCollection.name.toLowerCase());
                navigate(`/products?collection=${encodeURIComponent(latestCollection.name)}`)
            }}
        >
            <div className="position-absolute top-0 start-0 w-100 h-100 d-flex">
                {latestCollection.image_1 ?
                    <img
                    src={latestCollection.image_1}
                    alt="New pants collection"
                    style={{ flex: 1, minWidth: 0, height: "100%", objectFit: "cover", objectPosition: "center 25%" }}
                    />
                : ""}

                {latestCollection.image_2 ?
                    <img
                    src={latestCollection.image_2}
                    alt="New dress collection"
                    style={{ flex: 1, minWidth: 0, height: "100%", objectFit: "cover", objectPosition: "73% center" }}
                    />
                : ""}

                {latestCollection.image_3 ?
                    <div style={{ flex: 1, minWidth: 0, height: "100%", overflow: "hidden" }}>
                        <img
                            src={latestCollection.image_3}
                            alt="Shoes collection"
                            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", transform: "scale(1.2)" }}
                        />
                    </div>
                : ""}

            </div>

            <div
                className="position-absolute top-0 start-0 w-100 h-100"
                style={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}
            />

            <div className="position-relative w-100 h-100 d-flex flex-column align-items-center justify-content-end px-3 py-3 gap-3">
                <span style={{ backgroundColor: "rgba(250, 247, 240, 0.85)" }}>
                    <small className="d-block fw-bold mb-0 text-dark text-center px-1 py-1 fs-3 display-3">
                        {latestCollection.name.toUpperCase()}
                    </small>
                </span>
            </div>
        </section>
    );
}

export const CollectionComponent = connect(mapStateToProps, mapDispatchToProps)(Collections);
