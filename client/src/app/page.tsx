"use client";
import { useEffect } from "react";

export default function Root() {
    useEffect(() => {
        try {
            const user = JSON.parse(localStorage.getItem("user") || "null");
            if (user?.id) {
                window.location.replace("/protected");
            } else {
                window.location.replace("/login");
            }
        } catch {
            window.location.replace("/login");
        }
    }, []);

    return null;
}
