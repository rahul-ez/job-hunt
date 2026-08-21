export type AdzunaJob = {
  id: string
  title: string
  company: { display_name: string }
  location: { display_name: string }
  description: string
  redirect_url: string
  salary_min?: number
  salary_max?: number
  salary_is_predicted?: '0' | '1'
  contract_type?: string
  created: string
  category?: { tag: string; label: string }
}

export function parseLocationAndCountry(rawLocation?: string): {
  country: string
  cleanLocation?: string
} {
  if (!rawLocation || !rawLocation.trim()) {
    return { country: 'us' }
  }

  const loc = rawLocation.trim().toLowerCase()

  // Clean remote keywords
  let stripped = loc
    .replace(/\b(remote|worldwide|global|anywhere|hybrid|onsite|on-site)\b/gi, '')
    .replace(/^[\s,/-]+|[\s,/-]+$/g, '')
    .trim()

  // Country detection rules
  const indiaKeywords = [
    'india',
    'bangalore',
    'bengaluru',
    'mumbai',
    'delhi',
    'hyderabad',
    'pune',
    'chennai',
    'noida',
    'gurgaon',
    'gurugram',
    'kolkata',
    'ahmedabad',
  ]
  const ukKeywords = [
    'uk',
    'united kingdom',
    'england',
    'london',
    'manchester',
    'birmingham',
    'edinburgh',
    'glasgow',
    'bristol',
    'leeds',
    'cambridge',
    'oxford',
  ]
  const canadaKeywords = [
    'canada',
    'toronto',
    'vancouver',
    'montreal',
    'ottawa',
    'calgary',
    'edmonton',
    'waterloo',
  ]
  const australiaKeywords = [
    'australia',
    'sydney',
    'melbourne',
    'brisbane',
    'perth',
    'adelaide',
  ]
  const germanyKeywords = ['germany', 'deutschland', 'berlin', 'munich', 'münchen', 'frankfurt', 'hamburg']
  const singaporeKeywords = ['singapore']

  if (indiaKeywords.some((k) => loc.includes(k))) {
    return { country: 'in', cleanLocation: stripped || undefined }
  }
  if (ukKeywords.some((k) => loc.includes(k))) {
    return { country: 'gb', cleanLocation: stripped || undefined }
  }
  if (canadaKeywords.some((k) => loc.includes(k))) {
    return { country: 'ca', cleanLocation: stripped || undefined }
  }
  if (australiaKeywords.some((k) => loc.includes(k))) {
    return { country: 'au', cleanLocation: stripped || undefined }
  }
  if (germanyKeywords.some((k) => loc.includes(k))) {
    return { country: 'de', cleanLocation: stripped || undefined }
  }
  if (singaporeKeywords.some((k) => loc.includes(k))) {
    return { country: 'sg', cleanLocation: stripped || undefined }
  }

  // Default to US
  return { country: 'us', cleanLocation: stripped || undefined }
}

export async function searchJobs(
  jobTitle: string,
  location?: string,
  explicitCountry?: string,
): Promise<AdzunaJob[]> {
  const appId = process.env.ADZUNA_APP_ID
  const appKey = process.env.ADZUNA_APP_KEY

  if (!appId || !appKey) {
    throw new Error('Adzuna API credentials are not configured in environment variables.')
  }

  const { country: detectedCountry, cleanLocation } = parseLocationAndCountry(location)
  const country = (explicitCountry || detectedCountry || 'us').toLowerCase()

  const params = new URLSearchParams({
    app_id: appId,
    app_key: appKey,
    what: jobTitle,
    category: 'it-jobs', // Always filter to IT jobs per rules
    results_per_page: '10',
    'content-type': 'application/json',
  })

  // Only pass where if cleanLocation is present and valid
  if (cleanLocation) {
    params.set('where', cleanLocation)
  }

  const url = `https://api.adzuna.com/v1/api/jobs/${country}/search/1?${params.toString()}`

  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`Adzuna API responded with status ${response.status}: ${response.statusText}`)
  }

  const data = await response.json()
  let results = (data.results as AdzunaJob[]) || []

  // If searching with a specific city in the country returned 0 results, fall back to country-wide search
  if (results.length === 0 && cleanLocation) {
    params.delete('where')
    const fallbackUrl = `https://api.adzuna.com/v1/api/jobs/${country}/search/1?${params.toString()}`
    try {
      const fallbackRes = await fetch(fallbackUrl, {
        headers: { Accept: 'application/json' },
        cache: 'no-store',
      })
      if (fallbackRes.ok) {
        const fallbackData = await fallbackRes.json()
        results = (fallbackData.results as AdzunaJob[]) || []
      }
    } catch {
      // Ignore fallback error and return original empty array
    }
  }

  return results
}
