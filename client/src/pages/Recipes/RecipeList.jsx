import React from 'react'
import { Container, Grid, Header } from 'semantic-ui-react'
import RecipeListItem from './RecipeListItem'
function RecipeList({ recipes, query }) {

    return (
        <Container>
            <Header

                size="huge"

                textAlign='center'

            />
            <Grid columns={3} doubling>
                {

                    recipes && recipes.map(recipe => (
                        <Grid.Column>
                            <RecipeListItem recipe={recipe} />

                        </Grid.Column>
                    ))

                }
            </Grid>
        </Container>
    )
}

export default RecipeList
