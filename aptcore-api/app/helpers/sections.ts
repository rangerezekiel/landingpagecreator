/* eslint-disable prettier/prettier */
import WebsiteSetting from '#models/website_setting'
import Section from '#models/section'
import SectionDetail from '#models/section_detail'
import SectionDetailItem from '#models/section_detail_item'
import SectionDetailItemContent from '#models/section_detail_item_content'
import { randomUUID } from 'node:crypto'


export async function createWebsiteSettings(websiteId: string) {
  const websiteSettingPayload = [
    {
      websiteId: websiteId,
      key: 'WHATSAPP',
      value: '081383143099',
    },
    {
      websiteId: websiteId,
      key: 'WHATSAPP_LINK',
      value:
        'https://wa.me/+6598765023?text=Hi,%20I%20am%20interested%20to%20view%20Tampines%20St%2094%20GLS%20sales%20gallery.%20Thank%20you',
    },
    {
      websiteId: websiteId,
      key: 'PHONE',
      value: '+65 9876 5023',
    },
    {
      websiteId: websiteId,
      key: 'PHONE_LINK',
      value: 'tel:+65 9876 5023',
    },
    {
      websiteId: websiteId,
      key: 'ADDRESS',
      value: 'Tampines St 94',
    },
    {
      websiteId: websiteId,
      key: 'EXPECTED_DATE',
      value: '2029',
    },
    {
      websiteId: websiteId,
      key: 'TENURE',
      value: '99 Years',
    },
    {
      websiteId: websiteId,
      key: 'TOTAL_UNITS',
      value: '585',
    },
    {
      websiteId: websiteId,
      key: 'DEVELOPER',
      value: 'Hoi Hup Realty and Sunway Developments',
    },
    {
      websiteId: websiteId,
      key: 'FOOTER_CONTENT',
      value: 'Huttons Asia Pte. Ltd - Licence No: L3008899K - www.huttonsgroup.com',
    },
    {
      // Per-website gtag.js ID (G- for GA4, AW- for Ads). Empty means no tag is injected.
      websiteId: websiteId,
      key: 'GOOGLE_TAG_ID',
      value: '',
    },
  ]

  return await WebsiteSetting.createMany(websiteSettingPayload)
}

export async function createSections(websiteId: string, createdBy: string) {
  // Banner
  await sBanner(websiteId, createdBy)
  
  // Hero
  await sHero(websiteId, createdBy)

  // ABOUT
  await sAbout(websiteId, createdBy)
  
  // E BROCURE
  await sEBrocure(websiteId, createdBy)

  // Location
  await sLocation(websiteId, createdBy)

  // Simillar Project
  await sSimillarProject(websiteId, createdBy)
  
  // Unit Type Accordion
  await sUnitTypeAccordion(websiteId, createdBy)

  // Unit Type
  await sUnitTypes(websiteId, createdBy)

  // Show flat
  await sShowFlatViewing(websiteId, createdBy)
  
  // FAQ
  await sFAQ(websiteId, createdBy)
  
  // Next Step
  await sNextStep(websiteId, createdBy)

  // What Is Next
  await sWhatIsNext(websiteId, createdBy)

  // DEVELOPE BY
  await sDevelopeBy(websiteId, createdBy)
  
  // Video
  await sVideo(websiteId, createdBy)

  // Form Submission
  await sFormSubmission(websiteId, createdBy)
  

}

async function sBanner(websiteId: string, createdBy: string){

  const payload = {
    websiteId: websiteId,
    key: 'BANNER',
    title: 'Banner',
    sortOrder: 0,
    createdBy,
  }

  const banner = await Section.create(payload)

  const payloadDetail = {
    sectionId: banner.id,
    key: 'LIST',
    label: 'List Banner',
    type: 'LIST',
    sort_order: 0,
  }

  const bannerDetail = await SectionDetail.create(payloadDetail)

  const payloadDetailItem = [
    {
      id: randomUUID(),
      sectionDetailId: bannerDetail.id,
      sortOrder: 0,
    },
  ]

  const bannerDetailItem = await SectionDetailItem.createMany(payloadDetailItem)

  const payloadDetailItemContent = [
    {
      id: randomUUID(),
      sectionDetailItemId: bannerDetailItem[0].id,
      key: 'BACKGROUND',
      type: 'IMAGE',
      value: 'sample_storage/landscape.jpg',
    },
    {
      id: randomUUID(),
      sectionDetailItemId: bannerDetailItem[0].id,
      key: 'TITLE',
      type: 'TEXT',
      value: 'Tampines St 94 GLS New Launch',
    },
    {
      id: randomUUID(),
      sectionDetailItemId: bannerDetailItem[0].id,
      key: 'DESCRIPTION',
      type: 'TEXTAREA',
      value: 'Prime development only 3 minutes walk to Tampines West MRT!',
    },
    {
      id: randomUUID(),
      sectionDetailItemId: bannerDetailItem[0].id,
      key: 'BUTTON',
      type: 'BUTTON',
      json_value : {
        TITLE : 'Book Showflat Viewing Today',
        SUBTITLE : null,
        ICON : null,
        LINK : "#contact"
      }
    },
  ]

  await SectionDetailItemContent.createMany(
    payloadDetailItemContent
  )
}

async function sHero(websiteId: string, createdBy: string){
  const payload = {
    websiteId: websiteId,
    key: 'HERO',
    title: 'Hero',
    sortOrder: 1,
    createdBy,
  }

  const hero = await Section.create(payload)

  const payloadDetail = [
    {
      sectionId: hero.id,
      key: 'BACKGROUND',
      label: 'Background',
      type: 'IMAGE',
      sort_order: 0,
      value: 'sample_storage/landscape.jpg',
      jsonValue: null,
    },
    {
      sectionId: hero.id,
      key: 'CONTENT',
      label: 'Content',
      type: 'RICH_TEXT',
      sort_order: 0,
      value: '<h3><strong>Limited Units Available!</strong></h3><h1><strong>Discover the Ultimate Lifestyle at Tampines Street 94</strong><br></h1><h1><strong>Register Your Interest Today!</strong><br></h1><ul class=\"list-disc ml-3\"><li><p>✓ Tampines Street 94 new launch—3 mins to Tampines West MRT!</p></li><li><p>✓ Prime District 18 location with high growth potential!</p></li><li><p>✓ Walk to top shopping malls like Century Square &amp; Tampines 1!</p></li><li><p>✓ Near Bedok Reservoir Park for nature &amp; recreation!</p></li><li><p>✓ Close to renowned schools like St. Hilda’s &amp; Poi Ching!</p></li></ul><p></p>',
      jsonValue: null,
    },
    {
      sectionId: hero.id,
      key: 'REGISTER_BUTTON',
      label: 'Register Button',
      type: 'BUTTON',
      sort_order: 0,
      value: null,
      jsonValue: {
          TITLE : "Register for VVIP Access",
          SUBTITLE : "imited Units Available – Act Fast!",
          ICON : null,
          LINK : "#contact"
      },
    },
  ]

  return await SectionDetail.createMany(payloadDetail)
}

