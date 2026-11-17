import {useState} from "react";

interface CollapsibleFilterProps {
    title: string;
    children: React.ReactNode;
}

export default function CollapsibleFilter({title, children}: CollapsibleFilterProps) {
    const [open, setOpen] = useState(false);

    return (
        <div className="pt-4">
            <div
                className="d-flex justify-content-between align-items-center"
                style={{cursor: "pointer"}}
                onClick={() => setOpen(!open)}
            >
                <span className="small fw-semibold">{title}</span>
                <i className={`bi ${open ? "bi-chevron-up" : "bi-chevron-down"}`}></i>
            </div>

            {open && (
                <span className="pt-0">
                    {children}
                </span>
            )}
        </div>
    );
}