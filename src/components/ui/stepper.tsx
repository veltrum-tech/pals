import { Check } from "lucide-react"

interface Step {
    number: number
    title: string
    completed: boolean
    active: boolean
}

interface StepperProps {
    steps: Step[]
}

export default function Stepper({ steps }: StepperProps) {
    return (
        <div className="w-full py-8 px-4 bg-white border-b border-gray-200">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between">
                    {steps.map((step, index) => (
                        <div key={step.number} className="flex items-center flex-1">
                            {/* Step Circle */}
                            <div className="flex flex-col items-center shrink-0">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${step.completed
                                            ? "bg-secondary text-white"
                                            : step.active
                                                ? "bg-secondary text-white ring-4 ring-secondary/20"
                                                : "bg-gray-200 text-gray-500"
                                        }`}
                                >
                                    {step.completed ? (
                                        <Check className="w-5 h-5" strokeWidth={3} />
                                    ) : (
                                        step.number
                                    )}
                                </div>
                                <p
                                    className={`mt-2 text-xs font-medium text-center ${step.active ? "text-secondary" : "text-gray-500"
                                        }`}
                                >
                                    {step.title}
                                </p>
                            </div>

                            {/* Connector Line */}
                            {index < steps.length - 1 && (
                                <div className="flex-1 h-0.5 mx-2 md:mx-4">
                                    <div
                                        className={`h-full transition-all ${step.completed ? "bg-secondary" : "bg-gray-200"
                                            }`}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
