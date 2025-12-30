import { Link } from "react-router-dom";
import back from "../../../assets/watermarked_preview.gif";

export default function Hero() {
    return (
        <main className="w-full overflow-x-hidden h-full">
            <section className="relative flex flex-col items-center justify-center h-screen px-3 lg:px-0 lg:h-[80vh] w-full bg-black/70 text-center overflow-hidden">
                {/* Background overlay */}
                <div className="absolute inset-0 -z-10">
                    <img
                        src={back}
                        alt="Skyscraper background"
                        loading="lazy"
                        className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                </div>
                {/* Welcome badge */}
                <span className="mb-6 mt-8 text-xs inline-block rounded-md text-accent px-6 py-2 md:text-sm font-semibold tracking-widest shadow uppercase">
                    WELCOME TO Public Access to Land Services (PALS) SYSTEM
                </span>
                {/* Main heading */}
                <h1 className="text-2xl md:text-6xl font-extrabold text-white mb-4 max-w-4xl leading-tight">
                    Access Land Services Easily
                </h1>
                {/* Subheading */}
                <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl">
                    A Citizen and Business portal for the digital application and processing of permits, licenses and sundry Government issued certificates.
                </p>
                {/* CTA Button */}
                <Link
                    to={"/what-we-do"}
                    className="bg-secondary hover:bg-secondary/90 text-white text-lg rounded-md shadow transition-colors p-3"
                >
                    Explore Services
                    <span className="ml-2">→</span>
                </Link>
            </section>
        </main>
    )
}
