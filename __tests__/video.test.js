const app = require('../app'),
	request = require('supertest'),
	httpCodes = require('http-status-codes')

describe("App Test", () => {
	it("Getting main page", async () => {
		res = await request(app).get("/")
		expect(res.status).toBe(httpCodes.StatusCodes.OK)
	})

	it("Requesting a not existing video", async () => {
		res = await request(app).get('/video/notfoundvideo')
		expect(res.status).toBe(httpCodes.StatusCodes.NOT_FOUND)
	})

	it("Requesting a video without right headers", async () => {
		res = await request(app).get('/video/bakamitai')
		expect(res.status).toBe(httpCodes.StatusCodes.BAD_REQUEST)
	})

	afterAll(async () => {
		app.close()
	})
})
