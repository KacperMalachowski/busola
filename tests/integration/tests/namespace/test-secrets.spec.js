const SECRET_NAME = `secret-${Math.floor(Math.random() * 9999) + 1000}`;

const SECRET_KEY = 'secret-key';
const SECRET_VALUE = 'secret-value';
const SECRET_VALUE2 = 'new-secret-value';

const SECRET2_KEY = 'secret2-key';
const SECRET2_VALUE = 'secret2-value';

const SECRET3_KEY = 'secret3-key';
const SECRET3_VALUE = 'secret3-value';

context('Test Secrets', () => {
  Cypress.skipAfterFail();

  before(() => {
    cy.loginAndSelectCluster();
    cy.goToNamespaceDetails();
  });

  it('Create a secret', () => {
    cy.navigateTo('Configuration', 'Secrets');

    cy.contains('ui5-button', 'Create Secret').click();

    cy.get('[aria-label="Secret name"]:visible')
      .find('input')
      .type(SECRET_NAME, { force: true });

    cy.get('[placeholder="Enter key"]:visible')
      .find('input')
      .type(`${SECRET_KEY}`);

    cy.get('[placeholder="Enter value"]:visible')
      .first()
      .type(`${SECRET_VALUE}`, { force: true });

    cy.get('[placeholder="Enter key"]:visible')
      .find('input')
      .last()
      .type(`${SECRET2_KEY}`);

    cy.get('[placeholder="Enter value"]:visible')
      .eq(1)
      .type(`${SECRET2_VALUE}`, { force: true });

    cy.contains('Encode')
      .filter(':visible')
      .click();

    cy.contains(btoa(SECRET_VALUE));

    cy.get('ui5-dialog')
      .contains('ui5-button', 'Create')
      .should('be.visible')
      .click();

    cy.url().should('match', new RegExp(`/secrets/${SECRET_NAME}$`));
  });

  it('Checking a secret details', () => {
    cy.contains(SECRET_NAME);

    cy.contains('.layout-panel-row', SECRET2_KEY).contains('*****');

    cy.contains('.layout-panel-row', SECRET_KEY).contains('*****');

    cy.contains('Decode').click();

    cy.contains('.layout-panel-row', SECRET2_KEY).contains(SECRET2_VALUE);

    cy.contains('.layout-panel-row', SECRET_KEY).contains(SECRET_VALUE);

    cy.contains('ui5-button', 'Encode').click();

    cy.contains('.layout-panel-row', SECRET2_KEY).contains(btoa(SECRET2_VALUE));

    cy.contains('.layout-panel-row', SECRET_KEY).contains(btoa(SECRET_VALUE));
  });

  it('Edit a secret', () => {
    cy.get('ui5-button')
      .contains('Edit')
      .should('be.visible')
      .click();

    cy.get('ui5-textarea[placeholder="Enter value"]:visible')
      .eq(0)
      .find('textarea')
      .click()
      .type(`{selectall}${SECRET_VALUE2}`);

    cy.get('[placeholder="Enter key"]:visible')
      .find('input')
      .eq(2)
      .type(`${SECRET3_KEY}`);

    cy.get('[placeholder="Enter value"]:visible')
      .eq(2)
      .type(`${SECRET3_VALUE}`, { force: true });

    cy.get('[aria-label="Delete"]:visible')
      .eq(1)
      .click();

    cy.get('ui5-dialog')
      .contains('ui5-button', 'Update')
      .should('be.visible')
      .click();
  });

  it('Checking an updated secret', () => {
    cy.wait(1000);

    cy.contains('ui5-button', 'Decode').click();

    cy.contains('.layout-panel-row', SECRET_KEY).contains(SECRET_VALUE2);

    cy.contains('.layout-panel-row', SECRET2_KEY).should('not.exist');

    cy.contains('.layout-panel-row', SECRET3_KEY).contains(SECRET3_VALUE);
  });

  it('Check list', () => {
    cy.inspectList('Secrets', SECRET_NAME);
  });
});
