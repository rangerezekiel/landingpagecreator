"use client"

import { useState } from "react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronRight, Plus, Minus } from "lucide-react"
import Animated from "@/components/animated"
import { motion, AnimatePresence } from "framer-motion"
import { UnitTypesAccordionContents } from "@/app/_types/section"

interface UnitTypesAccordionProps {
    unitTypes?: UnitTypesAccordionContents
}

export default function UnitTypesAccordion({ unitTypes }: UnitTypesAccordionProps) {
    const [openAccordion, setOpenAccordion] = useState<string>("")

    const iconVariants = {
        open: { 
            rotate: 0,
            scale: 1
        },
        closed: { 
            rotate: 0,
            scale: 1
        }
    }

    const chevronVariants = {
        open: { 
            rotate: 90
        },
        closed: { 
            rotate: 0
        }
    }

    const contentVariants = {
        open: {
            opacity: 1,
            height: "auto"
        },
        closed: {
            opacity: 0,
            height: 0
        }
    }

    // Check if unitTypes has the correct structure
    if (!unitTypes || !unitTypes.details || !unitTypes.details.LIST || !unitTypes.details.LIST.items) {
        return null
    }

    return (
        <Animated animation="fade-left" delay={0.6}>
            <motion.div 
                className="space-y-2"
                initial="closed"
                animate="open"
                variants={{
                    open: {
                        transition: { staggerChildren: 0.1 }
                    }
                }}
            >
                {unitTypes.details.LIST.items.map((unit, index: number) => {
                    const unitId = `unit-${index}`
                    const isOpen = openAccordion === unitId
                    const title = unit.contents?.TITLE?.value || `Unit Type ${index + 1}`
                    const content = unit.contents?.DESCRIPTION?.value || "No description available."
                    
                    return (
                        <motion.div
                            key={unitId}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ 
                                duration: 0.4,
                                delay: index * 0.1,
                                ease: "easeOut"
                            }}
                        >
                            <Collapsible
                                open={isOpen}
                                onOpenChange={() => setOpenAccordion(isOpen ? "" : unitId)}
                            >
                                <CollapsibleTrigger className="w-full group">
                                    <motion.div 
                                        className="flex items-center justify-between w-full p-4 md:p-6 bg-white/10 border-b border-white/20 transition-all duration-300 ease-out"
                                        whileHover={{ 
                                            backgroundColor: "rgba(255, 255, 255, 0.15)",
                                            scale: 1.01,
                                            transition: { duration: 0.2 }
                                        }}
                                        whileTap={{ 
                                            scale: 0.99,
                                            transition: { duration: 0.1 }
                                        }}
                                    >
                                        <div className="flex items-center gap-4">
                                            <motion.div
                                                variants={iconVariants}
                                                animate={isOpen ? "open" : "closed"}
                                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                                className="flex-shrink-0"
                                            >
                                                <AnimatePresence mode="wait">
                                                    {isOpen ? (
                                                        <motion.div
                                                            key="minus"
                                                            initial={{ opacity: 0, rotate: -90 }}
                                                            animate={{ opacity: 1, rotate: 0 }}
                                                            exit={{ opacity: 0, rotate: 90 }}
                                                            transition={{ duration: 0.3 }}
                                                        >
                                                            <Minus className="h-5 w-5 md:h-6 md:w-6 text-white" />
                                                        </motion.div>
                                                    ) : (
                                                        <motion.div
                                                            key="plus"
                                                            initial={{ opacity: 0, rotate: 90 }}
                                                            animate={{ opacity: 1, rotate: 0 }}
                                                            exit={{ opacity: 0, rotate: -90 }}
                                                            transition={{ duration: 0.3 }}
                                                        >
                                                            <Plus className="h-5 w-5 md:h-6 md:w-6 text-white" />
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </motion.div>
                                            <motion.span 
                                                className="text-left text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-white"
                                                animate={{
                                                    color: isOpen ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 0.9)"
                                                }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                {title}
                                            </motion.span>
                                        </div>
                                        <motion.div
                                            variants={chevronVariants}
                                            animate={isOpen ? "open" : "closed"}
                                            transition={{ duration: 0.4, ease: "easeInOut" }}
                                            className="flex-shrink-0"
                                        >
                                            <ChevronRight className="h-5 w-5 md:h-6 md:w-6 text-white" />
                                        </motion.div>
                                    </motion.div>
                                </CollapsibleTrigger>
                                <CollapsibleContent forceMount>
                                    <motion.div
                                        variants={contentVariants}
                                        animate={isOpen ? "open" : "closed"}
                                        transition={{ 
                                            duration: 0.4, 
                                            ease: "easeInOut",
                                            opacity: { delay: isOpen ? 0.1 : 0, duration: isOpen ? 0.3 : 0.2 }
                                        }}
                                        className="overflow-hidden"
                                    >
                                        <motion.div 
                                            className="p-4 md:p-6 bg-white/5 border-b border-white/10"
                                            initial={{ y: -10 }}
                                            animate={{ y: 0 }}
                                            transition={{ 
                                                duration: 0.3,
                                                delay: isOpen ? 0.2 : 0
                                            }}
                                        >
                                            <motion.div 
                                                className="text-sm md:text-base text-white/90 leading-relaxed"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: isOpen ? 1 : 0 }}
                                                transition={{ 
                                                    duration: 0.3,
                                                    delay: isOpen ? 0.25 : 0
                                                }}
                                                dangerouslySetInnerHTML={{ __html: content }}
                                            />
                                        </motion.div>
                                    </motion.div>
                                </CollapsibleContent>
                            </Collapsible>
                        </motion.div>
                    )
                })}
            </motion.div>
        </Animated>
    )
}