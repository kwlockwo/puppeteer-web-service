const request = require('supertest');
const app = require('../server');
const { closeBrowser } = require('../puppeteer-service');

describe('Express Server API', () => {
  afterAll(async () => {
    await closeBrowser();
  });

  test('GET /api/health', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });

  test('POST /api/screenshot - success', async () => {
    const response = await request(app)
      .post('/api/screenshot')
      .send({ url: 'https://example.com', fullPage: true });
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body).toHaveProperty('screenshot');
  }, 15000);

  test('POST /api/screenshot - missing URL', async () => {
    const response = await request(app)
      .post('/api/screenshot')
      .send({});
    
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});
