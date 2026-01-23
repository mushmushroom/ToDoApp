describe('Delete task flow', () => {
  beforeEach(() => {
    cy.task('deleteUser', 'test123@example.com');
    cy.task('createUser', {
      email: 'test123@example.com',
      password: '12345678',
    });
    cy.login('test123@example.com', '12345678');
    cy.visit('/my-tasks');
    cy.contains('button', 'Add new task').click();
    cy.get('input[name="taskTitle"]').type('test task');
    cy.contains('button', 'Save').click();
    cy.contains('The task has been added.');
    cy.contains('test task');
    cy.get('button[title="Delete a task"]').click();
  });

  it('Delete task removes task from the page', () => {
    cy.get('button').contains('Delete').click();
    cy.contains('The task has been deleted.');
    cy.contains('test task').should('not.exist');
  });

  it('Delete task dialog can be closed', () => {
    it('Delete task removes task from the page', () => {
      cy.get('button').contains('Cancel').click();
      cy.contains('test task');
      cy.contains('button', 'Delete').should('not.exist');
      cy.contains('button', 'Cancel').should('not.exist');
    });
  });
});
