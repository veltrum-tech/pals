import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import Footer from "./footer";
import Navbar from "./navbar";


export default function Root() {
    return (
        <main className="w-full">
            <Toaster position="top-right" richColors />
            <Navbar />

            <section>
                <Outlet />
            </section>

            <Footer />
        </main>
    )
}
