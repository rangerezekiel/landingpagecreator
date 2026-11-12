'use client'

import { useDomain } from "@/app/_providers/DomainContext"
import CardSection from "@/components/element/card-section"
import { useEffect, useState } from "react"
import { listIndexData } from "@/app/_services/section"
import { FetchApiResponse } from "@/app/_types/fetch"
import LoadingContent from "@/components/element/loading-section"

type ListIndex = {
    "ABOUT": boolean | null
    "BANNER": boolean | null
    "DEVELOPED_BY": boolean | null
    "E_BROCURE": boolean | null
    "FAQ": boolean | null
    "FORM_SUBMISSION": boolean | null
    "HERO": boolean | null
    "LOCATION": boolean | null
    "NEXT_STEP": boolean | null
    "SHOWFLAT_VIEWING": boolean | null
    "UNIT_TYPES": boolean | null
    "UNIT_TYPES_ACCORDION": boolean | null
    "VIDEO": boolean | null
    "WHAT_IS_NEXT": boolean | null
    "SIMILLAR_PROJECT": boolean | null
}

export default function WebsiteConfigSections() {
  const { domain } = useDomain()
  const baseUrlPrefix = `/backside/website/${domain}/config`
  
  const [isLoading, setIsLoading] = useState(true)
  const [activeList, setActiveList] = useState<ListIndex | null>()

    useEffect(() => {
      setIsLoading(true)
      if(domain){
          const getData = async () => {
            try {
                const data = await listIndexData(domain) as unknown as FetchApiResponse<ListIndex>
                setActiveList(data.data)
              } catch (err) {
                  console.error("Error fetching user data:", err)
              } finally {
                  setIsLoading(false)
              }
          }
      
        getData()
        }
    }, [domain])


  return (
    <div>
      {isLoading ? <LoadingContent /> : (
        <>
          <div className="grid sm:grid-cols-3 grid-cols-1 gap-5">
            <CardSection domain={domain} section="WEB_SETING" withoutSwitch={true} link={`${baseUrlPrefix}/web-setting`} image="web_setting.svg" title="Web Setting" className="" width={200} height={200} />
            <CardSection domain={domain} section="BANNER" defaultActive={activeList?.BANNER ?? false} link={`${baseUrlPrefix}/banner`} image="banner.svg" title="Banner" width={180} height={180}/>
            <CardSection domain={domain} section="HERO" defaultActive={activeList?.HERO ?? false} link={`${baseUrlPrefix}/hero`} image="hero.svg" title="Hero" width={165} height={165}/>
            <CardSection domain={domain} section="ABOUT" defaultActive={activeList?.ABOUT ?? false} link={`${baseUrlPrefix}/about`} image="about.svg" title="About" width={165} height={165}/>
            <CardSection domain={domain} section="E_BROCURE" defaultActive={activeList?.E_BROCURE ?? false} link={`${baseUrlPrefix}/e-brocure`} image="e_brocure.svg" title="E-Brochure" width={185} height={185}/>
            <CardSection domain={domain} section="LOCATION" defaultActive={activeList?.LOCATION ?? false} link={`${baseUrlPrefix}/location`} image="location.svg" title="Location"  width={170} height={170}/>
            <CardSection domain={domain} section="UNIT_TYPES_ACCORDION" defaultActive={activeList?.UNIT_TYPES_ACCORDION ?? false} link={`${baseUrlPrefix}/unit-types-accordion`} image="unit_types_accordion.svg" title="Unit Types Accordion" width={180} height={180}/>
            <CardSection domain={domain} section="UNIT_TYPES" defaultActive={activeList?.UNIT_TYPES ?? false} link={`${baseUrlPrefix}/unit-types`} image="unit_types.svg" title="Unit Types" width={180} height={180} />
            <CardSection domain={domain} section="SHOWFLAT_VIEWING" defaultActive={activeList?.SHOWFLAT_VIEWING ?? false} link={`${baseUrlPrefix}/showflat-viewing`} image="showflat_viewing.svg" title="Showflat Viewing" width={170} height={170} />
            <CardSection domain={domain} section="FAQ" defaultActive={activeList?.FAQ ?? false} link={`${baseUrlPrefix}/faq`} image="faq.svg" title="FAQ" width={180} height={180}/>
            <CardSection domain={domain} section="NEXT_STEP" defaultActive={activeList?.NEXT_STEP ?? false} link={`${baseUrlPrefix}/next-step`} image="next_step.svg" title="Next Step"  width={235} height={235} />
            <CardSection domain={domain} section="WHAT_IS_NEXT" defaultActive={activeList?.WHAT_IS_NEXT ?? false} link={`${baseUrlPrefix}/what-is-next`} image="what_is_next.svg" title="What is Next"  width={180} height={180} />
            <CardSection domain={domain} section="SIMILLAR_PROJECT" defaultActive={activeList?.SIMILLAR_PROJECT ?? false} link={`${baseUrlPrefix}/simillar-project`} image="projects.svg" title="Simillar Project"  width={180} height={180} />
            <CardSection domain={domain} section="DEVELOPED_BY" defaultActive={activeList?.DEVELOPED_BY ?? false} link={`${baseUrlPrefix}/developed-by`} image="developed_by.svg" title="Developed by"  width={235} height={235} />
            <CardSection domain={domain} section="VIDEO" defaultActive={activeList?.VIDEO ?? false} link={`${baseUrlPrefix}/video`} image="video.svg" title="Video"/>
            <CardSection domain={domain} section="FORM_SUBMISSION" defaultActive={activeList?.FORM_SUBMISSION ?? false} link={`${baseUrlPrefix}/form-submission`} image="form_submission.svg" title="Form Submission"/>
          </div>
        </>
      )}
    </div>
  )
}
