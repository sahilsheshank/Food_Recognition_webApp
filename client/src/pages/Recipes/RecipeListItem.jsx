import React from 'react'
import {
    CardMeta,
    CardHeader,
    CardDescription,
    CardContent,
    Button,
    Card,
    Icon,
    Image,
  } from 'semantic-ui-react'
  import {Link} from 'react-router-dom'
function RecipeListItem({recipe,key}) {

  return (
   <Card className='flex flex-col justify-center items-center ' >
        <Image src={recipe.image_url} className='w-full h-52'/>
        <CardHeader><h3>{recipe.title}</h3></CardHeader>
        <CardDescription>By {recipe.publisher}</CardDescription>
        <Button><Link to={recipe.source_url}>Get Recipe</Link></Button>
   </Card>
  )
}

export default RecipeListItem
