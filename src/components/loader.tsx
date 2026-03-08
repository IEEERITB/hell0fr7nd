import { Loader2Icon } from "lucide-react"

export function Loader() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2Icon className="text-white h-16 w-16 animate-spin" />
        </div>
    )
};
