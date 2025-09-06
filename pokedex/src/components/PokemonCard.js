import { Card, CardMedia, CardContent, Typography, Box } from "@mui/material";

export default function PokemonCard({ pokemon, onClick }) {
  return (
    <Card
      sx={{ width: 160, cursor: "pointer", borderRadius: 3, boxShadow: 3 }}
      onClick={onClick}
    >
      <CardMedia
        component="img"
        height="120"
        image={pokemon.sprites?.other["official-artwork"].front_default}
        alt={pokemon.name}
        sx={{ objectFit: "contain", p: 1 }}
      />
      <CardContent>
        <Typography
          variant="h6"
          align="center"
          sx={{ textTransform: "capitalize" }}
        >
          {pokemon.name}
        </Typography>
      </CardContent>
    </Card>
  );
}
