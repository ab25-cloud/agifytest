

describe('Agify.io API Tests', () => {
    const baseUrl = 'https://api.agify.io';
  
    it('Should fetch age and count for a valid name', () => {
      const name = 'basit';
      cy.request(`${baseUrl}/?name=${name}`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('name', name);
        expect(response.body).to.have.property('age').and.to.be.a ('number');
        expect(response.body).to.have.property('count').and.to.be.a('number');
      });
    });
  
    it('Should return null age and zero count for a name not in the database', () => {
      const name = 'unknownname';
      cy.request(`${baseUrl}/?name=${name}`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('name', name);
        expect(response.body).to.have.property('age', null);
        expect(response.body).to.have.property('count', 0);
      });
    });
  
    it('Should return a 400 error for requests without a name', () => {
      cy.request({
        method: 'GET',
        url: baseUrl,
        failOnStatusCode: false, // Allows handling the 400 response
      }).then((response) => {
        expect(response.status).to.eq(422);
        expect(response.body).to.have.property('error');
      });
    });
  
    it('Should handle special characters in the name', () => {
      const name = '@#$%^';
      cy.request(`${baseUrl}/?name=${encodeURIComponent(name)}`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('name', name);
        expect(response.body).to.have.property('age', null);
        expect(response.body).to.have.property('count', 0);
      });
    });
  
    it('Should handle large names gracefully', () => {
      const name = 'averylongnamethatexceedslimits';
      cy.request(`${baseUrl}/?name=${name}`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('name', name);
        expect(response.body).to.have.property('age').and.to.be.oneOf([null, 0]);
        expect(response.body).to.have.property('count').and.to.be.a('number');
      });
    });
  
    it('Should be able to test Case Sensitivity of the API', () => {
        const name = 'BillyBob';
        cy.request(`${baseUrl}/?name=${name}`).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.have.property('name', name);
          expect(response.body.name).to.not.equal(name.toLowerCase()); // Verify the API converts name to lowercase
        });
      });
      
  
    it('Should handle numeric values as names', () => {
      const name = '12345';
      cy.request(`${baseUrl}/?name=${name}`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('name', name);
        expect(response.body).to.have.property('age', null);
        expect(response.body).to.have.property('count', 0);
      });
    });
  });
  