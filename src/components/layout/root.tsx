import { Outlet } from "react-router-dom";
import Footer from "./footer";
import Navbar from "./navbar";


export default function Root() {
    return (
        <main className="w-full">
            <Navbar />

            <section>
                <Outlet />
            </section>

            <Footer />
        </main>
    )
}
