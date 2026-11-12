# APTCORE Api

Build w/ ❤️‍🔥

## ⚠️ Storage: uploaded files must live OUTSIDE the app

Uploaded files (logos, banners, hero images, etc.) are written to
`public/storage/`, which resolves relative to the **app root**. In production the
app runs from `build/`, so uploads land in `build/public/storage/`.

**`node ace build` wipes and regenerates the entire `build/` directory.** If
uploads live inside it, every deploy deletes every uploaded image. `public/storage`
is also gitignored, so uploads are never part of a deploy either.

The fix is to keep the real files in a persistent directory outside the app and
symlink them into the build output after each build.

### One-time setup on the server

```bash
# Persistent directory, outside the app so a build can never touch it
sudo mkdir -p /var/www/aptcore-storage
sudo chown -R tampines:tampines /var/www/aptcore-storage
```

### After EVERY build/deploy

```bash
# Replace the freshly-built (empty) storage dir with a symlink to the persistent one
rm -rf /var/www/aptcore/aptcore-api/build/public/storage
ln -sfn /var/www/aptcore-storage /var/www/aptcore/aptcore-api/build/public/storage
```

The symlink is recreated every deploy, but the actual files survive because they
never live inside `build/`.

> Long term, move uploads to object storage (e.g. DigitalOcean Spaces / S3) so
> files are fully decoupled from the server and survive droplet rebuilds too.

## Deploying

```bash
# 1. Pull the new code onto the server

# 2. Install deps + build
pnpm i
pnpm run build            # -> creates ./build

# 3. Production deps inside the build output
cd build
pnpm i --prod

# 4. Copy the server's .env into build/ (it is NOT copied automatically)
cp ../.env .

# 5. Re-link persistent storage (see the storage section above)
rm -rf public/storage
ln -sfn /var/www/aptcore-storage public/storage

# 6. Run pending migrations (--force is REQUIRED in production)
node ace migration:run --dry-run --force   # preview, writes nothing
node ace migration:run --force             # run for real

# 7. Restart the process (pm2 / systemd / etc.)
```

### Notes

- **Back up the database before migrating:**
  `mysqldump -u <user> -p <database> > backup-before-migrate.sql`
- Run migrations from `build/`, not the project root — the root needs dev deps.
- `--force` is mandatory in production; without it Adonis refuses to migrate.
