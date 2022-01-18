/// <reference types="cypress" />
import contrato from '../contracts/produtos.contract'

describe('Teste da Funcionalidade Produto', () => {
    let token
    beforeEach(() => {
        cy.token('fulano@qa.com', 'teste').then(tkn => { token = tkn})
    });

    it.only('Deve validar contrato de produtos', () => {
   cy.request('produtos').then(response => {
       return contrato.validateAsync(response.body)
   })
    });
     
    it('Listar produtos', () => {
        cy.request({
            method: 'GET',
            url: 'produtos'
        }).then((response) =>{
            expect(response.body.produtos[9].nome).to.equal('MiA3 Black Piano2')
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('produtos')
            expect(response.duration).to.be.lessThan(15)
        })
    })

    it('Cadastrar produto', () => {
        let produto = `Rebelde ${Math.floor(Math.random() * 100000000)}`
        cy.request({
            method: 'POST',
            url: 'produtos',
            body: {
                "nome": produto,
                "preco": 470,
                "descricao": "Mexicano cantor",
                "quantidade": 6
              },
              headers: {authorization: token}  
          }).then((response) =>{
            expect(response.status).to.equal(201),
            expect(response.body.message).to.equal('Cadastro realizado com sucesso')
        })
    });

    it('Deve validar mensagem de erro ao cadastrar produto repetido', () => {
      cy.cadastrarProduto(token, "MiA3 Black Piano2", 899, "Aparelho Celular", 6)

        .then((response) =>{
            expect(response.status).to.equal(400),
            expect(response.body.message).to.equal('Já existe produto com esse nome')
        })

    }) 

    it('Editar Produto', () => {
        cy.request('produtos').then(response => {
           cy.log(response.body.produtos[1]._id)
           let id = response.body.produtos[1]._id
           cy.request({
               method: 'PUT',
               url: `produtos/${id}`,
               headers: {authorization: token},
               body:
                {
                "nome": "Rebelde 36752421",
                "preco": 119,
                "descricao": "Banda Latina",
                "quantidade": 7
              }
           }).then((response) =>{
            expect(response.status).to.equal(200),
            expect(response.body.message).to.equal('Registro alterado com sucesso')
        
           })
        })
    })

    it('Deve edittar produto cadastrado', () => {
        let produto = `Rebelde ${Math.floor(Math.random() * 100000000)}`
        cy.cadastrarProduto(token, produto, 899, "Aparelho Celular", 6)
        .then(response => {
             let id = response.body._id  
             cy.request({
                method: 'PUT',
                url: `produtos/${id}`,
                headers: {authorization: token},
                body:
                 {
                 "nome": produto,
                 "preco": 119,
                 "descricao": "Banda Latina",
                 "quantidade": 7
               }
            }).then((response) =>{
             expect(response.status).to.equal(200),
             expect(response.body.message).to.equal('Registro alterado com sucesso')
            })
        })
    });

    it('Deletar Produto cadastrado', () => {
        let produto = `Rebelde ${Math.floor(Math.random() * 100000000)}`
        cy.cadastrarProduto(token, produto, 899, "Aparelho Celular", 6)
        .then(response => {
            let id = response.body._id
            cy.request({
                method: 'DELETE',
                url: `produtos/${id}`,
                headers: {authorization: token}
            }).then(response => {
                expect(response.body.message).to.equal('Registro excluído com sucesso'),
                expect(response.status).to.equal(200)
            })
            
        })

    })
})