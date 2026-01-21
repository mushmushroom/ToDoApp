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
    
    
  });

  it('task can be edited successfully and changes appear on the page', () => { 
    cy.get('button[title="Edit a task"]').click();
    cy.get('input[name="taskTitle"]').type('new task title');
    cy.contains('button', 'Save').click();
    cy.contains('The task has been updated.');
    cy.contains('new task title');
  })

  it("task marked as completed and have appropriate status", () => {
    cy.get('[type="checkbox"]').as('task');
    cy.get('@task').check();
    cy.get('@task').should('be.checked');
  })
  
  it("category is updated and displayed on the page", () => { 
    cy.visit('/categories');
    cy.contains('button', 'Add new category').click();
    cy.get('input[name="categoryTitle"]').type('Test category');
    cy.contains('button', 'Save').click();
    cy.visit('/my-tasks');
    cy.get('button[title="Edit a task"]').click();
    cy.findByRole('combobox').click();
    cy.findByRole('option', { name: 'Test category' }).click();
    cy.contains('button', 'Save').click();
    cy.contains('The task has been updated.');
    cy.contains('test task');
    cy.contains('Test category');
  })
  
  it('task title should contain at least 5 characters when editing', () => {
    cy.get('button[title="Edit a task"]').click();
    cy.get('input[name="taskTitle"]').type('new');
    cy.contains('The task should contain at least 5 characters');
  });
});
