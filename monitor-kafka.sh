#!/bin/bash

# Kafka Message Flow Monitoring Script
# Run this in a terminal to see all Kafka-related logs

echo "=== Kafka & Zookeeper Status ==="
kubectl get pods -n kafka

echo -e "\n=== Kafka Topics ==="
kubectl exec -it kafka-0 -n kafka -- kafka-topics --bootstrap-server localhost:9092 --list 2>/dev/null || echo "Topics not available yet"

echo -e "\n=== Recent Kafka Messages (last 20) ==="
echo "Traveler Service (Producer):"
kubectl logs -l app=traveler-service -n airbnb --tail=20 | grep -i "kafka\|booking.*publish\|published" || echo "No recent messages"

echo -e "\nBooking Service (Consumer):"
kubectl logs -l app=booking-service -n airbnb --tail=20 | grep -i "kafka\|booking.*consume\|received\|processing" || echo "No recent messages"

echo -e "\nOwner Service (Status Consumer):"
kubectl logs -l app=owner-service -n airbnb --tail=20 | grep -i "kafka\|status.*update\|consume" || echo "No recent messages"

