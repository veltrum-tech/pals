import { useEffect } from "react";
import { useParams, useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";

/**
 * This component handles payment callback redirects from the backend.
 * The backend redirects to URLs like:
 * - /registrations/:requestId/verify?reference=...
 * - /transfers/:requestId/verify-payment?reference=...
 * - /renewals/:requestId/verify-payment?reference=...
 * - /migrations/:requestId/verify-payment?reference=...
 * 
 * We capture these and redirect to our unified PaymentCallback page.
 */
export default function PaymentRedirect() {
    const navigate = useNavigate();
    const location = useLocation();
    const { requestId } = useParams<{ requestId: string }>();
    const [searchParams] = useSearchParams();
    
    const reference = searchParams.get("reference") || searchParams.get("trxref");

    useEffect(() => {
        // Determine service type from the URL path
        const path = location.pathname;
        let serviceType = "registration";
        
        if (path.includes("/registrations/")) {
            serviceType = "registration";
        } else if (path.includes("/transfers/")) {
            serviceType = "transfer";
        } else if (path.includes("/renewals/")) {
            serviceType = "renewal";
        } else if (path.includes("/migrations/")) {
            serviceType = "migration";
        }

        // Store the info in sessionStorage if not already there
        if (requestId && !sessionStorage.getItem("paymentRequestId")) {
            sessionStorage.setItem("paymentRequestId", requestId);
        }
        if (!sessionStorage.getItem("paymentServiceType")) {
            sessionStorage.setItem("paymentServiceType", serviceType);
        }

        // Redirect to the unified payment callback page with the reference
        const callbackUrl = `/payment/callback${reference ? `?reference=${reference}` : ""}`;
        navigate(callbackUrl, { replace: true });
    }, [requestId, reference, location.pathname, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Redirecting to payment verification...</p>
            </div>
        </div>
    );
}