async function sAbout(websiteId: string, createdBy: string){
  const payload = {
    websiteId: websiteId,
    key: 'ABOUT',
    title: 'About Us',
    sortOrder: 2,
    createdBy,
  }

  const about = await Section.create(payload)

  const payloadDetail = [
    {
      sectionId: about.id,
      key: 'IMAGE',
      label: 'Image',
      type: 'IMAGE',
      sort_order: 0,
      value: 'sample_storage/landscape.jpg',
      jsonValue: null,
    },
    {
      sectionId: about.id,
      key: 'TITLE',
      label: 'Title',
      type: 'TEXT',
      sort_order: 0,
      value: 'Future Growth and Investment Potential in Tampines Street 94',
      jsonValue: null,
    },
    {
      sectionId: about.id,
      key: 'CONTENT',
      label: 'Content',
      type: 'RICH_TEXT',
      sort_order: 0,
      value: '<p>The Tampines Street 94 new launch by Hoi Hup Realty and Sunway Developments is an exciting mixed-use development located in District 18, featuring 585 residential units on a 99-year leasehold site. Just a short 3-minute walk from Tampines West MRT, this prime location offers excellent connectivity via the Downtown Line, as well as major expressways such as the TPE and PIE. Residents will benefit from easy access to both Changi Airport and the Central Business District (CBD), making it ideal for urban living. The development is thoughtfully designed to combine residential, retail, and lifestyle amenities, presenting a promising investment opportunity with great potential for capital appreciation.</p><p></p><p>In addition to its convenient location, residents can enjoy a vibrant lifestyle with close proximity to shopping and dining options at Our Tampines Hub, Century Square, and Bedok Mall. For outdoor activities, Bedok Reservoir Park offers beautiful green spaces, while families will appreciate the nearby top educational institutions, including Temasek Polytechnic and several reputable primary schools like St. Hilda\'s Primary School within 1km. With the upcoming Cross Island Line (CRL) further enhancing connectivity, this development is poised to be a highly sought-after residential choice in Singapore’s eastern region.</p>',
      jsonValue: null,
    },

  ]
    
  return await SectionDetail.createMany(payloadDetail)
}

async function sEBrocure(websiteId: string, createdBy: string){
  const payload = {
    websiteId: websiteId,
    key: 'E_BROCURE',
    title: 'E-Brocure',
    sortOrder: 3,
    createdBy,
  }

  const eBrocure = await Section.create(payload)

  const payloadDetail = [
      {
        sectionId: eBrocure.id,
        key: 'TITLE',
        label: 'Title',
        type: 'TEXT',
        sort_order: 0,
        value: 'Get Your Tampines St 94 GLS E-Brochure Now!',
        jsonValue: null,
      },
      {
        sectionId: eBrocure.id,
        key: 'DESCRIPTION',
        label: 'Description',
        type: 'TEXTAREA',
        sort_order: 1,
        value: 'Explore Tampines St 94 GLS in detail with our comprehensive E-Brochure! Discover its impressive amenities and exciting upcoming developments.',
        jsonValue: null,
      },
      {
        sectionId: eBrocure.id,
        key: 'BUTTON',
        type: 'BUTTON',
        sort_order: 2,
        json_value : {
          TITLE : 'REQUEST E-BROCHURE',
          SUBTITLE : null,
          ICON : null,
          LINK : "#contact"
        }
      },
      {
        sectionId: eBrocure.id,
        key: 'IMAGE',
        label: 'Image',
        type: 'IMAGE',
        sort_order: 3,
        value: 'sample_storage/landscape.jpg',
        jsonValue: null,
      },
  ]

  return await SectionDetail.createMany(payloadDetail)
}

async function sShowFlatViewing(websiteId: string, createdBy: string){
  const payload = {
    websiteId: websiteId,
    key: 'SHOWFLAT_VIEWING',
    title: 'Showflat Viewing',
    sortOrder: 7,
    createdBy,
  }

  const showflatViewing = await Section.create(payload)

  const payloadDetail = [
    {
      sectionId: showflatViewing.id,
      key: 'IMAGE',
      label: 'Image',
      type: 'IMAGE',
      sort_order: 0,
      value: 'sample_storage/landscape.jpg',
      jsonValue: null,
    },
    {
      sectionId: showflatViewing.id,
      key: 'TITLE',
      type: 'TEXT',
      value: 'SHOWFLAT VIEWING',
    },
    {
      sectionId: showflatViewing.id,
      key: 'DESCRIPTION',
      label: 'Description',
      type: 'RICH_TEXT',
      sort_order: 0,
      value: 'Tampines St 94 GLS Sales Gallery is Strictly by Appointment only. Contact us now to receive your invitation to visit our showflat',
      jsonValue: null,
    },
    {
      sectionId: showflatViewing.id,
      key: 'HOTLINE_BUTTON',
      label: 'Hotline Button',
      type: 'BUTTON',
      sort_order: 0,
      value: null,
      jsonValue: {
          TITLE : "SHOWFLAT HOTLINE: +65 9876 5023",
          SUBTITLE : null,
          ICON : null,
          LINK : "tel : +65 9876 5023"
      },
    },
    {
      sectionId: showflatViewing.id,
      key: 'REQUEST_BUTTON',
      label: 'Request Button',
      type: 'BUTTON',
      sort_order: 0,
      value: null,
      jsonValue: {
          TITLE : "REQUEST SHOWFLAT VIEWING",
          SUBTITLE : null,
          ICON : null,
          LINK : "#contact"
      },
    },
  ]

  return await SectionDetail.createMany(payloadDetail)
}


