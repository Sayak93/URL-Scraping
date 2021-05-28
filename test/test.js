const { expect } = require('chai');
const model = require('../scrape/model');

describe('Scrape OG Tags', () => {
    describe('Test Validate Function', () => {
        it('Invalid URI', () => {
            expect(model.validURL('testUrl')).to.be.false;
        })

        it('valid URI', () => {
            expect(model.validURL('http://www.google.com')).to.be.true;
        })
    });

    describe('Test Fetch HTML', () => {
        it('Invalid Url', () => {
            model.fetchHtml('test').catch((err) => {
                expect(err.success).to.be.false;
            })
        });

        it('Valid URL to fetch html', () => {
            model.fetchHtml('https://www.google.com').then((res) => {
                expect(res.success).to.be.true;
            })
        });
    });

    describe('Scrap Meta Tag', () => {
        it('Returns success false', () => {
            model.scrapeMetaTag('').then((response) => {
                expect(response.success).to.be.false;
            })
        });

        it('Returns og data', () => {
            const html = `
                <html><meta property="og:type" content="website"></html>
            `;
            model.scrapeMetaTag(html).then((response) => {
                expect(response.success).to.be.true;
            })
        });
    })
})
