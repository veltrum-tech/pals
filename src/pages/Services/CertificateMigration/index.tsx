import { Outlet, useLocation } from "react-router-dom"
import Stepper from "@/components/ui/stepper"

const steps = [
    { number: 1, title: "Enter VIN", path: "enter-vin" },
    { number: 2, title: "Vehicle Info", path: "vin-information" },
    { number: 3, title: "Additional Info", path: "additional-information" },
    { number: 4, title: "Upload Document", path: "upload-document" },
    { number: 5, title: "Summary", path: "information-summary" },
]

export default function CertificateMigration() {
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