async function sDevelopeBy(websiteId: string, createdBy: string){
  const payload = {
    websiteId: websiteId,
    key: 'DEVELOPED_BY',
    title: 'Developed By',
    sortOrder: 12,
    createdBy,
  }

  const about = await Section.create(payload)

  const payloadDetail = [
    {
      sectionId: about.id,
      key: 'BACKGROUND',
      label: 'Background',
      type: 'IMAGE',
      sort_order: 0,
      value: 'sample_storage/landscape.jpg',
      jsonValue: null,
    },
    {
      sectionId: about.id,
      key: 'LOGO',
      label: 'Logo',
      type: 'IMAGE',
      sort_order: 0,
      value: 'sample_storage/landscape.jpg',
      jsonValue: null,
    },
    {
      sectionId: about.id,
      key: 'DESCRIPTION',
      label: 'Description',
      type: 'RICH_TEXT',
      sort_order: 0,
      value: '<p>Since 1983, Hoi Hup Realty has built a strong reputation as a trusted property developer in Singapore, delivering a diverse range of projects, including mixed-use developments, landed homes, and commercial spaces. Their commitment to quality has earned them numerous awards over the years. Similarly, Sunway Group is renowned for its exceptional craftsmanship and stands as one of Malaysia’s largest conglomerates, with operations spanning 50 locations worldwide.</p>',
      jsonValue: null,
    },

  ]
    
  return await SectionDetail.createMany(payloadDetail)
}

async function sWhatIsNext(websiteId: string, createdBy: string){

  const payload = {
    websiteId: websiteId,
    key: 'WHAT_IS_NEXT',
    title: 'WHAT IS NEXT?',
    sortOrder: 10,
    createdBy,
  }

  const whatIsNext = await Section.create(payload)

  const payloadDetail = [{
    sectionId: whatIsNext.id,
    key: 'TITLE',
    label: 'Title',
    type: 'TEXT',
    value: 'What is Next?',
    sort_order: 0,
  },{
    sectionId: whatIsNext.id,
    key: 'LIST',
    label: 'List',
    type: 'LIST',
    sort_order: 0,
  },
  ]

  const whatIsNextDetail = await SectionDetail.createMany(payloadDetail)
  const listId = whatIsNextDetail[1].id

  const payloadDetailItem = [
    {
      sectionDetailId: listId,
      sortOrder: 0,
    },
    {
      sectionDetailId: listId,
      sortOrder: 1,
    },
    {
      sectionDetailId: listId,
      sortOrder: 2,
    },
  ]

  const detailItem = await SectionDetailItem.createMany(payloadDetailItem)

  const listId1 = detailItem[0].id
  const listId2 = detailItem[1].id
  const listId3 = detailItem[2].id

  const payloadDetailItemContent = [
    {
      sectionDetailItemId: listId1,
      key: 'SUBTITLE',
      type: 'TEXT',
      value: 'YOU ARE HERE',
    },
    {
      sectionDetailItemId: listId1,
      key: 'TITLE',
      type: 'TEXT',
      value: 'OBTAIN YOUR PREVIEW ACCESS',
    },
    {
      sectionDetailItemId: listId1,
      key: 'DESCRIPTION',
      type: 'TEXT',
      value: 'Get everything you need to know about Tampines St 94 GLS before the official preview opens.',
    },
    
    {
      sectionDetailItemId: listId2,
      key: 'SUBTITLE',
      type: 'TEXT',
      value: 'NEXT',
    },
    {
      sectionDetailItemId: listId2,
      key: 'TITLE',
      type: 'TEXT',
      value: 'BOOK A PREVIEW SLOT',
    },
    {
      sectionDetailItemId: listId2,
      key: 'DESCRIPTION',
      type: 'TEXT',
      value: 'After you’ve learned more, if you’re interested, book a slot at the official preview to tour the showflat.',
    },
    
    {
      sectionDetailItemId: listId3,
      key: 'SUBTITLE',
      type: 'TEXT',
      value: 'FINALLY',
    },
    {
      sectionDetailItemId: listId3,
      key: 'TITLE',
      type: 'TEXT',
      value: 'BALLOT AND PURCHASE UNITS',
    },
    {
      sectionDetailItemId: listId3,
      key: 'DESCRIPTION',
      type: 'TEXT',
      value: 'Get everything you need to know about Tampines St 94 GLS before the official preview opens.',
    },
  ]

  await SectionDetailItemContent.createMany(
    payloadDetailItemContent
  )
}

