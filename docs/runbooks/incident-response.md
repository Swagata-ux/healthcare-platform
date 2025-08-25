# Incident Response Runbook

## Severity Levels

### P0 - Critical
- Complete service outage
- Data breach or security incident
- Patient safety impact

### P1 - High
- Major feature unavailable
- Performance degradation >50%
- Authentication issues

### P2 - Medium
- Minor feature issues
- Performance degradation <50%
- Non-critical bugs

### P3 - Low
- Cosmetic issues
- Enhancement requests

## Response Procedures

### P0/P1 Incident Response

1. **Immediate Actions (0-5 minutes)**
   ```bash
   # Check system status
   kubectl get pods -n healthcare-prod
   kubectl get services -n healthcare-prod
   
   # Check logs
   kubectl logs -f deployment/api-gateway -n healthcare-prod
   ```

2. **Assessment (5-15 minutes)**
   - Identify affected services
   - Estimate user impact
   - Check monitoring dashboards
   - Review recent deployments

3. **Communication (15 minutes)**
   - Update status page
   - Notify stakeholders
   - Create incident channel

4. **Mitigation**
   ```bash
   # Rollback deployment if needed
   helm rollback healthcare-platform -n healthcare-prod
   
   # Scale up resources
   kubectl scale deployment api-gateway --replicas=5 -n healthcare-prod
   
   # Check database connections
   kubectl exec -it deployment/api-gateway -n healthcare-prod -- npm run db:check
   ```

## Common Issues

### Database Connection Issues
```bash
# Check RDS status
aws rds describe-db-instances --db-instance-identifier healthcare-prod

# Check connection pool
kubectl logs deployment/api-gateway -n healthcare-prod | grep "connection"

# Restart service
kubectl rollout restart deployment/api-gateway -n healthcare-prod
```

### High Memory Usage
```bash
# Check memory usage
kubectl top pods -n healthcare-prod

# Check for memory leaks
kubectl exec -it deployment/api-gateway -n healthcare-prod -- node --inspect

# Scale horizontally
kubectl scale deployment api-gateway --replicas=10 -n healthcare-prod
```

### Redis Cache Issues
```bash
# Check Redis status
aws elasticache describe-cache-clusters --cache-cluster-id healthcare-prod-redis

# Clear cache if needed
kubectl exec -it deployment/api-gateway -n healthcare-prod -- redis-cli FLUSHALL
```

## Recovery Procedures

### Database Recovery
```bash
# Restore from backup
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier healthcare-prod-restored \
  --db-snapshot-identifier healthcare-prod-snapshot-latest

# Update connection strings
kubectl patch secret healthcare-db-secret -n healthcare-prod \
  --patch='{"data":{"DATABASE_URL":"<new-encoded-url>"}}'
```

### Complete Service Recovery
```bash
# Deploy from known good state
helm upgrade healthcare-platform ./infra/helm/healthcare-platform \
  --namespace healthcare-prod \
  --set image.tag=<last-known-good-tag>

# Verify health
kubectl get pods -n healthcare-prod
curl -f https://api.healthcare-platform.com/health
```

## Post-Incident

1. **Resolution Verification**
   - All services healthy
   - Performance metrics normal
   - User functionality restored

2. **Communication**
   - Update status page
   - Notify stakeholders
   - Close incident channel

3. **Post-Mortem**
   - Schedule within 24 hours
   - Document timeline
   - Identify root cause
   - Create action items

## Contacts

- **On-Call Engineer**: +1-555-0123
- **Engineering Manager**: +1-555-0124
- **DevOps Lead**: +1-555-0125
- **Security Team**: security@healthcare-platform.com