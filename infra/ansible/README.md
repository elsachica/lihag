## Generera Ansible-inventory

För att automatiskt skapa en korrekt Ansible-inventory baserat på din Terraform-output, följ dessa steg:

1. **Gör scriptet körbart** (endast första gången):
    ```bash
    chmod +x generate-inventory.sh
    ```

2. **Kör scriptet**:
    ```bash
    cd infra
    ./generate-inventory.sh
    ```

Detta skapar filen `infra/ansible/inventory.ini` med rätt IP-adresser och anslutningsinformation.

---

### SSH-nyckel

Alla i teamet behöver ha sin privata SSH-nyckel (t.ex. `eg223ps-keypair.pem`) på samma sökväg som anges i scriptet, t.ex. `~/.ssh/eg223ps-keypair.pem`.  
Om du har en annan nyckel eller sökväg, ändra raden i `generate-inventory.sh` så att den pekar på din egen nyckel.

> **Tips:**  
> Det är enklast om alla använder samma namn och sökväg, men det är inget krav – scriptet kan anpassas för varje användare.