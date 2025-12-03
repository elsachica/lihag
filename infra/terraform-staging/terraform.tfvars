# Configuration for k3s OpenStack deployment
key_pair_name = "" # The name of your key pair created in OpenStack
identity_file = ""      # The path to your private SSH key

# Optional: Customize these if needed
flavor_name = "c1-r2-d40"           # 2 cores, 2GB RAM, 10GB storage (default)
server_name = "k3s-server-lihag-staging"          # Name for the k3s server (default)
base_name = "assignment3-lihag-staging"           # Prefix for network resources (default)

# Unik subnet för staging-miljön (byt om det krockar med prod)
subnet_cidr = "192.168.4.0/24"     # CIDR for the internal network (default)


### LÄS NOGA ###
# NOTE: When you get your Cumulus/OpenStack account, check which subnets are already in use.
#       Update this value if needed to avoid conflicts with existing networks in your project/tenant.
#       Example: Use 192.168.X.0/24 or 10.X.X.0/24 if 192.168.4.0/24 is already taken.

