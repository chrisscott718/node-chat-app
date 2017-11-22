const expect = require('expect');

const {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', ()=>{
  it('should generate correct message object', () => {
    const from = 'Chris',
          text = 'Some message';

    const message = generateMessage(from, text);

    expect(typeof message.createdAt).toBe('number');
    expect(message).toMatchObject({from, text});
  });
});

describe('generageLocationMessage', () => {
  it('should generate correct location object', () => {
    const from = 'chris',
          lat = 123,
          lng = 1234,
          url = `https://www.google.com/maps?q=${lat},${lng}`;

    const message = generateLocationMessage(from, lat, lng);

    expect(typeof message.createdAt).toBe('number');
    expect(message).toMatchObject({from, url});
  });
});
