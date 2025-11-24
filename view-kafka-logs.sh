#!/bin/bash

# Script to view Kafka message flows for demo

echo "=== Kafka Message Flow Viewer ==="
echo ""
echo "This script shows live Kafka message flows from all services"
echo "Press Ctrl+C to stop"
echo ""
echo "Opening logs in separate sections..."
echo ""

# Function to show logs with color coding
show_logs() {
    local service=$1
    local namespace=$2
    local label=$3
    
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📡 $service - Kafka Messages"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    kubectl logs -f -l $label -n $namespace --tail=50 2>&1 | grep -i --line-buffered -E "kafka|booking|publish|consume|received|produced|topic" || echo "Waiting for $service to start..."
}

# Show all services in parallel using background processes
show_logs "Traveler Service (Producer)" "airbnb" "app=traveler-service" &
show_logs "Booking Service (Consumer)" "airbnb" "app=booking-service" &
show_logs "Owner Service (Status Consumer)" "airbnb" "app=owner-service" &

# Wait for all background jobs
wait