async function sFAQ(websiteId: string, createdBy: string){

  const payload = {
    websiteId: websiteId,
    key: 'FAQ',
    title: 'FAQ',
    sortOrder: 8,
    createdBy,
  }

  const Faq = await Section.create(payload)

  const payloadDetail = [{
    sectionId: Faq.id,
    key: 'IMAGE',
    label: 'Image',
    type: 'IMAGE',
    sort_order: 0,
    value: 'sample_storage/landscape.jpg',
  },{
    sectionId: Faq.id,
    key: 'LIST',
    label: 'List',
    type: 'LIST',
    sort_order: 0,
  },
  ]

  const FaqDetail = await SectionDetail.createMany(payloadDetail)
  const listId = FaqDetail[1].id

  const payloadDetailItem = [
    {
      sectionDetailId: listId,
      sortOrder: 0,
    },
    {
      sectionDetailId: listId,
      sortOrder: 1,
    },
    {
      sectionDetailId: listId,
      sortOrder: 2,
    },
    {
      sectionDetailId: listId,
      sortOrder: 3,
    },
    {
      sectionDetailId: listId,
      sortOrder: 4,
    },
  ]

  const detailItem = await SectionDetailItem.createMany(payloadDetailItem)

  const listId1 = detailItem[0].id
  const listId2 = detailItem[1].id
  const listId3 = detailItem[2].id
  const listId4 = detailItem[3].id
  const listId5 = detailItem[4].id


  const payloadDetailItemContent = [
    {
      sectionDetailItemId: listId1,
      key: 'TITLE',
      type: 'TEXT',
      value: 'Where is the showflat for Tampines St 94 GLS?',
    },
    {
      sectionDetailItemId: listId1,
      key: 'DESCRIPTION',
      type: 'TEXT',
      value: 'Register your interest here to get the latest details on Tampines St 94 GLS new launch, including the showflat address.',
    },
    
    {
      sectionDetailItemId: listId2,
      key: 'TITLE',
      type: 'TEXT',
      value: 'What is the number of units available at Tampines St 94 GLS?',
    },
    {
      sectionDetailItemId: listId2,
      key: 'DESCRIPTION',
      type: 'TEXT',
      value: 'Tampines St 94 GLS offer 585 residential units',
    },
    
    {
      sectionDetailItemId: listId3,
      key: 'TITLE',
      type: 'TEXT',
      value: 'What is the Price for Tampines St 94 GLS condo?',
    },
    {
      sectionDetailItemId: listId3,
      key: 'DESCRIPTION',
      type: 'TEXT',
      value: 'Register your interest here to get the latest details on Tampines St 94 GLS new launch condo, including the latest price list.',
    },
    
    {
      sectionDetailItemId: listId4,
      key: 'TITLE',
      type: 'TEXT',
      value: 'When is the TOP date for Tampines St 94 GLS?',
    },
    {
      sectionDetailItemId: listId4,
      key: 'DESCRIPTION',
      type: 'TEXT',
      value: 'The expected TOP date for Tampines St 94 GLS is 2029.',
    },
    
    {
      sectionDetailItemId: listId5,
      key: 'TITLE',
      type: 'TEXT',
      value: 'What is the address for Tampines St 94 GLS?',
    },
    {
      sectionDetailItemId: listId5,
      key: 'DESCRIPTION',
      type: 'TEXT',
      value: 'The address for Tampines St 94 GLS is along Tampines St 94, District 18.',
    },
  ]

  await SectionDetailItemContent.createMany(
    payloadDetailItemContent
  )
}

async function sNextStep(websiteId: string, createdBy: string){

  const payload = {
    websiteId: websiteId,
    key: 'NEXT_STEP',
    title: 'NEXT STEP',
    sortOrder: 10,
    createdBy,
  }

  const nextStep = await Section.create(payload)

  const payloadDetail = [{
    sectionId: nextStep.id,
    key: 'TITLE',
    label: 'Title',
    type: 'TEXT',
    value: 'HOW DO YOU WANT TO TAKE THE NEXT STEP?',
    sort_order: 0,
  },{
    sectionId: nextStep.id,
    key: 'DESCRIPTION',
    label: 'Description',
    type: 'RICH_TEXT',
    value: 'The Tampines St 94 GLS is coming soon in, here’s how you can learn more:',
    sort_order: 0,
  },{
    sectionId: nextStep.id,
    key: 'LIST',
    label: 'List',
    type: 'LIST',
    sort_order: 1,
  },
  ]

  const nextStepDetail = await SectionDetail.createMany(payloadDetail)
  const listId = nextStepDetail[2].id

  const payloadDetailItem = [
    {
      sectionDetailId: listId,
      sortOrder: 0,
    },
    {
      sectionDetailId: listId,
      sortOrder: 1,
    },
  ]

  const detailItem = await SectionDetailItem.createMany(payloadDetailItem)

  const listId1 = detailItem[0].id
  const listId2 = detailItem[1].id

  const payloadDetailItemContent = [
    {
      sectionDetailItemId: listId1,
      key: 'BACKGROUND',
      type: 'IMAGE',
      value: 'sample_storage/landscape.jpg',
    },
    {
      sectionDetailItemId: listId1,
      key: 'SUBTITLE',
      type: 'TEXT',
      value: 'SUBSCRIBE NOW FOR FIRSTHAND INFORMATION',
    },
    {
      sectionDetailItemId: listId1,
      key: 'TITLE',
      type: 'TEXT',
      value: 'GET PREVIEW ACCESS',
    },
    {
      sectionDetailItemId: listId1,
      key: 'DESCRIPTION',
      type: 'RICH_TEXT',
      value: '✓ Get the E-Brochure +  Floor Plans + Viewing Invitation the moment they are released by the developer!',
    },
    {
      sectionDetailItemId: listId1,
      key: 'BUTTON',
      type: 'BUTTON',
      json_value : {
        TITLE : 'GET PREVIEW ACCESS',
        SUBTITLE : 'PREVIEW INVITE + PRICE LIST + FLOOR PLANS',
        ICON : null,
        LINK : "#contact"
      }
    },
    
    {
      sectionDetailItemId: listId2,
      key: 'BACKGROUND',
      type: 'IMAGE',
      value: 'sample_storage/landscape.jpg',
    },
    {
      sectionDetailItemId: listId2,
      key: 'SUBTITLE',
      type: 'TEXT',
      value: 'BEST UNITS AVAILABLE',
    },
    {
      sectionDetailItemId: listId2,
      key: 'TITLE',
      type: 'TEXT',
      value: 'Register Now for Exclusive Offering',
    },
    {
      sectionDetailItemId: listId2,
      key: 'DESCRIPTION',
      type: 'RICH_TEXT',
      value: '✓ Get the latest launch-only prices before the best units are booked at the Tampines St 94 GLS launch.',
    },
    {
      sectionDetailItemId: listId2,
      key: 'BUTTON',
      type: 'BUTTON',
      json_value : {
        TITLE : 'Register Now for Exclusive Offering',
        SUBTITLE : 'UNLOCK EXCLUSIVE LAUNCH OFFERS',
        ICON : null,
        LINK : "#contact"
      }
    },
  ]

  await SectionDetailItemContent.createMany(
    payloadDetailItemContent
  )
}

