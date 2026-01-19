import time
import random
from locust import HttpUser, task, between, SequentialTaskSet # type: ignore

class TenantBehavior(SequentialTaskSet):
    """
    Simulerar en hyresgästs beteende på Lihag frontend:
    1. Besöker startsidan och bläddrar bland lägenheter
    2. Tittar på lägenhetdetaljer
    3. Loggar in
    4. Går till tenant dashboard
    5. Skapar en felanmälan
    """
    
    def on_start(self):
        """Körs när en användare startar"""
        self.apartments = []
        self.token = None
        self.apartment_id = None
    
    @task
    def view_landing_page(self):
        """Besök startsidan"""
        with self.client.get("/", catch_response=True) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"Landing page failed with status {response.status_code}")
    
    @task
    def fetch_apartments(self):
        """Hämta alla lediga lägenheter"""
        with self.client.get("/property/apartments", catch_response=True, name="/property/apartments") as response:
            if response.status_code == 200:
                try:
                    data = response.json()
                    # Filtrera lediga lägenheter
                    self.apartments = [apt for apt in data if apt.get('isAvailable', False)]
                    response.success()
                except Exception as e:
                    response.failure(f"Failed to parse apartments: {str(e)}")
            else:
                response.failure(f"Fetch apartments failed with status {response.status_code}")
    
    @task
    def view_apartment_details(self):
        """Visa detaljer för en slumpmässig lägenhet"""
        if self.apartments:
            apartment = random.choice(self.apartments)
            apartment_id = apartment.get('_id')
            if apartment_id:
                with self.client.get(f"/property/apartments/{apartment_id}", 
                                    catch_response=True, 
                                    name="/property/apartments/[id]") as response:
                    if response.status_code == 200:
                        self.apartment_id = apartment_id
                        response.success()
                    else:
                        response.failure(f"Apartment details failed with status {response.status_code}")
    
    @task
    def login(self):
        """Logga in som hyresgäst"""
        # Använd testuppgifter (anpassa efter din databas)
        login_data = {
            "email": "test@test.com",
            "password": "password123"
        }
        
        with self.client.post("/login", 
                             json=login_data,
                             catch_response=True,
                             name="/login") as response:
            if response.status_code == 200:
                try:
                    data = response.json()
                    self.token = data.get('token')
                    self.apartment_id = data.get('apartmentId')
                    response.success()
                except Exception as e:
                    response.failure(f"Failed to parse login response: {str(e)}")
            else:
                response.failure(f"Login failed with status {response.status_code}")
    
    @task
    def view_tenant_dashboard(self):
        """Visa tenant dashboard sidan"""
        with self.client.get("/tenant-dashboard", catch_response=True) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"Tenant dashboard failed with status {response.status_code}")
    
    @task
    def create_maintenance_report(self):
        """Skapa en felanmälan"""
        if not self.token or not self.apartment_id:
            return
        
        categories = ['Plumbing', 'Electrical', 'Heating', 'Other']
        descriptions = [
            'Kranen i köket läcker',
            'Lampan i badrummet fungerar inte',
            'Elementet är kallt',
            'Dörrhandtaget är trasigt'
        ]
        
        report_data = {
            "category": random.choice(categories),
            "description": random.choice(descriptions),
            "apartmentId": self.apartment_id
        }
        
        headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json"
        }
        
        with self.client.post("/maintenance",
                             json=report_data,
                             headers=headers,
                             catch_response=True,
                             name="/maintenance") as response:
            if response.status_code in [200, 201]:
                response.success()
            else:
                response.failure(f"Create maintenance report failed with status {response.status_code}")
    
    @task
    def view_about_page(self):
        """Besök om oss-sidan"""
        with self.client.get("/about", catch_response=True) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"About page failed with status {response.status_code}")
    
    @task
    def view_contact_page(self):
        """Besök kontaktsidan"""
        with self.client.get("/contact", catch_response=True) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"Contact page failed with status {response.status_code}")


