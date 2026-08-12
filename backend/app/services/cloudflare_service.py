import httpx
from app.core.config import settings

class CloudflareEmailService:
    def __init__(self):
        self.api_token = settings.cloudflare_api_token
        self.account_id = settings.cloudflare_account_id
        self.zone_id = settings.cloudflare_zone_id
        
        self.headers = {
            "Authorization": f"Bearer {self.api_token}",
            "Content-Type": "application/json"
        }
        self.base_url = "https://api.cloudflare.com/client/v4"

    async def add_destination_address(self, email: str) -> dict:
        """
        Adds a new destination address. Cloudflare will automatically 
        send a verification email to this address.
        """
        url = f"{self.base_url}/accounts/{self.account_id}/email/routing/addresses"
        payload = {"email": email}
        
        async with httpx.AsyncClient() as client:
            response = await client.post(url, headers=self.headers, json=payload)
            response.raise_for_status()
            return response.json()

    async def get_destination_addresses(self) -> dict:
        """
        List all destination addresses and their verification status.
        """
        url = f"{self.base_url}/accounts/{self.account_id}/email/routing/addresses"
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=self.headers)
            response.raise_for_status()
            return response.json()

    async def create_routing_rule(self, alias: str, destination_email: str, name: str = "Alias rule") -> dict:
        """
        Creates a routing rule to forward an alias to a destination email.
        Note: The destination email MUST be verified first.
        """
        url = f"{self.base_url}/zones/{self.zone_id}/email/routing/rules"
        
        payload = {
            "name": name,
            "enabled": True,
            "matchers": [
                {
                    "type": "literal",
                    "field": "to",
                    "value": f"{alias}@thorthehost.in"
                }
            ],
            "actions": [
                {
                    "type": "forward",
                    "value": [destination_email]
                }
            ]
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(url, headers=self.headers, json=payload)
            response.raise_for_status()
            return response.json()

cloudflare_email = CloudflareEmailService()