async function sUnitTypes(websiteId: string, createdBy: string){

  const payload = {
    websiteId: websiteId,
    key: 'UNIT_TYPES',
    title: 'NEXT STEP',
    sortOrder: 6,
    createdBy,
  }

  const unitType = await Section.create(payload)

  const payloadDetail = [
  {
    sectionId: unitType.id,
    key: 'TITLE',
    label: 'Title',
    type: 'TEXT',
    value: 'Tampines St 94 GLS floorplans',
    sort_order: 0,
  },{
    sectionId: unitType.id,
    key: 'LIST',
    label: 'List',
    type: 'LIST',
    sort_order: 1,
  },{
    sectionId: unitType.id,
    key: 'BUTTON',
    label: 'Button',
    type: 'BUTTON',
    json_value : {
      TITLE : 'Download all floor plan',
      SUBTITLE : null,
      ICON : null,
      LINK : "#contact"
    },
    sort_order: 2,
  },
  ]

  const unitTypeDetail = await SectionDetail.createMany(payloadDetail)
  const listId = unitTypeDetail[1].id

  const payloadDetailItem = [
    {
      sectionDetailId: listId,
      sortOrder: 0,
    },
    {
      sectionDetailId: listId,
      sortOrder: 1,
    },
    {
      sectionDetailId: listId,
      sortOrder: 1,
    },
    {
      sectionDetailId: listId,
      sortOrder: 1,
    },
    {
      sectionDetailId: listId,
      sortOrder: 1,
    },
  ]

  const detailItem = await SectionDetailItem.createMany(payloadDetailItem)

  const listId1 = detailItem[0].id
  const listId2 = detailItem[1].id
  const listId3 = detailItem[2].id
  const listId4 = detailItem[3].id
  const listId5 = detailItem[4].id

  const payloadDetailItemContent = [
    {
      sectionDetailItemId: listId1,
      key: 'IMAGE',
      type: 'IMAGE',
      value: 'sample_storage/landscape.jpg',
    },
    {
      sectionDetailItemId: listId1,
      key: 'TITLE',
      type: 'TEXT',
      value: 'Tampines St 94 GLS Floorplans - 1 Bedroom',
    },
    {
      sectionDetailItemId: listId1,
      key: 'DESCRIPTION',
      type: 'RICH_TEXT',
      value: 'Disclaimer: The floor plans, images, and other visuals are not to scale and are for illustration only. They are intended to provide a general idea of the layout and may not reflect actual dimensions or features. All information is subject to change. Accuracy of specifications or dimensions is not guaranteed. These materials are for seeking indications of interest and do not form part of any contract.',
    },
    {
      sectionDetailItemId: listId1,
      key: 'BUTTON',
      type: 'BUTTON',
      json_value : {
        TITLE : 'VIEW FLOOR PLAN',
        SUBTITLE : null,
        ICON : null,
        LINK : null
      }
    },
    
    {
      sectionDetailItemId: listId2,
      key: 'IMAGE',
      type: 'IMAGE',
      value: 'sample_storage/landscape.jpg',
    },
    {
      sectionDetailItemId: listId2,
      key: 'TITLE',
      type: 'TEXT',
      value: 'Tampines St 94 GLS Floorplans - 2 Bedroom',
    },
    {
      sectionDetailItemId: listId2,
      key: 'DESCRIPTION',
      type: 'RICH_TEXT',
      value: 'Disclaimer: The floor plans, images, and other visuals are not to scale and are for illustration only. They are intended to provide a general idea of the layout and may not reflect actual dimensions or features. All information is subject to change. Accuracy of specifications or dimensions is not guaranteed. These materials are for seeking indications of interest and do not form part of any contract.',
    },
    {
      sectionDetailItemId: listId2,
      key: 'BUTTON',
      type: 'BUTTON',
      json_value : {
        TITLE : 'VIEW FLOOR PLAN',
        SUBTITLE : null,
        ICON : null,
        LINK : null
      }
    },
    
    {
      sectionDetailItemId: listId3,
      key: 'IMAGE',
      type: 'IMAGE',
      value: 'sample_storage/landscape.jpg',
    },
    {
      sectionDetailItemId: listId3,
      key: 'TITLE',
      type: 'TEXT',
      value: 'Tampines St 94 GLS Floorplans - 3 Bedroom',
    },
    {
      sectionDetailItemId: listId3,
      key: 'DESCRIPTION',
      type: 'RICH_TEXT',
      value: 'Disclaimer: The floor plans, images, and other visuals are not to scale and are for illustration only. They are intended to provide a general idea of the layout and may not reflect actual dimensions or features. All information is subject to change. Accuracy of specifications or dimensions is not guaranteed. These materials are for seeking indications of interest and do not form part of any contract.',
    },
    {
      sectionDetailItemId: listId3,
      key: 'BUTTON',
      type: 'BUTTON',
      json_value : {
        TITLE : 'VIEW FLOOR PLAN',
        SUBTITLE : null,
        ICON : null,
        LINK : null
      }
    },
    
    {
      sectionDetailItemId: listId4,
      key: 'IMAGE',
      type: 'IMAGE',
      value: 'sample_storage/landscape.jpg',
    },
    {
      sectionDetailItemId: listId4,
      key: 'TITLE',
      type: 'TEXT',
      value: 'Tampines St 94 GLS Floorplans - 4 Bedroom',
    },
    {
      sectionDetailItemId: listId4,
      key: 'DESCRIPTION',
      type: 'RICH_TEXT',
      value: 'Disclaimer: The floor plans, images, and other visuals are not to scale and are for illustration only. They are intended to provide a general idea of the layout and may not reflect actual dimensions or features. All information is subject to change. Accuracy of specifications or dimensions is not guaranteed. These materials are for seeking indications of interest and do not form part of any contract.',
    },
    {
      sectionDetailItemId: listId4,
      key: 'BUTTON',
      type: 'BUTTON',
      json_value : {
        TITLE : 'VIEW FLOOR PLAN',
        SUBTITLE : null,
        ICON : null,
        LINK : null
      }
    },
    
    {
      sectionDetailItemId: listId5,
      key: 'IMAGE',
      type: 'IMAGE',
      value: 'sample_storage/landscape.jpg',
    },
    {
      sectionDetailItemId: listId5,
      key: 'TITLE',
      type: 'TEXT',
      value: 'Tampines St 94 GLS Floorplans - 5 Bedroom',
    },
    {
      sectionDetailItemId: listId5,
      key: 'DESCRIPTION',
      type: 'RICH_TEXT',
      value: 'Disclaimer: The floor plans, images, and other visuals are not to scale and are for illustration only. They are intended to provide a general idea of the layout and may not reflect actual dimensions or features. All information is subject to change. Accuracy of specifications or dimensions is not guaranteed. These materials are for seeking indications of interest and do not form part of any contract.',
    },
    {
      sectionDetailItemId: listId5,
      key: 'BUTTON',
      type: 'BUTTON',
      json_value : {
        TITLE : 'VIEW FLOOR PLAN',
        SUBTITLE : null,
        ICON : null,
        LINK : null
      }
    },
  ]

  await SectionDetailItemContent.createMany(
    payloadDetailItemContent
  )
}

