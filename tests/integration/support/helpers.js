export function chooseComboboxOption(selector, optionText) {
  cy.get(`ui5-combobox${selector}`)
    .find('input')
    .filterWithNoValue()
    .click()
    .type(optionText);

  cy.get('ui5-li:visible')
    .contains(optionText)
    .find('li')
    .click({ force: true });

  return cy.end();
}
