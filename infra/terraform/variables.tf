
variable "key_pair_name" {
  description = "The name of the key pair to put on the server"
  type        = string
}

variable "identity_file" {
  description = "The path to the private key to use for authentication"
  type        = string
}

variable "external_network_name" {
  description = "The name of the external network to be used"
  type        = string
  default     = "public"
}

variable "subnet_cidr" {
  description = "The CIDR block for the subnet"
  type        = string
  default     = "192.168.4.0/24"
}

variable "flavor_name" {
  description = "The name of the flavor to be used"
  type        = string
  default     = "c2-r2-d20"
}

variable "image_name" {
  description = "The name of the image to be used"
  type        = string
  default     = "Ubuntu server 24.04.3 autoupgrade"
}

variable "base_name" {
  type    = string
  default = "k3s"
}

variable "server_name" {
  description = "The name of the k3s server to create"
  type        = string
  default     = "k3s-server-deploy"
}

variable "server_name2" {
  description = "The name of the k3s server to create"
  type        = string
  default     = "k3s-server-staging"
}

locals {
  network_name  = "${var.base_name}-network"
  subnet_name   = "${var.base_name}-subnet"
  port_name     = "${var.base_name}-port"
  router_name   = "${var.base_name}-router"
  secgroup_name = "${var.base_name}-secgroup"
}

variable "worker_count" {
  description = "Number of k3s worker nodes to create"
  type        = number
  default     = 2
}

variable "worker_name_prefix" {
  description = "Prefix for k3s worker node names"
  type        = string
  default     = "k3s-worker-"
}

variable "worker_port_prefix" {
  description = "Prefix for k3s worker node port names"
  type        = string
  default     = "k3s-worker-port-"
  
}

variable "ansible_files_relative_path" {
  type = string
  default = "../ansible"
}