async function sLocation(websiteId: string, createdBy: string){

  const payload = {
    websiteId: websiteId,
    key: 'LOCATION',
    title: 'Location',
    sortOrder: 4,
    createdBy,
  }

  const location = await Section.create(payload)

  const payloadDetail = [{
      sectionId: location.id,
      key: 'HIGHLIGHT',
      label: 'Highlight',
      type: 'LIST',
      sort_order: 0,
    },{
      sectionId: location.id,
      key: 'LIST',
      label: 'List',
      type: 'LIST',
      value: 'Tampines Street 94 New Launch Offers Unmatched Convenience at Your Doorstep',
      sort_order: 1,
    },{
      sectionId: location.id,
      key: 'BUTTON',
      label: 'Button',
      type: 'BUTTON',
      json_value : {
        TITLE : 'REGISTER YOUR INTEREST',
        SUBTITLE : null,
        ICON : null,
        LINK : "#contact"
      },
      sort_order: 2,
    },
    {
      sectionId: location.id,
      key: 'TITLE',
      type: 'TEXT',
      value: 'Location',
    },
  ]

  const locationDetail = await SectionDetail.createMany(payloadDetail)
  const detailIdHighlight = locationDetail[0].id
  const detailIdList = locationDetail[1].id

  const payloadDetailItem = [
    {
      sectionDetailId: detailIdHighlight,
      sortOrder: 0,
    },
    {
      sectionDetailId: detailIdHighlight,
      sortOrder: 1,
    },
    {
      sectionDetailId: detailIdHighlight,
      sortOrder: 2,
    },
    {
      sectionDetailId: detailIdHighlight,
      sortOrder: 3,
    },
    {
      sectionDetailId: detailIdHighlight,
      sortOrder: 4,
    },
    {
      sectionDetailId: detailIdHighlight,
      sortOrder: 5,
    },
    
    {
      sectionDetailId: detailIdList,
      sortOrder: 1,
    },
    {
      sectionDetailId: detailIdList,
      sortOrder: 2,
    },
    {
      sectionDetailId: detailIdList,
      sortOrder: 3,
    },
    {
      sectionDetailId: detailIdList,
      sortOrder: 4,
    },
    {
      sectionDetailId: detailIdList,
      sortOrder: 5,
    },
  ]

  const detailItem = await SectionDetailItem.createMany(payloadDetailItem)

  const highlightId1 = detailItem[0].id
  const highlightId2 = detailItem[1].id
  const highlightId3 = detailItem[2].id
  const highlightId4 = detailItem[3].id
  const highlightId5 = detailItem[4].id
  const highlightId6 = detailItem[5].id

  const listId1 = detailItem[6].id
  const listId2 = detailItem[7].id
  const listId3 = detailItem[8].id
  const listId4 = detailItem[9].id
  const listId5 = detailItem[10].id

  const payloadDetailItemContent = [
    {
      sectionDetailItemId: highlightId1,
      key: 'BACKGROUND',
      type: 'IMAGE',
      value: 'sample_storage/landscape.jpg',
    },
    {
      sectionDetailItemId: highlightId1,
      key: 'TITLE',
      type: 'TEXT',
      value: 'tampines west mrt',
    },
    
    {
      sectionDetailItemId: highlightId2,
      key: 'BACKGROUND',
      type: 'IMAGE',
      value: 'sample_storage/landscape.jpg',
    },
    {
      sectionDetailItemId: highlightId2,
      key: 'TITLE',
      type: 'TEXT',
      value: 'Temasek Polytechnic',
    },
    
    {
      sectionDetailItemId: highlightId3,
      key: 'BACKGROUND',
      type: 'IMAGE',
      value: 'sample_storage/landscape.jpg',
    },
    {
      sectionDetailItemId: highlightId3,
      key: 'TITLE',
      type: 'TEXT',
      value: 'St Hilda\'s Primary School',
    },
    
    {
      sectionDetailItemId: highlightId4,
      key: 'BACKGROUND',
      type: 'IMAGE',
      value: 'sample_storage/landscape.jpg',
    },
    {
      sectionDetailItemId: highlightId4,
      key: 'TITLE',
      type: 'TEXT',
      value: 'Bedok Reservoir Park',
    },

    {
      sectionDetailItemId: highlightId5,
      key: 'BACKGROUND',
      type: 'IMAGE',
      value: 'sample_storage/landscape.jpg',
    },
    {
      sectionDetailItemId: highlightId5,
      key: 'TITLE',
      type: 'TEXT',
      value: 'east point mall',
    },

    {
      sectionDetailItemId: highlightId6,
      key: 'BACKGROUND',
      type: 'IMAGE',
      value: 'sample_storage/landscape.jpg',
    },
    {
      sectionDetailItemId: highlightId6,
      key: 'TITLE',
      type: 'TEXT',
      value: 'changi general hospital',
    },






    {
      sectionDetailItemId: listId1,
      key: 'TITLE',
      type: 'TEXT',
      value: 'Prime Location at Tampines Street 94',
    },
    {
      sectionDetailItemId: listId1,
      key: 'DESCRIPTION',
      type: 'RICH_TEXT',
      value: 'Mixed-use development near Tampines West MRT, offering seamless connectivity in District 18.',
    },
    
    {
      sectionDetailItemId: listId2,
      key: 'TITLE',
      type: 'TEXT',
      value: 'Excellent Public Transport Access',
    },
    {
      sectionDetailItemId: listId2,
      key: 'DESCRIPTION',
      type: 'RICH_TEXT',
      value: '3-minute walk to Tampines West MRT and easy access to major expressways like PIE & TPE.',
    },
    
    {
      sectionDetailItemId: listId3,
      key: 'TITLE',
      type: 'TEXT',
      value: 'Top Shopping & Dining Hub',
    },
    {
      sectionDetailItemId: listId3,
      key: 'DESCRIPTION',
      type: 'RICH_TEXT',
      value: 'Close to Tampines 1, Century Square, and Our Tampines Hub for endless retail and F&B options.',
    },
    
    {
      sectionDetailItemId: listId4,
      key: 'TITLE',
      type: 'TEXT',
      value: 'Green & Recreational Spaces',
    },
    {
      sectionDetailItemId: listId4,
      key: 'DESCRIPTION',
      type: 'RICH_TEXT',
      value: 'Next to Bedok Reservoir Park, it is perfect for outdoor activities and a refreshing lifestyle.',
    },
    
    {
      sectionDetailItemId: listId5,
      key: 'TITLE',
      type: 'TEXT',
      value: 'Renowned Schools Nearby',
    },
    {
      sectionDetailItemId: listId5,
      key: 'DESCRIPTION',
      type: 'RICH_TEXT',
      value: 'Within 1km of St. Hilda’s Primary and Poi Ching School, ensuring quality education for families.',
    },


    
  ]

  await SectionDetailItemContent.createMany(
    payloadDetailItemContent
  )
}

