import type { NextConfig } from "next";

const repositoryName = "dictionary-next";
const isGithubPagesBuild = process.env.GITHUB_PAGES === "true";

const githubPagesConfig: NextConfig = isGithubPagesBuild
  ? {
      assetPrefix: `/${repositoryName}/`,
      basePath: `/${repositoryName}`,
      output: "export",
      trailingSlash: true,
    }
  : {};

const nextConfig: NextConfig = {
  ...githubPagesConfig,
  images: {
    unoptimized: isGithubPagesBuild,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "21495103.hs-sites.com",
      },
    ],
  },
};

export default nextConfig;
