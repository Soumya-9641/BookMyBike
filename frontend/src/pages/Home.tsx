import Hero from "../components/Hero";
import SearchPanel from "../components/SearchPanel";
import HowItWorks from "../components/HowItWorks";
import ExploreBikes from "../components/ExploreBikes";
import { Box, Stack } from "@mui/material";

const Home = () => {
  return (
    <>
      <Hero />

      <Box bgcolor="#fff" py={6}>
        <Box maxWidth="lg" mx="auto" px={2}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={6}
            alignItems="flex-start"
          >
            <SearchPanel />
            <HowItWorks />
          </Stack>
        </Box>
      </Box>


      <ExploreBikes />
    </>
  );
};

export default Home;
