#!/bin/bash

# Kafka & Zookeeper Status Monitor
# Run this script and it will refresh every 2 seconds

while true; do
  clear
  echo "=== Kafka & Zookeeper Status ==="
  echo "$(date '+%Y-%m-%d %H:%M:%S')"
  echo ""
  kubectl get pods -n kafka
  echo ""
  echo "=== Kafka Topics ==="
  kubectl exec -it kafka-0 -n kafka -- kafka-topics --bootstrap-server localhost:9092 --list 2>/dev/null || echo "Topics not available yet"
  echo ""
  echo "Press Ctrl+C to stop"
  sleep 2
done

