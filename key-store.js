/**
 * @fileoverview Template for API key store.
 */


API = {
    youtube: {
        name: 'youtube',
        description: 'Search YouTube video, channel, or playlist',
        docs: 'https://developers.google.com/youtube/v3/docs/search',
        endpoint: 'https://www.googleapis.com/youtube/v3/search',
        // endpoint: 'https://gdata.youtube.com/feeds/api/videos', // v2
        token: 'AIzaSyByzmXBDIKlfsOnvIvum_BdKvZrHgz8k0Y' // kyaw (project: ydn-dev 968361937576)
    }, googleImage: {
        name: 'googleImage',
        description: 'Google image search',
        docs: 'https://developers.google.com/custom-search/json-api/v1/using_rest',
        endpoint: 'https://www.googleapis.com/customsearch/v1',
        token: 'AIzaSyByzmXBDIKlfsOnvIvum_BdKvZrHgz8k0Y'
    }, vimeo: {
        name: 'vimeo',
        description: 'Search Vimeo video',
        docs: 'https://developer.vimeo.com/api/start',
        endpoint: 'https://api.vimeo.com/videos',
        token: 'f06f8bdb092237014c0101250acb7f3d'
    }, twitch: {
        name: 'twitch',
        description: 'Search Twitch stream',
        docs: 'https://github.com/justintv/Twitch-API/blob/master/v3_resources/search.md',
        endpoint: 'https://api.twitch.tv/kraken/search/streams'
    },
    flickr: {
        name: 'flickr',
        description: 'Search Flickr',
        docs: 'https://www.flickr.com/services/api/',
        endpoint: 'https://api.flickr.com/services/rest',
        token: 'ccb1ac04bb795754a759a78dcad3d0af',
        secret: '3f284635ac9a2d25'
    },
    spotify: {
        name: 'spotify',
        description: 'Music, meet code. Powerful APIs, SDKs and widgets for simple and advanced applications',
        docs: 'https://developer.spotify.com/web-api/search-item/',
        endpoint: 'https://api.spotify.com/v1/search'
    },
    apple: {
        name: 'apple',
        description: 'Music, meet code. Powerful APIs, SDKs and widgets for simple and advanced applications',
        docs: 'https://www.apple.com/itunes/affiliates/resources/documentation/itunes-store-web-service-search-api.html',
        endpoint: 'https://itunes.apple.com/search'
    },
    instagram: {
        name: 'instagram',
        description: 'Search recent photo in instagram by tags and user',
        docs: 'https://instagram.com/developer/endpoints/tags/',
        access_token: '2084819461.1d19893.9fa09c4ddf104839ac459a87b1a410be', // retrieve from demo app
        token: 'ccb1ac04bb795754a759a78dcad3d0af', // kyawtun@yathit.com for http://localhost:3000
        secret: 'ca1f70a5027c461285340095bee9849b',
        redirectUri: 'http://localhost:3000/instagram-access-token-refresher.html',
        endpoints: ['https://api.instagram.com/v1/tags/search', 'https://api.instagram.com/v1/users/search']
    }
};



