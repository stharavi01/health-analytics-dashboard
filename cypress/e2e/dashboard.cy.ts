describe("Dashboard", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173");
  });

  it("loads the dashboard page", () => {
    cy.contains("Health Analytics Dashboard").should("be.visible");
  });

  it("displays navigation", () => {
    cy.get("nav").should("exist");
  });

  it("can navigate to countries page", () => {
    cy.contains("Countries").click();
    cy.url().should("include", "/countries");
  });
});
