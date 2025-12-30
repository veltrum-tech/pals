

export default function Footer() {
    return (
        <footer className="bg-gradient-to-b from-primary/5 to-background border-t border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* About */}
                    <div>
                        <h3 className="font-bold text-foreground mb-4 text-lg">About PALS</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Jigawa State Public Access to Land Services provides efficient government services to all citizens.
                        </p>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="font-bold text-foreground mb-4 text-lg">Services</h3>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li>
                                <a href="#" className="hover:text-primary font-medium transition">
                                    Motor Vehicles
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-primary font-medium transition">
                                    Business
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-primary font-medium transition">
                                    Health & Education
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-primary font-medium transition">
                                    Vital Records
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="font-bold text-foreground mb-4 text-lg">Legal</h3>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li>
                                <a href="#" className="hover:text-primary font-medium transition">
                                    Privacy Policy
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-primary font-medium transition">
                                    Terms of Service
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-primary font-medium transition">
                                    Contact Us
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-primary font-medium transition">
                                    FAQs
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-bold text-foreground mb-4 text-lg">Contact</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                            <strong className="text-foreground">Email:</strong> support@jigawa-pals.gov.ng
                        </p>
                        <p className="text-sm text-muted-foreground mb-2">
                            <strong className="text-foreground">Phone:</strong> +234 XXX XXX XXXX
                        </p>
                        <p className="text-sm text-muted-foreground">
                            <strong className="text-foreground">Address:</strong> Jigawa State, Nigeria
                        </p>
                    </div>
                </div>

                <div className="border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted-foreground">&copy; 2025 Jigawa State Government. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="text-muted-foreground hover:text-primary font-medium transition">
                            Twitter
                        </a>
                        <a href="#" className="text-muted-foreground hover:text-primary font-medium transition">
                            Facebook
                        </a>
                        <a href="#" className="text-muted-foreground hover:text-primary font-medium transition">
                            LinkedIn
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
