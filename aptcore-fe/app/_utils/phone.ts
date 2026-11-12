export interface ParsedPhone {
  countryCode: string
  phoneCode: string
  phoneNumber: string
}

const COUNTRY_BY_PHONE_CODE: Record<string, string> = {
  '+65': 'SG',
  '+60': 'MY',
  '+62': 'ID',
  '+66': 'TH',
  '+84': 'VN',
  '+63': 'PH',
}

/**
 * Split a phone number into the country/phone code and local number the API
 * expects. Numbers without a `+` prefix are assumed to be Singapore local.
 *
 * Throws when the local part is shorter than 8 digits, which is what the API's
 * mobile validation rejects.
 */
export function parsePhoneNumber(phone: string): ParsedPhone {
  const cleanPhone = phone.replace(/[^\d+]/g, '')

  let countryCode = 'SG'
  let phoneCode = '+65'
  let phoneNumber = cleanPhone

  if (cleanPhone.startsWith('+')) {
    const knownCode = Object.keys(COUNTRY_BY_PHONE_CODE).find((code) => cleanPhone.startsWith(code))

    if (knownCode) {
      countryCode = COUNTRY_BY_PHONE_CODE[knownCode]
      phoneCode = knownCode
      phoneNumber = cleanPhone.substring(knownCode.length)
    } else {
      const match = cleanPhone.match(/^\+(\d{1,3})(.+)$/)
      if (match) {
        phoneCode = '+' + match[1]
        phoneNumber = match[2]
      }
    }
  } else {
    phoneNumber = cleanPhone
    phoneCode = '+65'
  }

  if (phoneNumber.length < 8) {
    throw new Error('Phone number must be at least 8 digits')
  }

  return { countryCode, phoneCode, phoneNumber }
}
