export const LOCALSTORAGE_KEYS = {
    AUTHENTICATED: 'isAuthenticated_v1',
    PREVIOUS_LOCATION: 'previousLocation'
}

export const SET_USER_INFO = 'SET_USER_INFO'

export const TRIP_TYPES = [
    'solo', 'couple', 'family', 'friends', 'backpacking', 'adventure', 'luxury', 'cultural', 'business', 'girls trip',
    'guys trip',
    'pet-friendly',
    'multi-generational',
    'foodie',
    'historical',
    'wellness',
    'festival/event',
    'voluntourism',
    'educational',
    'ancestry/roots',
    'wildlife',
    'photography',
    'shopping',
    'pilgrimage/spiritual',
    'concert/music',
    'sports',
    'road trip',
    'workation',
    'hiking/trekking',
    'camping',
    'skiing/snowboarding',
    'diving/snorkeling',
    'surfing',
    'climbing/mountaineering',
    'cycling/bike touring',
    'kayaking/canoeing/rafting',
    'sailing/boating',
    'cruising',
    'motorcycle touring',
    'relaxation',
    'fast-paced',
    'slow travel',
    'off-the-beaten-path',
    'budget',
    'sustainable/eco-tourism',
    'glamping',
    'resort stay',
    'hostel hopping',
    'homestay',
    'cabin/lodge',
    'rv/campervan',
    'beach',
    'mountains',
    'city break',
    'desert',
    'island hopping',
    'lake',
    'jungle/rainforest',
    'arctic/antarctic', 'other'
]

export const TRANSPORTATION_TYPES = ['car', 'bus', 'train', 'flight', 'boat', 'bicycle', 'walking', 'other']

export const DEFAULT_LIST_SIZE = 10