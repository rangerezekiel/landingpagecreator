import Image from "next/image";

export default function EmptyData(){
    return (
        <>
            <div className="flex justify-center w-full items-center">
                <div>
                    <Image src={'/assets/img/icons/empty-data.svg'} className="" width={250} height={250} alt="Empty Data" />
                    <h1 className="text-2xl text-center font-bold mt-5">
                        Empty Data
                    </h1>
                </div>
            </div>
        </>
    )
}