class AnonymousVisitor(HttpUser):
    """
    Simulerar anonyma besökare som bara surfar på publika sidor
    """
    wait_time = between(1, 5)
    
    def on_start(self):
        """Körs när en användare startar"""
        self.apartments = []
    
    @task(5)
    def view_landing_page(self):
        """Besök startsidan (högst sannolikhet)"""
        self.client.get("/", name="/")
    
    @task(3)
    def browse_apartments(self):
        """Bläddra bland lägenheter"""
        response = self.client.get("/property/apartments", name="/property/apartments")
        if response.status_code == 200:
            try:
                self.apartments = response.json()
            except:
                pass
    
    @task(2)
    def view_random_apartment(self):
        """Visa detaljer för slumpmässig lägenhet"""
        if self.apartments:
            apartment = random.choice(self.apartments)
            apartment_id = apartment.get('_id')
            if apartment_id:
                self.client.get(f"/property/apartments/{apartment_id}", 
                               name="/property/apartments/[id]")
    
    @task(1)
    def view_about(self):
        """Besök om oss"""
        self.client.get("/about", name="/about")
    
    @task(1)
    def view_contact(self):
        """Besök kontakt"""
        self.client.get("/contact", name="/contact")


class AuthenticatedTenant(HttpUser):
    """
    Simulerar inloggade hyresgäster som utför sekventiella uppgifter
    """
    wait_time = between(2, 5)
    tasks = [TenantBehavior]
    

class LihagFrontendUser(HttpUser):
    """
    Huvudklass som mixar anonyma besökare och autentiserade hyresgäster
    """
    wait_time = between(1, 3)
    
    @task(7)
    class AnonymousUserTasks(SequentialTaskSet):
        """70% av användarna är anonyma besökare"""
        
        @task
        def browse_as_anonymous(self):
            self.client.get("/", name="/")
            time.sleep(random.uniform(1, 2))
            
            response = self.client.get("/property/apartments", name="/property/apartments")
            if response.status_code == 200:
                try:
                    apartments = response.json()
                    if apartments:
                        apt = random.choice(apartments)
                        apt_id = apt.get('_id')
                        if apt_id:
                            self.client.get(f"/property/apartments/{apt_id}", 
                                          name="/property/apartments/[id]")
                except:
                    pass
            
            # Ibland besöker de andra sidor
            if random.random() < 0.3:
                self.client.get("/about", name="/about")
            if random.random() < 0.2:
                self.client.get("/contact", name="/contact")
            
            self.interrupt()
    
    @task(3)
    class AuthenticatedUserTasks(SequentialTaskSet):
        """30% av användarna loggar in och utför uppgifter"""
        
        @task
        def complete_tenant_journey(self):
            # Bläddra först
            self.client.get("/", name="/")
            response = self.client.get("/property/apartments", name="/property/apartments")
            
            apartments = []
            apartment_id = None
            
            if response.status_code == 200:
                try:
                    apartments = response.json()
                    if apartments:
                        apt = random.choice(apartments)
                        apartment_id = apt.get('_id')
                        if apartment_id:
                            self.client.get(f"/property/apartments/{apartment_id}", 
                                          name="/property/apartments/[id]")
                except:
                    pass
            
            # Logga in
            login_response = self.client.post("/login",
                                             json={"email": "test@test.com", 
                                                   "password": "password123"},
                                             name="/login")
            
            token = None
            if login_response.status_code == 200:
                try:
                    data = login_response.json()
                    token = data.get('token')
                    apartment_id = data.get('apartmentId') or apartment_id
                except:
                    pass
            
            # Besök dashboard
            self.client.get("/tenant-dashboard", name="/tenant-dashboard")
            
            # Skapa eventuellt en felanmälan
            if token and apartment_id and random.random() < 0.5:
                time.sleep(random.uniform(2, 4))
                
                self.client.post("/maintenance",
                               json={
                                   "category": random.choice(['Plumbing', 'Electrical', 'Heating', 'Other']),
                                   "description": "Test maintenance request from load test",
                                   "apartmentId": apartment_id
                               },
                               headers={"Authorization": f"Bearer {token}",
                                       "Content-Type": "application/json"},
                               name="/maintenance")
            
            self.interrupt()