async function sSimillarProject(websiteId: string, createdBy: string){

  const payload = {
    websiteId: websiteId,
    key: 'SIMILLAR_PROJECT',
    title: 'Similar Project',
    sortOrder: 13,
    createdBy,
  }

  const similarProject = await Section.create(payload)

  const payloadDetail = [
    {
      sectionId: similarProject.id,
      key: 'TITLE',
      label: 'Title',
      type: 'TEXT',
      sort_order: 0,
      value: 'Similar Projects',
      jsonValue: null,
    },
    {
      sectionId: similarProject.id,
      key: 'DESCRIPTION',
      label: 'Description',
      type: 'TEXTAREA',
      sort_order: 1,
      value: 'While Bayshore Road GLS offers an unparalleled living experience, there are other outstanding projects that might capture your interest. Whether you\'re looking for a luxurious urban oasis, a family-friendly neighborhood, or an investment opportunity, these developments showcase the best in modern living.',
      jsonValue: null,
    },
    {
      sectionId: similarProject.id,
      key: 'PROJECTS',
      label: 'Projects',
      type: 'LIST',
      sort_order: 2,
    },
  ]

  const similarProjectDetail = await SectionDetail.createMany(payloadDetail)
  const detailIdProject = similarProjectDetail[2].id

  const payloadDetailItem = [
    {
      sectionDetailId: detailIdProject,
      sortOrder: 0,
    },
    {
      sectionDetailId: detailIdProject,
      sortOrder: 1,
    },
    {
      sectionDetailId: detailIdProject,
      sortOrder: 2,
    },
    {
      sectionDetailId: detailIdProject,
      sortOrder: 3,
    },
  ]

  const detailItem = await SectionDetailItem.createMany(payloadDetailItem)

  const projectId1 = detailItem[0].id
  const projectId2 = detailItem[1].id
  const projectId3 = detailItem[2].id
  const projectId4 = detailItem[3].id

  const payloadDetailItemContent = [
    {
      sectionDetailItemId: projectId1,
      key: 'BACKGROUND',
      type: 'IMAGE',
      value: 'sample_storage/landscape.jpg',
    },
    {
      sectionDetailItemId: projectId1,
      key: 'TITLE',
      type: 'TEXT',
      value: 'Tampines Central 8',
    },
    {
      sectionDetailItemId: projectId1,
      key: 'WEBSITE_LINK',
      type: 'TEXT',
      value: 'https://tampinescentral8.com',
    },
    
    {
      sectionDetailItemId: projectId2,
      key: 'BACKGROUND',
      type: 'IMAGE',
      value: 'sample_storage/landscape.jpg',
    },
    {
      sectionDetailItemId: projectId2,
      key: 'TITLE',
      type: 'TEXT',
      value: 'Bedok Central',
    },
    {
      sectionDetailItemId: projectId2,
      key: 'WEBSITE_LINK',
      type: 'TEXT',
      value: 'https://bedokcentral.com',
    },
    
    {
      sectionDetailItemId: projectId3,
      key: 'BACKGROUND',
      type: 'IMAGE',
      value: 'sample_storage/landscape.jpg',
    },
    {
      sectionDetailItemId: projectId3,
      key: 'TITLE',
      type: 'TEXT',
      value: 'Punggol Digital District',
    },
    {
      sectionDetailItemId: projectId3,
      key: 'WEBSITE_LINK',
      type: 'TEXT',
      value: 'https://punggoldigital.com',
    },

    {
      sectionDetailItemId: projectId4,
      key: 'BACKGROUND',
      type: 'IMAGE',
      value: 'sample_storage/landscape.jpg',
    },
    {
      sectionDetailItemId: projectId4,
      key: 'TITLE',
      type: 'TEXT',
      value: 'Jurong Lake District',
    },
    {
      sectionDetailItemId: projectId4,
      key: 'WEBSITE_LINK',
      type: 'TEXT',
      value: 'https://juronglake.com',
    },
  ]

  await SectionDetailItemContent.createMany(
    payloadDetailItemContent
  )
}

