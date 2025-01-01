import { Loader2Icon } from "lucide-react"

export function Loader() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 flex items-center justify-center">
            <Loader2Icon className="text-white h-16 w-16 animate-spin" />
        </div>
    )
};
