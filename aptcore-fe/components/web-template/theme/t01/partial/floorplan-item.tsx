"use client"

import Image from "next/image"
import { useState } from "react"
import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface FloorplanItemProps {
    image: string
    title: string
    // link: string
    // bedroomCount?: string
}

export default function FloorplanItem({ image, title }: FloorplanItemProps) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    
    // Extract bedroom number from title for display
    // const extractBedroomNumber = (title: string) => {
    //     const match = title.match(/(\d+)\s*BEDROOM/i)
    //     return match ? match[1] : bedroomCount || "1"
    // }

    // const bedroomNumber = extractBedroomNumber(title)

    return (
        <>
            <div className="transition-shadow duration-300">
                <div className="aspect-[2/1.2] relative overflow-hidden">
                    <div className="flex h-full">
                        <div className="w-full h-auto">
                            <Image
                                src={image}
                                alt="Tampines St 94 GLS Building"
                                fill
                                className="object-cover w-full h-auto"
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-4">
                    <h3 className="text-[20px] font-bold text-[#39362C] mb-2 uppercase leading-[1.2] font-roboto">
                        {title}
                    </h3>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="bg-[transparent] border border-white shadow-[0px_0px_10px_0px_rgba(255,249,241,0.48)] text-black w-fit px-4 md:px-5 lg:px-[20px] py-2 md:py-3 lg:py-[10px] text-sm md:text-base rounded-full mt-4 md:mt-[20px] flex items-center justify-center hover:scale-110 transition-transform duration-300 ease-in-out tracking-normal"
                    >
                        VIEW FLOOR PLAN
                    </button>
                </div>
            </div>

            {/* Modal with Framer Motion */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div 
                        className="fixed inset-0 z-[99] flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        {/* Backdrop */}
                        <motion.div 
                            className="absolute inset-0 bg-black/40"
                            onClick={() => setIsModalOpen(false)}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        />
                        
                        {/* Modal Content */}
                        <motion.div 
                            className="relative bg-white shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden"
                            initial={{ scale: 0.8, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0, y: 20 }}
                            transition={{ 
                                duration: 0.4,
                                ease: [0.4, 0, 0.2, 1]
                            }}
                        >
                            {/* Header */}
                            <motion.div 
                                className="flex items-center justify-between p-3"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1, duration: 0.3 }}
                            >
                                <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                                    {title}
                                </h2>
                                <motion.button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <X className="w-5 h-5 text-gray-600" />
                                </motion.button>
                            </motion.div>

                            {/* Modal Body */}
                            <motion.div 
                                className="p-4 md:p-6"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.3 }}
                            >
                                <div className="w-ful gap-6">
                                    {/* Left Side - Building Image */}
                                    <motion.div 
                                        className="relative aspect-[2/1.2]"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3, duration: 0.4 }}
                                    >
                                        <Image
                                            src={image}
                                            alt={`${title} - Floorplan Layout`}
                                            fill
                                            className="object-cover"
                                        />
                                    </motion.div>
                                </div>

                                {/* Disclaimer */}
                                <motion.div 
                                    className="mt-6 border-t border-gray-200"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5, duration: 0.4 }}
                                >
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 bg-[#f8f9fa] p-4 pt-3">
                                        <div className="text-xs text-gray-500 leading-relaxed">
                                            <strong>Disclaimer:</strong> The floor plans, images, and other visuals are not to scale and are for illustration only. They are intended to provide a general idea of the layout and may not reflect actual dimensions or features. All information is subject to change. Accuracy of specifications or dimensions is not guaranteed. These materials are for seeking indications of interest and do not form part of any contract.
                                        </div>
                                        
                                        {/* Huttons Logo Placeholder */}
                                        {/* <motion.div 
                                            className="flex-shrink-0"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.6, duration: 0.3 }}
                                        >
                                            <Image src="/assets/theme/t01/huttons-logo.png" alt="Huttons" width={210} height={100} />
                                        </motion.div> */}
                                    </div>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}