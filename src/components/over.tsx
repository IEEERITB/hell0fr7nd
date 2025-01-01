import Image from "next/image";

export function Over() {
    return (
        <div className="h-full flex items-center flex-col justify-center text-center">
            <Image src="/rb_7563.png" alt="Already submitted" width={300} height={300} className="w-3/4 md:w-1/3" />
            <h2 className="text-2xl font-bold">Cheer Up!</h2>
            <p className="text-lg">You've already submitted the responses!</p>
        </div>
    );
}