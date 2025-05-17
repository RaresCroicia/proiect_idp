# ArgoCD Setup Instructions

## 1. Install ArgoCD in your cluster
```bash
# Create the argocd namespace
kubectl create namespace argocd

# Install ArgoCD
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

## 2. Apply the ArgoCD configuration
```bash
# Apply the ArgoCD project and application manifests
kubectl apply -f k8s/argocd/
```

## 3. Get the ArgoCD admin password
```bash
# Retrieve the initial admin password
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
```

## 4. Access the ArgoCD UI
```bash
# Port-forward the ArgoCD server
kubectl port-forward svc/argocd-server -n argocd 8080:443
```

Then access the ArgoCD UI at https://localhost:8080 with:
- Username: `admin`
- Password: (the password from step 3)

## Additional Notes

### Update Repository URL
Before applying the configuration, make sure to update the `repoURL` in `k8s/argocd/application.yaml` with your actual Git repository URL:
```yaml
source:
  repoURL: https://github.com/your-username/Proiect_IDP.git  # Update this line
```

### Git Repository Access
- Ensure your Git repository is accessible to ArgoCD
- If using a private repository, configure Git credentials in ArgoCD

### Verify Installation
After installation, you can verify the ArgoCD pods are running:
```bash
kubectl get pods -n argocd
```

### Access ArgoCD CLI
To use the ArgoCD CLI:
```bash
# Install ArgoCD CLI (if not already installed)
brew install argocd  # For macOS
# or
sudo curl -sSL -o /usr/local/bin/argocd https://github.com/argoproj/argo-cd/releases/latest/download/argocd-linux-amd64
sudo chmod +x /usr/local/bin/argocd

# Login to ArgoCD
argocd login localhost:8080
``` 