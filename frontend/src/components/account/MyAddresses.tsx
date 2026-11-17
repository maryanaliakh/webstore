
import {useEffect} from "react";
import {connect} from "react-redux";
import type {Action} from "redux";
import type {ThunkDispatch} from "@reduxjs/toolkit";
import type {RootState} from "../../store";
import type {Address} from "../../store/address/types.ts";
import {fetchUserAddressesThunk} from "../../thunks/address.ts";

const mapStateToProps = (state: RootState) => ({
    addresses: state.address.data,
    loading: state.address.loading,
    error: state.address.error
});

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, void, Action>) => ({
    loadAddresses: () => dispatch(fetchUserAddressesThunk())
});

type MyAddressesProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

function MyAddresses({addresses, loading, error, loadAddresses}: MyAddressesProps) {
    useEffect(() => {
        loadAddresses();
    }, [loadAddresses]);

    if (loading) {
        return <div className="py-5 text-center small">LOADING ADDRESSES...</div>;
    }

    if (error) {
        return <div className="py-4 text-danger small">{error}</div>;
    }

    if (addresses.length === 0) {
        return (
            <div className="d-flex flex-column align-items-center justify-content-center text-center" style={{minHeight: "400px"}}>
                <p className="text-muted small">You haven't saved any addresses yet.</p>
            </div>
        );
    }

    return (
        <div className="w-100 text-dark pt-3">

            <div className="row g-3">
                {addresses.map((address: Address) => (
                    <div key={address.id}>
                        <div className="border p-4 h-100">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                                <div className="small fw-semibold text-uppercase mb-0">
                                    ADDRESS #{address.id}
                                </div>

                                {address.is_default && (
                                    <span className="small border border-dark px-2 py-1">
                                        DEFAULT
                                    </span>
                                )}
                            </div>

                            <div className="small text-muted lh-lg">
                                <div>
                                    {address.street}, {address.building}
                                    {address.apartment ? `/${address.apartment}` : ""},
                                    {address.postal_code} {address.city}, {address.country}
                                </div>
                                <div className="mt-2">{address.phone}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAddresses);
