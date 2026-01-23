describe('Add task flow', () => {
  beforeEach(() => {
    cy.task('deleteUser', 'test123@example.com');
    cy.task('createUser', {
      email: 'test123@example.com',
      password: '12345678',
    });
    cy.login('test123@example.com', '12345678');
    cy.visit('/my-tasks');
  });

  it('task title should contain at least 5 characters', () => {
    cy.contains('button', 'Add new task').click();
    cy.get('input[name="taskTitle"]').type('tes');
    cy.contains('The task should contain at least 5 characters');
    cy.contains('button', 'Save').should('be.disabled')
  });

  it('task can be created successfully and appears on the page', () => {
    cy.contains('button', 'Add new task').click();
    cy.get('input[name="taskTitle"]').type('test task');
    cy.contains('button', 'Save').click();
    cy.contains('The task has been added.');
    cy.contains('test task');
  });

  it('task can be created with correct category', () => {
    cy.visit('/categories');
    cy.contains('button', 'Add new category').click();
    cy.get('input[name="categoryTitle"]').type('Test category');
    cy.contains('button', 'Save').click();
    cy.visit('/my-tasks');
    cy.contains('button', 'Add new task').click();
    cy.get('input[name="taskTitle"]').type('test task');
    cy.findByRole('combobox').click();
    cy.findByRole('option', { name: 'Test category' }).click();
    cy.contains('button', 'Save').click();
    cy.contains('The task has been added.');
    cy.contains('test task');
    cy.contains('Test category');
  });

  it('Counter reflect the remaining character count as user types in the task title input', () => {
    cy.contains('button', 'Add new task').click();
    cy.get('input[name="taskTitle"]').type('12345');
    cy.contains(`5 / ${Cypress.env('CHAR_LIMIT')}`);
  });
  it('Add task dialog can be closed', () => {
    cy.contains('button', 'Add new task').click();
    cy.contains('button', 'Cancel').click();
    cy.contains('button', 'Cancel').should('not.exist');
    cy.contains('button', 'Save').should('not.exist');
  });
});
