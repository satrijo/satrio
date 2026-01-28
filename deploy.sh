#!/bin/bash

# Deployment script for satrio.dev
# Usage: ./deploy.sh [build|push|deploy|all]

set -e

# Configuration - Update these values
REGISTRY="${REGISTRY:-your-registry.com}"
IMAGE_NAME="${IMAGE_NAME:-satrio-dev}"
IMAGE_TAG="${IMAGE_TAG:-latest}"
FULL_IMAGE="${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

build_image() {
    log_info "Building Docker image: ${FULL_IMAGE}"
    docker build -t "${FULL_IMAGE}" .
    log_info "Build complete!"
}

push_image() {
    log_info "Pushing image to registry: ${FULL_IMAGE}"
    docker push "${FULL_IMAGE}"
    log_info "Push complete!"
}

deploy_k8s() {
    log_info "Deploying to Kubernetes..."
    
    # Update image in deployment
    log_info "Updating deployment with image: ${FULL_IMAGE}"
    
    # Apply all manifests using kustomize
    kubectl apply -k k8s/
    
    # Wait for rollout
    log_info "Waiting for rollout to complete..."
    kubectl rollout status deployment/satrio-dev -n satrio-dev --timeout=300s
    
    log_info "Deployment complete!"
}

update_secret() {
    if [ -z "$API_AI_KEY" ]; then
        log_error "API_AI_KEY environment variable is not set"
        exit 1
    fi
    
    log_info "Updating secret with API key..."
    kubectl create secret generic satrio-dev-secrets \
        --from-literal=API_AI_KEY="${API_AI_KEY}" \
        --namespace=satrio-dev \
        --dry-run=client -o yaml | kubectl apply -f -
    log_info "Secret updated!"
}

show_status() {
    log_info "Current deployment status:"
    kubectl get pods -n satrio-dev
    echo ""
    kubectl get svc -n satrio-dev
    echo ""
    kubectl get ingress -n satrio-dev
}

show_help() {
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  build       Build Docker image"
    echo "  push        Push image to registry"
    echo "  deploy      Deploy to Kubernetes"
    echo "  secret      Update API key secret (requires API_AI_KEY env var)"
    echo "  status      Show deployment status"
    echo "  all         Build, push, and deploy"
    echo ""
    echo "Environment variables:"
    echo "  REGISTRY    Container registry (default: your-registry.com)"
    echo "  IMAGE_NAME  Image name (default: satrio-dev)"
    echo "  IMAGE_TAG   Image tag (default: latest)"
    echo "  API_AI_KEY  API key for AI service (required for 'secret' command)"
}

case "${1:-help}" in
    build)
        build_image
        ;;
    push)
        push_image
        ;;
    deploy)
        deploy_k8s
        ;;
    secret)
        update_secret
        ;;
    status)
        show_status
        ;;
    all)
        build_image
        push_image
        deploy_k8s
        ;;
    help|*)
        show_help
        ;;
esac
