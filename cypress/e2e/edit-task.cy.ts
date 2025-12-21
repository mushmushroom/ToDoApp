describe('Edit task flow', () => {
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
    cy.get('button[title="Edit a task"]').click();
    
  });

  it('task can be edited successfully and changes appear on the page', () => { 
    cy.get('input[name="taskTitle"]').type('new task title');
    cy.contains('button', 'Save').click();
    cy.contains('The task has been updated.');
    cy.contains('new task title');
  })
  it('task title should contain at least 5 characters when editing', () => {
    cy.get('input[name="taskTitle"]').type('new');
    cy.contains('The task should contain at least 5 characters');
  });
});
