import Badges from './Badges.vue'

describe('<Badges />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-vue
    cy.mount(Badges)
  })
})