output "k3s_server" {
  description = "k3s server details"
  value = {
    name        = openstack_compute_instance_v2.k3s_server.name
    internal_ip = openstack_compute_instance_v2.k3s_server.access_ip_v4
    external_ip = openstack_networking_floatingip_v2.k3s_floatingip.address
  }
}

output "ssh_command" {
  description = "SSH command to connect to the k3s server"
  value       = "ssh -i ${var.identity_file} ubuntu@${openstack_networking_floatingip_v2.k3s_floatingip.address}"
}

output "ansible_inventory_info" {
  description = "All server information needed for Ansible inventory"
  value = {
    server = {
      public_ip  = openstack_networking_floatingip_v2.k3s_floatingip.address
      private_ip = openstack_networking_port_v2.k3s_port.fixed_ip[0].ip_address
    }
  }
}

output "public_ips" {
  description = "Map of server name => public IP address for all created servers"
  value = {
    "${openstack_compute_instance_v2.k3s_server.name}"  = openstack_networking_floatingip_v2.k3s_floatingip.address
    "${openstack_compute_instance_v2.k3s_server2.name}" = openstack_networking_floatingip_v2.k3s_server2_floatingip.address
  }
}

