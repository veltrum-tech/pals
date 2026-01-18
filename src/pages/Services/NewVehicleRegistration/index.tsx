import { Outlet, useLocation } from "react-router-dom"
import Stepper from "@/components/ui/stepper"

const steps = [
    { number: 1, title: "Verify VIN", path: "verify-vin" },
    { number: 2, title: "Owner Info", path: "owner-information" },
    { number: 3, title: "Vehicle Details", path: "vehicle-details" },
    { number: 4, title: "Upload Docs", path: "upload-documents" },
    { number: 5, title: "Review & Pay", path: "review-payment" },
]

export default function NewVehicleRegistration() {
    const location = useLocation()

    const currentStepIndex = steps.findIndex(step =>
        location.pathname.includes(step.path)
    )

    const stepsWithStatus = steps.map((step, index) => ({
        ...step,
        completed: index < currentStepIndex,
        active: index === currentStepIndex,
    }))

    return (
        <div className="min-h-screen container mx-auto bg-background">
            <Stepper steps={stepsWithStatus} />
            <Outlet />
        </div>
    )
}
