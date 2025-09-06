import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Chip,
  Button,
  Tabs,
  Tab,
  Divider,
  LinearProgress,
} from "@mui/material";
import api from "../api";

export default function PokemonDetail() {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [tab, setTab] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await api.get(`pokemon/${id}`);
        setPokemon(res.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, [id]);

  if (!pokemon) return <Typography>Loading…</Typography>;

  return (
    <Container sx={{ mt: 3 }}>
      <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        ← Back
      </Button>

      <Box
        sx={{
          bgcolor: "#f5f5f5",
          borderRadius: 3,
          p: 3,
          textAlign: "center",
          mb: 3,
        }}
      >
        <img
          src={pokemon.sprites.other["official-artwork"].front_default}
          alt={pokemon.name}
          width="180"
          height="180"
        />
        <Typography variant="h4" fontWeight="bold" textTransform="capitalize">
          {pokemon.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          #{pokemon.id.toString().padStart(3, "0")}
        </Typography>
        <Box sx={{ mt: 1 }}>
          {pokemon.types.map((t) => (
            <Chip
              key={t.type.name}
              label={t.type.name}
              sx={{ mr: 1, textTransform: "capitalize" }}
              color="primary"
              variant="outlined"
            />
          ))}
        </Box>
      </Box>

      <Tabs value={tab} onChange={(e, val) => setTab(val)} centered>
        <Tab label="About" />
        <Tab label="Base Stats" />
        <Tab label="Moves" />
      </Tabs>
      <Divider sx={{ mb: 2 }} />

      {tab === 0 && (
        <Box>
          <Typography>
            <b>Height:</b> {(pokemon.height / 10).toFixed(1)} m
          </Typography>
          <Typography>
            <b>Weight:</b> {(pokemon.weight / 10).toFixed(1)} kg
          </Typography>
          <Typography>
            <b>Abilities:</b>{" "}
            {pokemon.abilities.map((a) => a.ability.name).join(", ")}
          </Typography>
        </Box>
      )}

      {tab === 1 && (
        <Box>
          {pokemon.stats.map((s) => (
            <Box key={s.stat.name} sx={{ mb: 1 }}>
              <Typography textTransform="capitalize">
                {s.stat.name}: {s.base_stat}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={Math.min(s.base_stat, 100)}
                sx={{ height: 8, borderRadius: 5 }}
              />
            </Box>
          ))}
        </Box>
      )}

      {tab === 2 && (
        <Box>
          {pokemon.moves.slice(0, 10).map((m) => (
            <Chip
              key={m.move.name}
              label={m.move.name}
              sx={{ m: 0.5, textTransform: "capitalize" }}
            />
          ))}
        </Box>
      )}
    </Container>
  );
}
