import { useEffect, useState, useCallback, useRef } from "react";
import api from "../api";
import PokemonList from "../components/PokemonList";
import { Container, Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";

export default function Home() {
  const [pokemons, setPokemons] = useState([]);
  const [nextUrl, setNextUrl] = useState("pokemon?limit=24");
  const [loading, setLoading] = useState(false);

  const [hasMore, setHasMore] = useState(false);
  const [useLoadMoreFallback, setUseLoadMoreFallback] = useState(true);

  const navigate = useNavigate();
  const scrollableRef = useRef(null);

  const checkScrollable = (next) => {
    const el = scrollableRef.current;
    if (!el) {
      setUseLoadMoreFallback(true);
      setHasMore(false);
      return;
    }

    const buffer = 20;
    if (el.scrollHeight > el.clientHeight + buffer) {
      setUseLoadMoreFallback(false);
      setHasMore(!!next);
    } else {
      setUseLoadMoreFallback(true);
      setHasMore(false);
    }
  };

  const loadMorePokemons = useCallback(async () => {
    if (loading || !nextUrl) return;
    setLoading(true);

    try {
      const res = await api.get(nextUrl);
      const next =
        res.data.next?.replace("https://pokeapi.co/api/v2/", "") || null;

      const detailed = await Promise.all(
        res.data.results.map(async (p) => {
          const d = await api.get(p.url);
          return d.data;
        })
      );

      setPokemons((prev) => [...prev, ...detailed]);
      setNextUrl(next);

      setTimeout(() => checkScrollable(next), 50);
    } catch (err) {
      console.error("Failed to load pokemons:", err);
      setHasMore(false);
      setUseLoadMoreFallback(true);
    } finally {
      setLoading(false);
    }
  }, [loading, nextUrl]);

  useEffect(() => {
    loadMorePokemons();
  }, []);

  return (
    <Container sx={{ mt: 4, pb: 6 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Pokedex
      </Typography>

      <Box
        id="scrollableDiv"
        ref={scrollableRef}
        sx={{
          height: "80vh",
          overflow: "auto",
          pr: 1,
          borderRadius: 1,
        }}
      >
        <InfiniteScroll
          dataLength={pokemons.length}
          next={loadMorePokemons}
          hasMore={hasMore}
          loader={
            <Typography align="center" sx={{ my: 2 }}>
              Loading…
            </Typography>
          }
          endMessage={
            <Typography align="center" sx={{ my: 2 }}>
              You’ve reached the end.
            </Typography>
          }
          scrollableTarget="scrollableDiv"
          scrollThreshold={0.95}
          style={{ overflow: "visible" }}
        >
          <PokemonList
            pokemons={pokemons}
            onSelect={(pokemon) => navigate(`/pokemon/${pokemon.id}`)}
          />
        </InfiniteScroll>
      </Box>

      {useLoadMoreFallback && nextUrl && (
        <Box textAlign="center" mt={2}>
          <Button
            variant="contained"
            onClick={() => {
              loadMorePokemons();
            }}
            disabled={loading}
          >
            {loading ? "Loading…" : "Load more"}
          </Button>
        </Box>
      )}
    </Container>
  );
}
