import { Box, Typography } from "@mui/material";

const CookiePolicy = () => {
  return (
    <Box maxWidth="lg" mx="auto" py={6} px={2}>
      <Typography variant="h4" mb={3}>
        Cookie Policy
      </Typography>

      <Typography paragraph>
        We use cookies to improve your browsing experience, remember your
        preferences, provide secure authentication, and analyze website traffic.
      </Typography>

      <Typography paragraph>
        Essential cookies are required for the website to function properly.
        Optional analytics cookies help us improve our services.
      </Typography>

      <Typography paragraph>
        You can accept or reject optional cookies at any time by clearing your
        browser cookies and revisiting the website.
      </Typography>
    </Box>
  );
};

export default CookiePolicy;