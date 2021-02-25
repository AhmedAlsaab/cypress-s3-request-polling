const neatCsv = require('neat-csv');

describe('Cypress S3 Demo', () => {
  it('Request polls S3 bucket, expects to find a file', () => {
    cy.requestPoll('cypress/demo-file.csv').then((result) => expect(result).to.eq('File found'));
  });

  it('Gets a file from S3 and validates the file data', () => {
    cy.getObjectFromS3('cypress/nasdaq-tickers.csv')
      .then((file) => neatCsv(file.Body))
      .then((data) => {
        data.forEach((row) => {
          expect(row.Symbol).to.not.be.empty;
          expect(row.Symbol).to.satisfy((x) => x.length < 10);
          expect(row['Last Sale']).to.have.string('$');
        });
      });
  });
});
