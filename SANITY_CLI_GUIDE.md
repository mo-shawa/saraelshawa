# Sanity CLI Quick Reference

## Login to Sanity (required once)
npx sanity login
# Select "Google" and authenticate with the same account used to create the project

## Deploy the Sanity Studio
npx sanity deploy sanity

## Run Sanity Studio locally (for development)
cd sanity && npx sanity dev

## Alternative: Use npm scripts from root
npm run sanity:dev    # Run studio locally
npm run sanity:deploy # Deploy studio to Sanity hosting

## Common Issues

### Error: "sanity.cli.js does not contain a project identifier"
Solution: A root-level sanity.cli.js has been created. Commands should work from the root directory now.

### Error: "Package subpath './compiler-runtime' is not defined"
Solution: Sanity 5.x requires React 19, but we've downgraded to Sanity 3.x which works with React 18.

### Error: "Unauthorized - Session not found"
Solution: Run `npx sanity login` first to authenticate.

## Environment Variables
The following are configured in .env:
- SANITY_PROJECT_ID=7lwqqklw
- SANITY_DATASET=production
- SANITY_API_TOKEN=skKFXlRxphZNkbOLSOpfAsT0N2XkXcRuX8yEBNxkoV2oW9k6FEnR9Zd1Z7lc4NP59qir6vv4DTpF4NKjS8SfDKTp0D8i83XiyckmTF8XzAR5TqAKumpgSjaiJ4eWWQOVQioADPd4ckM1dD3Z6eSrRjjyWoXH5m8FR7drN2T8VmvnEfaqwswx

## Next Steps
1. Run: npx sanity login (select Google)
2. Run: npx sanity deploy sanity
3. Studio will be deployed to: https://saraelshawa.sanity.studio
4. (Optional) Configure custom domain: admin.saraelshawa.com
