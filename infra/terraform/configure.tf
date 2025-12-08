resource "local_file" "ansible_inventory"{
  content = templatefile("${path.module}/templates/inventory.ini.template", {
    K3S_SERVER_IP       = openstack_networking_floatingip_v2.k3s_floatingip.address,
    K3S_SERVER2_IP      = openstack_networking_floatingip_v2.k3s_server2_floatingip.address,
    TF_VAR_identity_file = var.identity_file,
    K3S_SERVER_NAME     = var.server_name,
    K3S_SERVER2_NAME    = var.server_name2,
  })
  filename = "../ansible/inventory-generated"
}


resource "null_resource" "wait_ssh" {

  connection {
    type        = "ssh"
    user        = "ubuntu"
    private_key = file(var.identity_file)
    host        = openstack_networking_floatingip_v2.k3s_floatingip.address
  }
  provisioner "remote-exec" {
    inline = [
      "echo hello from `hostname`"
    ]
  }
  triggers = {
    always_run = timestamp()
  }
  depends_on = [
    openstack_networking_floatingip_associate_v2.k3s_floatingip_association,
    openstack_networking_router_interface_v2.router_interface
  ]
}

resource "null_resource" "wait_ssh_server2" {
  connection {
    type = "ssh"
    user = "ubuntu"
    private_key = file(var.identity_file)
    host = openstack_networking_floatingip_v2.k3s_server2_floatingip.address
  }
  provisioner "remote-exec" {
    inline = ["echo hello"]
  }
  triggers = { always = timestamp() }
}


resource "null_resource" "ansible-deploy" {

  depends_on = [
    openstack_networking_floatingip_associate_v2.k3s_floatingip_association,
    openstack_compute_instance_v2.k3s_server,
    null_resource.wait_ssh,
    null_resource.wait_ssh_server2
  ]

  triggers = {
    always_run = timestamp()
  }
  provisioner "local-exec" {
    command = "ansible-playbook -i ${var.ansible_files_relative_path}/inventory-generated ${var.ansible_files_relative_path}/deploy-k3s.yml --extra-vars=\"ansible_ssh_private_key_file=${var.identity_file}\""
  }
}