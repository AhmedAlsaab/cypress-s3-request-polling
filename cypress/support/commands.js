const awsCommands = require('./aws-helper-commands');

Cypress.Commands.add('listS3Objects', awsCommands.listS3Objects);
Cypress.Commands.add('requestPoll', awsCommands.requestPoll);
Cypress.Commands.add('getObjectFromS3', awsCommands.getObjectFromS3);
