# Uni project (tRPC, Lucia)

This project is a scratch for the actual university project that I made. During development, a decision was made to remove separate database connection and store things in cookies & metadata in Clerk.dev which I have chosen to use outsourced auth instead to get rid of the database overhead.

tRPC was removed because there is actually not much need for it anymore, all calls will be made to Sanity.io CMS directly, and metadata needed to display some user content will be stored in Clerk.

Have a look at [the actual project](https://github.com/razenization/university-project) if you want to see the final result.
