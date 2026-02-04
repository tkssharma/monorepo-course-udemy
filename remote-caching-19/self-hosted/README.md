# Self-Hosted Remote Cache

## Overview
This directory contains configurations for self-hosting your own remote cache server, giving you full control over your build cache infrastructure.

## Options

### 1. Turborepo Remote Cache (Docker)

```bash
# Start the cache server
docker-compose up -d turbo-cache

# Configure your project
# Add to turbo.json or use CLI
export TURBO_API=http://localhost:3000
export TURBO_TOKEN=your-secret-token
export TURBO_TEAM=my-team
```

### 2. S3-Compatible Storage (MinIO)

```bash
# Start MinIO + cache server
docker-compose up -d

# Create the bucket (first time only)
docker exec -it minio mc mb local/turbo-cache
```

### 3. Configure in turbo.json

```json
{
  "remoteCache": {
    "enabled": true,
    "signature": true
  }
}
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `TURBO_API` | URL of your remote cache server |
| `TURBO_TOKEN` | Authentication token |
| `TURBO_TEAM` | Team identifier |
| `TURBO_REMOTE_CACHE_SIGNATURE_KEY` | For signed URLs (optional) |

## Production Considerations

1. **SSL/TLS**: Always use HTTPS in production
2. **Authentication**: Use strong, rotated tokens
3. **Storage**: Use durable storage (S3, GCS) for production
4. **Monitoring**: Set up metrics and alerting
5. **Backup**: Regular cache cleanup and backup strategy
