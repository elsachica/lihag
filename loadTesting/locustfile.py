import time
from locust import HttpUser, task, between # type: ignore

class WebsiteUser(HttpUser):
    wait_time = between(1, 3)  # Wait 1-3 seconds between tasks
    
    @task
    def load_homepage(self):
        self.client.get("/")