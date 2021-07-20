const express = require('express'),
	httpCodes = require('http-status-codes'),
	path = require('path'),
	fs = require('fs')
	router = express.Router()

const VIDEO_NAMES = new Set(['bakamitai'])
/**
 * Checks if a video exists by its name
 * @param {String} name the name of a video
 * @returns Boolean true if the video exists
 */
function isVideo(name){ return VIDEO_NAMES.has(name) }

const VIDEOS_PATH = path.join(path.dirname(__dirname), 'resources', 'videos')
/**
 * Gets the absolute path of a video by its name
 * @param {String} name a video name
 * @returns String the absolute path of a video
 */
function videoPath(name){ return path.join(VIDEOS_PATH, name + '.mp4') }

//Size of the packet is gonna be send
CHUNK = 10 ** 6
/**
 * Calculates the video range based on a video
 * @param {String} videoPath the absolute path of a video
 * @param {Range} range extracted of a request header
 * @returns Object{star, end} containing byte point of parsed video range
 */
function parseRange(videoPath, range)
{
	const size = fs.statSync(videoPath).size;
	const start = Number(range.replace(/\D/g, ""));
	const end = Math.min(start + CHUNK, size - 1);
	return {start: start, end: end, size: size}
}

//This route tells express that whenever a user requests a video with
//the GET method and passes something after /video/SOMETHING, 
//and in this case, something is named as "name", then 
//when accessing req.params.name it returns the value passed by the user into the url
router.get('/video/:name', (req, res) => {
	videoname = req.params.name
	if (isVideo(videoname))
	{
		//Takes the position of the video
		const range = req.headers.range;
		if(!range) //== if(range != undefined)
			//Sends a response containing an error if not defined
			//http-status-codes is a readable way to send a server response code to client
			res.status(httpCodes.StatusCodes.BAD_REQUEST).send(httpCodes.ReasonPhrases.BAD_REQUEST)

		//Gets the video path and parses the received range
		const videoP = videoPath("bakamitai")
		parsedRange = parseRange(videoP, range)
		start = parsedRange.start
		end = parsedRange.end

		//Tells client it is going to receive partial data
		res.writeHead(httpCodes.StatusCodes.PARTIAL_CONTENT, {
			"Content-Range": `bytes ${start}-${end}/${parsedRange.size}`,
			"Accept-Ranges": "bytes",
			"Content-Length": end - start + 1,
			"Content-Type": "video/mp4",
		})

		//Starts the stream
		const stream = fs.createReadStream(videoP, {start, end})
		stream.pipe(res)
	}
	else
		//Answers the video wasn't found
		res.status(httpCodes.StatusCodes.NOT_FOUND).send(httpCodes.ReasonPhrases.NOT_FOUND)
})

module.exports = router