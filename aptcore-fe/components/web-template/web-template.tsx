import T01 from "./theme/t01/index"

export default async function WebTemplate({ theme }: { theme: string }){
    return (
       <>
        {theme === "T01" ? (
          <T01 />
        ) : (
          <T01 />
        )}
       </>
    )
}