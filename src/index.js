import { AwsClient } from 'aws4fetch'

const aws = new AwsClient({
	"accessKeyId": AWS_ACCESS_KEY_ID,
	"secretAccessKey": AWS_SECRET_ACCESS_KEY,
	"region": AWS_DEFAULT_REGION
});

addEventListener('fetch', function (event) {
	event.respondWith(handleRequest(event.request))
});

async function handleRequest(request) {
	let url = new URL(request.url);
	url.hostname = AWS_S3_BUCKET;
	let signedRequest = await aws.sign(url);
	let range = request.headers.get('range');
	if (range) {
		signedRequest.headers.set('range', range);
	}
	if (url.pathname === '/' || url.pathname === '') {
		return new Response('Not Found', { status: 404 });
	}
	return await fetch(signedRequest, { "cf": { "cacheEverything": true } });
}