async function sUnitTypeAccordion(websiteId: string, createdBy: string){

  const payload = {
    websiteId: websiteId,
    key: 'UNIT_TYPES_ACCORDION',
    title: 'Unit Types Accordion',
    sortOrder: 5,
    createdBy,
  }

  const unitTypeAccordion = await Section.create(payload)

  const payloadDetail = [
    {
      sectionId: unitTypeAccordion.id,
      key: 'IMAGE',
      label: 'Image',
      type: 'IMAGE',
      sort_order: 0,
      value: 'sample_storage/landscape.jpg',
    },
    {
      sectionId: unitTypeAccordion.id,
      key: 'LIST',
      label: 'List',
      type: 'LIST',
      sort_order: 1,
    },
    {
      sectionId: unitTypeAccordion.id,
      key: 'TITLE',
      label: 'Title',
      type: 'TEXT',
      sort_order: 2,
      value: 'UNIT TYPES',
    },
    {
      sectionId: unitTypeAccordion.id,
      key: 'DESCRIPTION',
      label: 'Description',
      type: 'TEXT',
      sort_order: 3,
      value: 'Tampines St 94 GLS PRICING *subject to change & availability',
    },
  ]


  const unitTypeAccordionDetail = await SectionDetail.createMany(payloadDetail)
  const listId = unitTypeAccordionDetail[1].id

  const payloadDetailItem = [
    {
      sectionDetailId: listId,
      sortOrder: 0,
    },
    {
      sectionDetailId: listId,
      sortOrder: 1,
    },
    {
      sectionDetailId: listId,
      sortOrder: 2,
    },
    {
      sectionDetailId: listId,
      sortOrder: 3,
    },
  ]

  const detailItem = await SectionDetailItem.createMany(payloadDetailItem)

  const listId1 = detailItem[0].id
  const listId2 = detailItem[1].id
  const listId3 = detailItem[2].id
  const listId4 = detailItem[3].id

  const payloadDetailItemContent = [
    {
      sectionDetailItemId: listId1,
      key: 'TITLE',
      type: 'TEXT',
      value: 'Tampines St 94 GLS Units - 1 Bedroom',
    },
    {
      sectionDetailItemId: listId1,
      key: 'DESCRIPTION',
      type: 'RICH_TEXT',
      value: 'Register your interest here to receive the latest details on Tampines St 94 GLS, including the unit mix and layouts.',
    },
    
    {
      sectionDetailItemId: listId2,
      key: 'TITLE',
      type: 'TEXT',
      value: 'Tampines St 94 GLS Units - 2 Bedroom',
    },
    {
      sectionDetailItemId: listId2,
      key: 'DESCRIPTION',
      type: 'RICH_TEXT',
      value: 'Register your interest here to receive the latest details on Tampines St 94 GLS, including the unit mix and layouts.',
    },
    
    {
      sectionDetailItemId: listId3,
      key: 'TITLE',
      type: 'TEXT',
      value: 'Tampines St 94 GLS Units - 3 Bedroom',
    },
    {
      sectionDetailItemId: listId3,
      key: 'DESCRIPTION',
      type: 'RICH_TEXT',
      value: 'Register your interest here to receive the latest details on Tampines St 94 GLS, including the unit mix and layouts.',
    },
    
    {
      sectionDetailItemId: listId4,
      key: 'TITLE',
      type: 'TEXT',
      value: 'Tampines St 94 GLS Units - 4 Bedroom',
    },
    {
      sectionDetailItemId: listId4,
      key: 'DESCRIPTION',
      type: 'RICH_TEXT',
      value: 'Register your interest here to receive the latest details on Tampines St 94 GLS, including the unit mix and layouts.',
    },
  ]

  await SectionDetailItemContent.createMany(
    payloadDetailItemContent
  )
}

async function sVideo(websiteId: string, createdBy: string){

  const payload = {
    websiteId: websiteId,
    key: 'VIDEO',
    title: 'Video',
    sortOrder: 0,
    createdBy,
  }

  const video = await Section.create(payload)

  const payloadDetail = {
    sectionId: video.id,
    key: 'LIST',
    label: 'List Video',
    type: 'LIST',
    sort_order: 0,
  }

  const videoDetail = await SectionDetail.create(payloadDetail)

  const payloadDetailItem = [
    {
      id: randomUUID(),
      sectionDetailId: videoDetail.id,
      sortOrder: 0,
    },
  ]

  const videoDetailItem = await SectionDetailItem.createMany(payloadDetailItem)

  const payloadDetailItemContent = [
    {
      id: randomUUID(),
      sectionDetailItemId: videoDetailItem[0].id,
      key: 'THUMBNAIL',
      type: 'IMAGE',
      value: 'sample_storage/landscape.jpg',
    },
    {
      id: randomUUID(),
      sectionDetailItemId: videoDetailItem[0].id,
      key: 'TITLE',
      type: 'TEXT',
      value: 'Tampines St 94 GLS New Launch',
    },
    {
      id: randomUUID(),
      sectionDetailItemId: videoDetailItem[0].id,
      key: 'DESCRIPTION',
      type: 'TEXTAREA',
      value: 'Prime development only 3 minutes walk to Tampines West MRT!',
    },
    {
      id: randomUUID(),
      sectionDetailItemId: videoDetailItem[0].id,
      key: 'LINK',
      type: 'TEXT',
      value: 'youtube.com',
    },
  ]

  await SectionDetailItemContent.createMany(
    payloadDetailItemContent
  )
}

async function sFormSubmission(websiteId: string, createdBy: string){
  const payload = {
    websiteId: websiteId,
    key: 'FORM_SUBMISSION',
    title: 'Form Submission',
    sortOrder: 12,
    createdBy,
  }

  const about = await Section.create(payload)

  const payloadDetail = [
    {
      sectionId: about.id,
      key: 'BACKGROUND',
      label: 'Background',
      type: 'IMAGE',
      sort_order: 0,
      value: 'sample_storage/landscape.jpg',
      jsonValue: null,
    },
    {
      sectionId: about.id,
      key: 'CONTENT',
      label: 'Content',
      type: 'RICH_TEXT',
      sort_order: 0,
      value: 'Hi there! Welcome to the official Tampines St 94 GLS concierge. How can we help you?',
      jsonValue: null,
    },
    {
      sectionId: about.id,
      key: 'PRIVYR_ENABLED',
      label: 'Use Privyr Form',
      type: 'BOOLEAN',
      sort_order: 2,
      value: 'false',
      jsonValue: null,
    },
    {
      // Secret: the URL path doubles as the Privyr auth token, so it is stripped
      // from the public section read and never sent to the browser.
      sectionId: about.id,
      key: 'PRIVYR_WEBHOOK_URL',
      label: 'Privyr Webhook URL',
      type: 'TEXT',
      sort_order: 3,
      value: null,
      jsonValue: null,
    },
    {
      // Optional image rendered above the text on the Privyr form. Unset means
      // the form keeps its text-only layout.
      sectionId: about.id,
      key: 'PHOTO',
      label: 'Photo',
      type: 'IMAGE',
      sort_order: 4,
      value: null,
      jsonValue: null,
    },
  ]

  return await SectionDetail.createMany(payloadDetail)
}