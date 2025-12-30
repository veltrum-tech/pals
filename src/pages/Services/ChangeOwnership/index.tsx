import { Outlet, useLocation } from "react-router-dom"
import Stepper from "@/components/ui/stepper"

const steps = [
    { number: 1, title: "Certificate No", path: "enter-cert-no" },
    { number: 2, title: "Vehicle Info", path: "vehicle-information" },
    { number: 3, title: "Verify OTP", path: "verify-otp" },
    { number: 4, title: "New Owner", path: "next-owner-info" },
    { number: 5, title: "Review", path: "review-information" },
]

export default function ChangeOwnership() {
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