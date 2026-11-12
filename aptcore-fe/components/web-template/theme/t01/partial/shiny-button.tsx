interface ShinyButtonProps {
  href?: string
  className?: string
  contentClassName?: string
  children?: React.ReactNode
}

export default function ShinyButton({ href = "#", className = "", contentClassName = "", children }: ShinyButtonProps) {
  return (
    <a 
      href={href} 
      className={`bg-[#ceb183] text-white w-fit px-[30px] py-[15px] text-[25px] font-bold h-[73.5px] rounded-[7px] mt-[40px] flex items-center justify-center hover:scale-110 transition-transform duration-300 ease-in-out font-roboto tracking-normal relative overflow-hidden group ${className}`}
    >
      {/* Shiny overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shine" />
      
      {/* Content */}
      <div className={`relative z-10 flex items-center ${contentClassName}`}>
        {children}
      </div>
    </a>
  )
} 