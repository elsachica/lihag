# Build and deploy on server

### 1. Configure Variables
Edit `terraform.tfvars` to match your environment:  
```
key_pair_name = "your-key-pair-name"  
identity_file = "~/.ssh/your-private-key"
```

### 2. Configure OpenStack Provider  

source the rc file

### 3. Deploy Infrastructure  
```
# Initialize Terraform
terraform init

# Plan the deployment
terraform plan

# Apply the configuration (creates VM with minimal setup)
terraform apply -auto-approve
````
### 4. Deploy k3s with Ansible
````
# Configure Ansible inventory
cd ../ansible
cp inventory.ini.template inventory.ini
# Edit inventory.ini with your server IP from Terraform output

# Run Ansible deployment
ansible-playbook -i inventory.ini deploy-k3s.yml
`````

### 5. Get Connection Details
After deployment, Terraform will output:

Server details (name, internal IP, external IP)
SSH command to connect

After Ansible deployment completes, you'll have:

k3s cluster running
Prometheus accessible at http://<external-ip>:30091


Example output:
```
k3s_server = {
  "external_ip" = "203.0.113.10"
  "internal_ip" = "192.168.4.100"
  "name" = "k3s-server"
}
ssh_command = "ssh -i ~/.ssh/id_rsa ubuntu@203.0.113.10"
`````

### 6. Deploy on server
Run pipeline to deploy on server.