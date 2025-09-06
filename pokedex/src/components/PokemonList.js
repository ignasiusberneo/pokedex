import { Grid } from "@mui/material";
import PokemonCard from "./PokemonCard";

export default function PokemonList({ pokemons, onSelect }) {
  return (
    <Grid container spacing={2} justifyContent="center">
      {pokemons.map((p) => (
        <Grid item key={p.name}>
          <PokemonCard pokemon={p} onClick={() => onSelect(p)} />
        </Grid>
      ))}
    </Grid>
  );
}
